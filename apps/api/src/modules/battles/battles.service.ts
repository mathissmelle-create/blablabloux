import { Injectable, NotFoundException } from "@nestjs/common";
import { BattleMode, BattleStatus, GameType } from "@prisma/client";
import { createHash, randomBytes } from "node:crypto";
import { EosService } from "../eos/eos.service.js";
import { FairnessService } from "../fairness/fairness.service.js";
import { PrismaService } from "../prisma/prisma.service.js";
import { RealtimeGateway } from "../realtime/realtime.gateway.js";
import { RealtimeService } from "../realtime/realtime.service.js";
import { CreateBattleDto } from "./dto/create-battle.dto.js";

@Injectable()
export class BattlesService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly eosService: EosService,
    private readonly fairnessService: FairnessService,
    private readonly realtimeService: RealtimeService,
    private readonly realtimeGateway: RealtimeGateway,
  ) {}

  listLiveBattles() {
    return this.prisma.battle.findMany({
      where: {
        status: {
          in: [BattleStatus.CREATED, BattleStatus.FILLING, BattleStatus.COUNTDOWN, BattleStatus.RUNNING],
        },
      },
      include: {
        participants: true,
      },
      orderBy: { createdAt: "desc" },
    });
  }

  async getBattleSnapshot(battleId: string) {
    const battle = await this.prisma.battle.findUnique({
      where: { id: battleId },
      include: {
        participants: true,
        rounds: {
          include: {
            results: {
              include: {
                itemDefinition: true,
                participant: true,
              },
            },
          },
          orderBy: { roundNumber: "asc" },
        },
      },
    });
    if (!battle) {
      throw new NotFoundException("Battle not found");
    }
    return battle;
  }

  async createBattle(userId: string, dto: CreateBattleDto) {
    const headBlockNumber = await this.eosService.getHeadBlockNumber();
    const targetEosBlock = headBlockNumber + 3;
    const serverSeed = randomBytes(32).toString("hex");
    const hashedServerSeed = createHash("sha256").update(serverSeed).digest("hex");

    const battle = await this.prisma.$transaction(async (tx) => {
      const battleEntity = await tx.battle.create({
        data: {
          mode: dto.mode,
          teamSize: dto.teamSize,
          maxPlayers: dto.maxPlayers,
          status: "FILLING",
          createdByUserId: userId,
          caseOrderSnapshot: dto.caseVersionIds,
          serverSeedEncrypted: serverSeed,
          hashedServerSeed,
          targetEosBlockNumber: targetEosBlock,
        },
      });

      await tx.battleParticipant.create({
        data: {
          battleId: battleEntity.id,
          userId,
          seatIndex: 0,
          teamIndex: this.computeTeamIndex(0, dto.teamSize),
          isBot: false,
        },
      });

      for (let idx = 0; idx < dto.caseVersionIds.length; idx += 1) {
        const caseVersionId = dto.caseVersionIds[idx];
        if (!caseVersionId) {
          throw new Error("Invalid case version sequence");
        }
        await tx.battleRound.create({
          data: {
            battleId: battleEntity.id,
            roundNumber: idx + 1,
            caseVersionId,
          },
        });
      }

      await tx.fairnessRecord.create({
        data: {
          gameType: GameType.battle,
          referenceId: battleEntity.id,
          serverSeedHash: hashedServerSeed,
          derivationInput: {
            mode: dto.mode,
            teamSize: dto.teamSize,
            maxPlayers: dto.maxPlayers,
            targetEosBlock,
          },
          resultHash: hashedServerSeed,
          immutableHash: createHash("sha256").update(`${battleEntity.id}:${hashedServerSeed}`).digest("hex"),
        },
      });

      return battleEntity;
    });

    const envelope = this.realtimeService.nextEnvelope(`battle:${battle.id}`, "battle.created", {
      battleId: battle.id,
      mode: dto.mode,
      maxPlayers: dto.maxPlayers,
      targetEosBlock,
      hashedServerSeed,
    });
    this.realtimeGateway.emitToBattleRoom(battle.id, "battle:event", envelope);

    return battle;
  }

  async joinBattle(userId: string, battleId: string) {
    const participant = await this.prisma.$transaction(async (tx) => {
      const battle = await tx.battle.findUnique({
        where: { id: battleId },
        include: { participants: true },
      });
      if (!battle) {
        throw new NotFoundException("Battle not found");
      }

      if (battle.status !== "FILLING" && battle.status !== "CREATED") {
        throw new Error("Battle is not joinable");
      }

      if (battle.participants.some((entry) => entry.userId === userId)) {
        throw new Error("User already joined");
      }

      if (battle.participants.length >= battle.maxPlayers) {
        throw new Error("Battle is full");
      }

      const seatIndex = this.nextSeatIndex(battle.participants.map((entry) => entry.seatIndex), battle.maxPlayers);
      const created = await tx.battleParticipant.create({
        data: {
          battleId,
          userId,
          seatIndex,
          teamIndex: this.computeTeamIndex(seatIndex, battle.teamSize),
        },
      });

      const nextCount = battle.participants.length + 1;
      if (nextCount === battle.maxPlayers) {
        await tx.battle.update({
          where: { id: battleId },
          data: {
            status: "COUNTDOWN",
            startsAt: new Date(Date.now() + 5_000),
          },
        });
      }

      return created;
    });

    const envelope = this.realtimeService.nextEnvelope(`battle:${battleId}`, "battle.participant_joined", {
      battleId,
      participantId: participant.id,
      userId,
      seatIndex: participant.seatIndex,
      teamIndex: participant.teamIndex,
    });
    this.realtimeGateway.emitToBattleRoom(battleId, "battle:event", envelope);

    return participant;
  }

  async resolveRound(battleId: string, roundNumber: number) {
    const battle = await this.prisma.battle.findUnique({
      where: { id: battleId },
      include: {
        participants: true,
        rounds: {
          where: { roundNumber },
          include: {
            caseVersion: { include: { caseItems: { include: { itemDefinition: true } } } },
          },
        },
      },
    });
    if (!battle) {
      throw new NotFoundException("Battle not found");
    }
    const round = battle.rounds[0];
    if (!round) {
      throw new NotFoundException("Battle round not found");
    }
    if (round.status === "RESOLVED") {
      return round;
    }

    const eosHash = battle.eosBlockHash ?? (await this.eosService.waitForBlockHash(battle.targetEosBlockNumber));
    const totalWeight = round.caseVersion.caseItems.reduce((acc, item) => acc + item.weight, 0);
    if (totalWeight <= 0) {
      throw new Error("Invalid case configuration for battle round");
    }

    await this.prisma.$transaction(async (tx) => {
      if (!battle.eosBlockHash) {
        await tx.battle.update({
          where: { id: battle.id },
          data: { eosBlockHash: eosHash, status: "RUNNING" },
        });
      }

      await tx.battleRound.update({
        where: { id: round.id },
        data: { status: "RUNNING", startsAt: new Date() },
      });

      for (const participant of battle.participants) {
        const derived = this.fairnessService.deriveBattleTicket(
          {
            battleId: battle.id,
            roundNumber,
            seatIndex: participant.seatIndex,
            battleServerSeed: battle.serverSeedEncrypted,
            eosBlockHash: eosHash,
          },
          totalWeight,
        );

        let cumulative = 0;
        const winnerItem = round.caseVersion.caseItems.find((item) => {
          cumulative += item.weight;
          return derived.ticket < cumulative;
        });
        if (!winnerItem) {
          throw new Error("Failed to map battle round ticket");
        }

        const isGoldSpin = winnerItem.isGoldEligible;

        await tx.battleRoundResult.create({
          data: {
            battleRoundId: round.id,
            participantId: participant.id,
            itemDefinitionId: winnerItem.itemDefinitionId,
            ticket: BigInt(derived.ticket),
            itemValue: winnerItem.itemDefinition.value,
            isGoldSpin,
          },
        });

        await tx.battleParticipant.update({
          where: { id: participant.id },
          data: {
            totalValue: participant.totalValue.add(winnerItem.itemDefinition.value),
          },
        });
      }

      await tx.battleRound.update({
        where: { id: round.id },
        data: { status: "RESOLVED", resolvedAt: new Date() },
      });
    });

    const snapshot = await this.finalizeBattleIfReady(battleId, eosHash);
    const roundView = snapshot.rounds.find((entry) => entry.roundNumber === roundNumber);
    const specialEvent =
      roundView?.results.some((result) => result.isGoldSpin) === true
        ? {
            type: "gold_spin",
            roundNumber,
          }
        : null;

    const envelope = this.realtimeService.nextEnvelope(`battle:${battleId}`, "battle.round_resolved", {
      battleId,
      roundNumber,
      specialEvent,
      snapshot,
    });
    this.realtimeGateway.emitToBattleRoom(battleId, "battle:event", envelope);
    return snapshot;
  }

  private async finalizeBattleIfReady(battleId: string, eosHash: string) {
    const snapshot = await this.getBattleSnapshot(battleId);
    if (snapshot.status === "RESOLVED" || snapshot.status === "CANCELLED") {
      return snapshot;
    }

    const allResolved = snapshot.rounds.length > 0 && snapshot.rounds.every((round) => round.status === "RESOLVED");
    if (!allResolved) {
      return snapshot;
    }

    const participantTotals = this.computeParticipantTotals(snapshot);
    const totalPool = Array.from(participantTotals.values()).reduce((acc, value) => acc + value, 0);

    const winner = this.determineWinner({
      mode: snapshot.mode,
      battleId: snapshot.id,
      battleServerSeed: snapshot.serverSeedEncrypted,
      eosHash,
      participantTotals,
      participants: snapshot.participants.map((participant) => ({
        id: participant.id,
        seatIndex: participant.seatIndex,
        teamIndex: participant.teamIndex,
      })),
      rounds: snapshot.rounds.map((round) => ({
        roundNumber: round.roundNumber,
        results: round.results.map((result) => ({
          participantId: result.participantId,
          value: result.itemValue.toNumber(),
        })),
      })),
    });

    const updated = await this.prisma.battle.update({
      where: { id: battleId },
      data: {
        status: "RESOLVED",
        winnerParticipantId: winner.winnerParticipantId,
        winnerTeamIndex: winner.winnerTeamIndex,
        resolvedAt: new Date(),
        totalPoolValue: totalPool,
      },
      include: {
        participants: true,
        rounds: {
          include: {
            results: {
              include: {
                itemDefinition: true,
                participant: true,
              },
            },
          },
          orderBy: { roundNumber: "asc" },
        },
      },
    });

    const envelope = this.realtimeService.nextEnvelope(`battle:${battleId}`, "battle.finalized", {
      battleId,
      mode: snapshot.mode,
      winnerParticipantId: winner.winnerParticipantId,
      winnerTeamIndex: winner.winnerTeamIndex,
      totalPoolValue: totalPool,
    });
    this.realtimeGateway.emitToBattleRoom(battleId, "battle:event", envelope);

    return updated;
  }

  private computeParticipantTotals(snapshot: Awaited<ReturnType<BattlesService["getBattleSnapshot"]>>) {
    const totals = new Map<string, number>();
    for (const participant of snapshot.participants) {
      totals.set(participant.id, 0);
    }

    for (const round of snapshot.rounds) {
      for (const result of round.results) {
        totals.set(result.participantId, (totals.get(result.participantId) ?? 0) + result.itemValue.toNumber());
      }
    }

    return totals;
  }

  private determineWinner(input: {
    mode: BattleMode;
    battleId: string;
    battleServerSeed: string;
    eosHash: string;
    participantTotals: Map<string, number>;
    participants: Array<{ id: string; seatIndex: number; teamIndex: number }>;
    rounds: Array<{ roundNumber: number; results: Array<{ participantId: string; value: number }> }>;
  }) {
    const teamMode = new Set(input.participants.map((entry) => entry.teamIndex)).size > 1;
    if (input.mode === BattleMode.JACKPOT || input.mode === BattleMode.CRAZY_JACKPOT) {
      const winnerTeamIndex = teamMode
        ? this.pickJackpotWinnerTeam(input, input.mode === BattleMode.CRAZY_JACKPOT)
        : null;
      if (teamMode) {
        return { winnerParticipantId: this.pickRepresentative(input.participants, winnerTeamIndex), winnerTeamIndex };
      }

      const winnerParticipantId = this.pickJackpotWinnerParticipant(
        input,
        input.mode === BattleMode.CRAZY_JACKPOT,
      );
      return { winnerParticipantId, winnerTeamIndex: null };
    }

    if (input.mode === BattleMode.TERMINAL) {
      return this.pickTerminalWinner(input, teamMode);
    }

    return this.pickValueWinner(input, teamMode, input.mode === BattleMode.CRAZY);
  }

  private pickValueWinner(
    input: {
      battleId: string;
      battleServerSeed: string;
      eosHash: string;
      participantTotals: Map<string, number>;
      participants: Array<{ id: string; seatIndex: number; teamIndex: number }>;
    },
    teamMode: boolean,
    reverse: boolean,
  ) {
    if (teamMode) {
      const teamTotals = new Map<number, number>();
      for (const participant of input.participants) {
        teamTotals.set(
          participant.teamIndex,
          (teamTotals.get(participant.teamIndex) ?? 0) + (input.participantTotals.get(participant.id) ?? 0),
        );
      }

      const selectedTeamIndex = this.pickByComparatorWithTieBreaker(
        Array.from(teamTotals.entries()).map(([teamIndex, score]) => ({
          key: teamIndex,
          score,
        })),
        reverse,
        input.battleId,
        input.battleServerSeed,
        input.eosHash,
        9001,
      );

      return {
        winnerParticipantId: this.pickRepresentative(input.participants, selectedTeamIndex),
        winnerTeamIndex: selectedTeamIndex,
      };
    }

    const selectedParticipantId = this.pickByComparatorWithTieBreaker(
      input.participants.map((participant) => ({
        key: participant.id,
        score: input.participantTotals.get(participant.id) ?? 0,
        seatIndex: participant.seatIndex,
      })),
      reverse,
      input.battleId,
      input.battleServerSeed,
      input.eosHash,
      9002,
    );
    return {
      winnerParticipantId: selectedParticipantId,
      winnerTeamIndex: null,
    };
  }

  private pickTerminalWinner(
    input: {
      battleId: string;
      battleServerSeed: string;
      eosHash: string;
      participants: Array<{ id: string; seatIndex: number; teamIndex: number }>;
      rounds: Array<{ roundNumber: number; results: Array<{ participantId: string; value: number }> }>;
    },
    teamMode: boolean,
  ) {
    const lastRound = input.rounds.reduce((acc, current) =>
      current.roundNumber > acc.roundNumber ? current : acc,
    );
    if (!lastRound) {
      throw new Error("Terminal mode requires at least one round");
    }

    if (teamMode) {
      const perTeam = new Map<number, number>();
      for (const result of lastRound.results) {
        const participant = input.participants.find((entry) => entry.id === result.participantId);
        if (!participant) {
          continue;
        }
        perTeam.set(participant.teamIndex, (perTeam.get(participant.teamIndex) ?? 0) + result.value);
      }

      const winnerTeamIndex = this.pickByComparatorWithTieBreaker(
        Array.from(perTeam.entries()).map(([teamIndex, score]) => ({ key: teamIndex, score })),
        false,
        input.battleId,
        input.battleServerSeed,
        input.eosHash,
        9010,
      );
      return {
        winnerParticipantId: this.pickRepresentative(input.participants, winnerTeamIndex),
        winnerTeamIndex,
      };
    }

    const perParticipant = new Map<string, number>();
    for (const result of lastRound.results) {
      perParticipant.set(result.participantId, result.value);
    }
    const winnerParticipantId = this.pickByComparatorWithTieBreaker(
      input.participants.map((participant) => ({
        key: participant.id,
        score: perParticipant.get(participant.id) ?? 0,
        seatIndex: participant.seatIndex,
      })),
      false,
      input.battleId,
      input.battleServerSeed,
      input.eosHash,
      9011,
    );

    return {
      winnerParticipantId,
      winnerTeamIndex: null,
    };
  }

  private pickJackpotWinnerParticipant(
    input: {
      battleId: string;
      battleServerSeed: string;
      eosHash: string;
      participantTotals: Map<string, number>;
      participants: Array<{ id: string; seatIndex: number }>;
    },
    reverseWeight: boolean,
  ) {
    const max = Math.max(...Array.from(input.participantTotals.values()), 0);
    const entries = input.participants.map((participant) => {
      const value = input.participantTotals.get(participant.id) ?? 0;
      const weight = reverseWeight ? Math.max(0.0001, max - value + 0.01) : Math.max(0.0001, value);
      return { key: participant.id, weight, seatIndex: participant.seatIndex };
    });
    return this.pickWeighted(entries, input.battleId, input.battleServerSeed, input.eosHash, 9020);
  }

  private pickJackpotWinnerTeam(
    input: {
      battleId: string;
      battleServerSeed: string;
      eosHash: string;
      participantTotals: Map<string, number>;
      participants: Array<{ id: string; teamIndex: number }>;
    },
    reverseWeight: boolean,
  ) {
    const teamTotals = new Map<number, number>();
    for (const participant of input.participants) {
      teamTotals.set(
        participant.teamIndex,
        (teamTotals.get(participant.teamIndex) ?? 0) + (input.participantTotals.get(participant.id) ?? 0),
      );
    }

    const max = Math.max(...Array.from(teamTotals.values()), 0);
    const entries = Array.from(teamTotals.entries()).map(([teamIndex, value]) => ({
      key: teamIndex,
      weight: reverseWeight ? Math.max(0.0001, max - value + 0.01) : Math.max(0.0001, value),
    }));
    return this.pickWeighted(entries, input.battleId, input.battleServerSeed, input.eosHash, 9021);
  }

  private pickByComparatorWithTieBreaker<T extends { key: string | number; score: number; seatIndex?: number }>(
    entries: T[],
    reverse: boolean,
    battleId: string,
    battleServerSeed: string,
    eosHash: string,
    nonceSalt: number,
  ): T["key"] {
    if (entries.length === 0) {
      throw new Error("Cannot pick winner from empty entries");
    }

    const ordered = [...entries].sort((a, b) => (reverse ? a.score - b.score : b.score - a.score));
    const bestScore = ordered[0]?.score ?? 0;
    const ties = ordered.filter((entry) => entry.score === bestScore);
    if (ties.length === 1) {
      return ties[0]?.key as T["key"];
    }

    const tieBreak = this.fairnessService.deriveBattleTicket(
      {
        battleId,
        roundNumber: nonceSalt,
        seatIndex: ties.length,
        battleServerSeed,
        eosBlockHash: eosHash,
      },
      ties.length,
    );

    return ties[tieBreak.ticket]?.key as T["key"];
  }

  private pickWeighted<T extends { key: string | number; weight: number }>(
    entries: T[],
    battleId: string,
    battleServerSeed: string,
    eosHash: string,
    nonceSalt: number,
  ): T["key"] {
    const normalized = entries.map((entry) => ({ ...entry, integerWeight: Math.max(1, Math.round(entry.weight * 10_000)) }));
    const total = normalized.reduce((acc, value) => acc + value.integerWeight, 0);
    const draw = this.fairnessService.deriveBattleTicket(
      {
        battleId,
        roundNumber: nonceSalt,
        seatIndex: normalized.length,
        battleServerSeed,
        eosBlockHash: eosHash,
      },
      total,
    );

    let cursor = 0;
    for (const entry of normalized) {
      cursor += entry.integerWeight;
      if (draw.ticket < cursor) {
        return entry.key as T["key"];
      }
    }

    return normalized[normalized.length - 1]?.key as T["key"];
  }

  private pickRepresentative(participants: Array<{ id: string; teamIndex: number }>, winnerTeamIndex: number | null) {
    if (winnerTeamIndex === null) {
      return null;
    }
    return participants.find((participant) => participant.teamIndex === winnerTeamIndex)?.id ?? null;
  }

  private nextSeatIndex(usedSeats: number[], maxPlayers: number) {
    for (let idx = 0; idx < maxPlayers; idx += 1) {
      if (!usedSeats.includes(idx)) {
        return idx;
      }
    }
    throw new Error("No seats left");
  }

  private computeTeamIndex(seatIndex: number, teamSize: number) {
    return Math.floor(seatIndex / teamSize);
  }
}
