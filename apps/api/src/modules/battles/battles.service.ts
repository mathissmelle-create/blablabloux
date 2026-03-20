import { Injectable, NotFoundException } from "@nestjs/common";
import { BattleMode, BattleStatus, GameType, Prisma } from "@prisma/client";
import { createHash, randomBytes } from "node:crypto";
import { EosService } from "../eos/eos.service.js";
import { PrismaService } from "../prisma/prisma.service.js";
import { BattleEventsService } from "./battle-events.service.js";
import { BattleFairnessService } from "./battle-fairness.service.js";
import { BattleStateMachineService } from "./battle-state-machine.service.js";
import { CreateBattleDto } from "./dto/create-battle.dto.js";
import { formatToSeats, parseMode } from "./battle.types.js";

@Injectable()
export class BattlesService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly eosService: EosService,
    private readonly stateMachine: BattleStateMachineService,
    private readonly battleFairness: BattleFairnessService,
    private readonly battleEvents: BattleEventsService,
  ) {}

  listLiveBattles() {
    return this.prisma.battle.findMany({
      where: {
        status: {
          in: [
            BattleStatus.CREATED,
            BattleStatus.WAITING_FOR_PLAYERS,
            BattleStatus.LOCKED,
            BattleStatus.START_COUNTDOWN,
            BattleStatus.ACTIVE_ROUNDS,
            BattleStatus.RESOLVING,
          ],
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
        participants: {
          include: {
            user: {
              select: {
                id: true,
                username: true,
              },
            },
          },
        },
        rounds: {
          include: {
            caseVersion: {
              include: {
                case: true,
              },
            },
            results: {
              include: {
                itemDefinition: true,
                participant: true,
              },
            },
            goldSpins: {
              include: {
                resultItemDefinition: true,
                participant: true,
              },
            },
          },
          orderBy: { roundNumber: "asc" },
        },
        events: {
          orderBy: { sequence: "asc" },
          take: 300,
        },
      },
    });
    if (!battle) {
      throw new NotFoundException("Battle not found");
    }
    return battle;
  }

  async getBattleEvents(battleId: string, afterSequence = 0) {
    return this.prisma.battleEvent.findMany({
      where: {
        battleId,
        sequence: {
          gt: afterSequence,
        },
      },
      orderBy: { sequence: "asc" },
      take: 500,
    });
  }

  async createBattle(userId: string, dto: CreateBattleDto) {
    if (dto.enableBots) {
      throw new Error("Bots are disabled by default");
    }

    const mode = parseMode(dto.mode);
    const format = formatToSeats(dto.format);
    const headBlockNumber = await this.eosService.getHeadBlockNumber();
    const targetEosBlock = headBlockNumber + 3;
    const serverSeed = randomBytes(32).toString("hex");
    const hashedServerSeed = createHash("sha256").update(serverSeed).digest("hex");
    const inviteCode = dto.privacy === "private" ? dto.inviteCode ?? this.generateInviteCode() : null;
    const countdownSeconds = dto.countdownSeconds ?? 4;

    const versions = await this.prisma.caseVersion.findMany({
      where: {
        id: { in: dto.caseVersionIds },
      },
      include: {
        case: true,
        caseItems: {
          include: {
            itemDefinition: true,
          },
          orderBy: { ticketStart: "asc" },
        },
      },
    });

    if (versions.length !== dto.caseVersionIds.length) {
      throw new Error("Invalid case version list for battle");
    }

    const orderedSnapshots = dto.caseVersionIds.map((id) => {
      const found = versions.find((entry) => entry.id === id);
      if (!found) {
        throw new Error(`Case version not found in ordered snapshot: ${id}`);
      }
      return {
        caseVersionId: found.id,
        caseId: found.caseId,
        caseName: found.case.name,
        casePrice: found.case.price.toString(),
        snapshotHash: found.snapshotHash,
        items: found.caseItems.map((item) => ({
          itemDefinitionId: item.itemDefinitionId,
          weight: item.weight,
          ticketStart: item.ticketStart.toString(),
          ticketEnd: item.ticketEnd.toString(),
          isGoldEligible: item.isGoldEligible,
          value: item.itemDefinition.value.toString(),
        })),
      };
    });

    const battle = await this.prisma.$transaction(async (tx) => {
      const created = await tx.battle.create({
        data: {
          mode,
          format: format.prismaFormat,
          privacy: dto.privacy === "private" ? "PRIVATE" : "PUBLIC",
          inviteCode,
          teamSize: format.teamSize,
          maxPlayers: format.maxPlayers,
          status: "CREATED",
          createdByUserId: userId,
          caseOrderSnapshot: orderedSnapshots,
          serverSeedEncrypted: serverSeed,
          hashedServerSeed,
          targetEosBlockNumber: targetEosBlock,
        },
      });

      this.stateMachine.ensureTransition(created.status, "WAITING_FOR_PLAYERS");
      await tx.battle.update({
        where: { id: created.id },
        data: {
          status: "WAITING_FOR_PLAYERS",
        },
      });

      await tx.battleParticipant.create({
        data: {
          battleId: created.id,
          userId,
          seatIndex: 0,
          teamIndex: this.computeTeamIndex(0, format.teamSize),
        },
      });

      for (let index = 0; index < dto.caseVersionIds.length; index += 1) {
        const caseVersionId = dto.caseVersionIds[index];
        if (!caseVersionId) {
          throw new Error("Invalid case order entry");
        }
        await tx.battleRound.create({
          data: {
            battleId: created.id,
            roundNumber: index + 1,
            caseVersionId,
          },
        });
      }

      await tx.fairnessRecord.create({
        data: {
          gameType: GameType.battle,
          referenceId: created.id,
          serverSeedHash: hashedServerSeed,
          derivationInput: {
            mode: dto.mode,
            format: dto.format,
            privacy: dto.privacy,
            maxPlayers: format.maxPlayers,
            teamSize: format.teamSize,
            countdownSeconds,
            targetEosBlock,
            caseSnapshotHash: this.snapshotHash(orderedSnapshots),
          },
          resultHash: hashedServerSeed,
          immutableHash: createHash("sha256").update(`${created.id}:${hashedServerSeed}`).digest("hex"),
        },
      });

      return created;
    });

    await this.battleEvents.emitEvent(battle.id, "battle_created", {
      mode: dto.mode,
      format: dto.format,
      privacy: dto.privacy,
      caseOrder: orderedSnapshots.map((entry) => ({
        caseVersionId: entry.caseVersionId,
        caseName: entry.caseName,
      })),
      targetEosBlock,
      hashedServerSeed,
      countdownSeconds,
    });

    await this.battleEvents.emitEvent(battle.id, "player_joined", {
      userId,
      seatIndex: 0,
      teamIndex: this.computeTeamIndex(0, format.teamSize),
      participantsCount: 1,
    });

    return battle;
  }

  async joinBattle(userId: string, battleId: string) {
    const joinResult = await this.prisma.$transaction(async (tx) => {
      const battle = await tx.battle.findUnique({
        where: { id: battleId },
        include: { participants: true },
      });
      if (!battle) {
        throw new NotFoundException("Battle not found");
      }

      if (battle.status !== "WAITING_FOR_PLAYERS" && battle.status !== "CREATED") {
        throw new Error("Battle is not joinable");
      }

      if (battle.participants.some((entry) => entry.userId === userId)) {
        throw new Error("User already joined");
      }

      if (battle.participants.length >= battle.maxPlayers) {
        throw new Error("Battle is full");
      }

      const seatIndex = this.nextSeatIndex(
        battle.participants.map((entry) => entry.seatIndex),
        battle.maxPlayers,
      );
      const participant = await tx.battleParticipant.create({
        data: {
          battleId,
          userId,
          seatIndex,
          teamIndex: this.computeTeamIndex(seatIndex, battle.teamSize),
        },
      });

      const isNowFull = battle.participants.length + 1 === battle.maxPlayers;
      let countdownStartAt: Date | null = null;
      if (isNowFull) {
        this.stateMachine.ensureTransition(battle.status, "LOCKED");
        const locked = await tx.battle.update({
          where: { id: battleId },
          data: {
            status: "LOCKED",
            lockedAt: new Date(),
          },
        });

        this.stateMachine.ensureTransition(locked.status, "START_COUNTDOWN");
        countdownStartAt = new Date(Date.now() + 4_000);
        await tx.battle.update({
          where: { id: battleId },
          data: {
            status: "START_COUNTDOWN",
            countdownStartedAt: new Date(),
            startsAt: countdownStartAt,
          },
        });
      } else if (battle.status === "CREATED") {
        this.stateMachine.ensureTransition("CREATED", "WAITING_FOR_PLAYERS");
        await tx.battle.update({
          where: { id: battleId },
          data: {
            status: "WAITING_FOR_PLAYERS",
          },
        });
      }

      return {
        participant,
        participantsCount: battle.participants.length + 1,
        countdownStartAt,
      };
    });

    await this.battleEvents.emitEvent(battleId, "player_joined", {
      userId,
      participantId: joinResult.participant.id,
      seatIndex: joinResult.participant.seatIndex,
      teamIndex: joinResult.participant.teamIndex,
      participantsCount: joinResult.participantsCount,
    });

    if (joinResult.countdownStartAt) {
      const snapshot = await this.getBattleSnapshot(battleId);
      await this.battleEvents.emitEvent(battleId, "battle_locked", {
        participants: snapshot.participants.map((entry) => ({
          participantId: entry.id,
          userId: entry.userId,
          seatIndex: entry.seatIndex,
          teamIndex: entry.teamIndex,
        })),
      });
      await this.battleEvents.emitEvent(battleId, "countdown_started", {
        startsAt: joinResult.countdownStartAt.toISOString(),
        countdownSeconds: 4,
      });
    }

    return joinResult.participant;
  }

  async resolveRound(battleId: string, roundNumber: number) {
    const battle = await this.prisma.battle.findUnique({
      where: { id: battleId },
      include: {
        participants: true,
        rounds: {
          where: { roundNumber },
          include: {
            caseVersion: {
              include: {
                case: true,
                caseItems: {
                  include: {
                    itemDefinition: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    if (!battle) {
      throw new NotFoundException("Battle not found");
    }

    const round = battle.rounds[0];
    if (!round) {
      throw new NotFoundException("Round not found");
    }
    if (round.status === "RESOLVED") {
      return this.getBattleSnapshot(battleId);
    }

    if (battle.status === "START_COUNTDOWN" && battle.startsAt && battle.startsAt.getTime() > Date.now()) {
      throw new Error("Battle countdown is still in progress");
    }
    if (
      battle.status !== "START_COUNTDOWN" &&
      battle.status !== "ACTIVE_ROUNDS" &&
      battle.status !== "RESOLVING"
    ) {
      throw new Error(`Battle is not active for round resolution (status: ${battle.status})`);
    }

    const eosHash = battle.eosBlockHash ?? (await this.eosService.waitForBlockHash(battle.targetEosBlockNumber));

    await this.prisma.$transaction(async (tx) => {
      if (battle.status === "START_COUNTDOWN") {
        this.stateMachine.ensureTransition("START_COUNTDOWN", "ACTIVE_ROUNDS");
        await tx.battle.update({
          where: { id: battle.id },
          data: {
            status: "ACTIVE_ROUNDS",
          },
        });
      }

      if (!battle.eosBlockHash) {
        await tx.battle.update({
          where: { id: battle.id },
          data: { eosBlockHash: eosHash },
        });
      }

      const animationStartAt = new Date(Date.now() + 850);
      await tx.battleRound.update({
        where: { id: round.id },
        data: {
          status: "RUNNING",
          startsAt: new Date(),
          animationStartAt,
        },
      });

      const participantsSorted = [...battle.participants].sort((a, b) => a.seatIndex - b.seatIndex);
      const computedResults = this.battleFairness.computeRoundResults({
        battleId: battle.id,
        roundNumber,
        battleServerSeed: battle.serverSeedEncrypted,
        eosBlockHash: eosHash,
        caseItems: round.caseVersion.caseItems,
        seatIndexes: participantsSorted.map((entry) => entry.seatIndex),
        mode: battle.mode,
        casePrice: round.caseVersion.case.price,
      });

      const goldPool = round.caseVersion.caseItems.filter((item) => {
        return item.isGoldEligible && item.itemDefinition.value.greaterThanOrEqualTo(round.caseVersion.case.price.mul(8));
      });

      for (const computed of computedResults) {
        const participant = participantsSorted.find((entry) => entry.seatIndex === computed.seatIndex);
        if (!participant) {
          throw new Error("Computed result seat is missing participant");
        }

        await tx.battleRoundResult.create({
          data: {
            battleRoundId: round.id,
            participantId: participant.id,
            itemDefinitionId: computed.itemDefinitionId,
            ticket: computed.ticket,
            baitIndex: computed.baitIndex,
            itemValue: computed.itemValue,
            isGoldSpin: computed.isGoldSpin,
          },
        });

        await tx.battleParticipant.update({
          where: { id: participant.id },
          data: {
            totalValue: participant.totalValue.add(computed.itemValue),
          },
        });

        if (computed.isGoldSpin && goldPool.length > 0) {
          const winnerDefinitionId = this.battleFairness.pickJackpotWinnerByContribution(
            `${battle.id}:${roundNumber}:${participant.seatIndex}:gold_spin`,
            battle.serverSeedEncrypted,
            eosHash,
            goldPool.map((entry) => ({
              key: entry.itemDefinitionId,
              weight: entry.weight,
            })),
          );
          const goldResult = goldPool.find((entry) => entry.itemDefinitionId === winnerDefinitionId) ?? goldPool[0];
          if (goldResult) {
            await tx.battleGoldSpin.create({
              data: {
                battleId: battle.id,
                battleRoundId: round.id,
                participantId: participant.id,
                triggerItemValue: computed.itemValue,
                resultItemDefinitionId: goldResult.itemDefinitionId,
                resultItemValue: goldResult.itemDefinition.value,
              },
            });
          }
        }
      }

      await tx.battleRound.update({
        where: { id: round.id },
        data: {
          status: "RESOLVED",
          resolvedAt: new Date(),
        },
      });
    });

    const snapshot = await this.getBattleSnapshot(battleId);
    const roundSnapshot = snapshot.rounds.find((entry) => entry.roundNumber === roundNumber);
    if (!roundSnapshot) {
      throw new Error("Resolved round snapshot is missing");
    }

    await this.battleEvents.emitEvent(battleId, "round_start", {
      roundNumber,
      animationStartAtMs: roundSnapshot.animationStartAt?.getTime() ?? Date.now(),
      results: roundSnapshot.results.map((result) => ({
        participantId: result.participantId,
        itemDefinitionId: result.itemDefinitionId,
        ticket: result.ticket.toString(),
        baitIndex: result.baitIndex,
        itemValue: result.itemValue.toString(),
        isGoldSpin: result.isGoldSpin,
      })),
      fairness: {
        battleId,
        eosBlockHash: snapshot.eosBlockHash,
        hashedServerSeed: snapshot.hashedServerSeed,
      },
    });

    await this.battleEvents.emitEvent(battleId, "round_animation_start_timestamp", {
      roundNumber,
      serverTimestampMs: roundSnapshot.animationStartAt?.getTime() ?? Date.now(),
      synchronized: true,
    });

    for (const goldSpin of roundSnapshot.goldSpins) {
      await this.battleEvents.emitEvent(battleId, "gold_spin_triggered", {
        roundNumber,
        participantId: goldSpin.participantId,
        triggerItemValue: goldSpin.triggerItemValue.toString(),
        resultItemDefinitionId: goldSpin.resultItemDefinitionId,
        resultItemValue: goldSpin.resultItemValue.toString(),
      });
    }

    await this.battleEvents.emitEvent(battleId, "round_complete", {
      roundNumber,
      totals: snapshot.participants.map((entry) => ({
        participantId: entry.id,
        teamIndex: entry.teamIndex,
        totalValue: entry.totalValue.toString(),
      })),
      history: snapshot.rounds.map((entry) => ({
        roundNumber: entry.roundNumber,
        results: entry.results.map((result) => ({
          participantId: result.participantId,
          itemDefinitionId: result.itemDefinitionId,
          itemValue: result.itemValue.toString(),
        })),
      })),
    });

    return this.finalizeBattleIfReady(battleId, eosHash);
  }

  private async finalizeBattleIfReady(battleId: string, eosHash: string) {
    const snapshot = await this.getBattleSnapshot(battleId);
    if (snapshot.status === "COMPLETED" || snapshot.status === "CANCELLED") {
      return snapshot;
    }

    const allResolved = snapshot.rounds.length > 0 && snapshot.rounds.every((round) => round.status === "RESOLVED");
    if (!allResolved) {
      return snapshot;
    }

    this.stateMachine.ensureTransition(snapshot.status, "RESOLVING");
    await this.prisma.battle.update({
      where: { id: battleId },
      data: { status: "RESOLVING" },
    });

    const refreshed = await this.getBattleSnapshot(battleId);
    const participantTotals = this.computeParticipantTotals(refreshed);
    const totalPool = Array.from(participantTotals.values()).reduce((acc, value) => acc + value, 0);

    const winner = this.determineWinner({
      mode: refreshed.mode,
      battleId: refreshed.id,
      battleServerSeed: refreshed.serverSeedEncrypted,
      eosHash,
      participantTotals,
      teamSize: refreshed.teamSize,
      participants: refreshed.participants.map((participant) => ({
        id: participant.id,
        seatIndex: participant.seatIndex,
        teamIndex: participant.teamIndex,
      })),
      rounds: refreshed.rounds.map((round) => ({
        roundNumber: round.roundNumber,
        results: round.results.map((result) => ({
          participantId: result.participantId,
          value: result.itemValue.toNumber(),
        })),
      })),
    });

    this.stateMachine.ensureTransition("RESOLVING", "COMPLETED");
    await this.prisma.battle.update({
      where: { id: battleId },
      data: {
        status: "COMPLETED",
        winnerParticipantId: winner.winnerParticipantId,
        winnerTeamIndex: winner.winnerTeamIndex,
        totalPoolValue: new Prisma.Decimal(totalPool.toFixed(2)),
        resolvedAt: new Date(),
        completedAt: new Date(),
      },
    });

    const completed = await this.getBattleSnapshot(battleId);
    await this.battleEvents.emitEvent(battleId, "battle_complete", {
      mode: completed.mode,
      winnerParticipantId: completed.winnerParticipantId,
      winnerTeamIndex: completed.winnerTeamIndex,
      totalPoolValue: completed.totalPoolValue?.toString() ?? "0",
      participants: completed.participants.map((entry) => ({
        participantId: entry.id,
        teamIndex: entry.teamIndex,
        totalValue: entry.totalValue.toString(),
      })),
    });

    return completed;
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
    teamSize: number;
    participants: Array<{ id: string; seatIndex: number; teamIndex: number }>;
    rounds: Array<{ roundNumber: number; results: Array<{ participantId: string; value: number }> }>;
  }) {
    const teamMode = input.teamSize > 1;
    if (input.mode === BattleMode.JACKPOT || input.mode === BattleMode.CRAZY_JACKPOT) {
      const reverseWeight = input.mode === BattleMode.CRAZY_JACKPOT;
      if (teamMode) {
        const teamEntries = this.groupTeamTotals(input.participants, input.participantTotals);
        const winnerTeamIndex = Number(
          this.battleFairness.pickJackpotWinnerByContribution(
            `${input.battleId}:jackpot:team`,
            input.battleServerSeed,
            input.eosHash,
            teamEntries.map((entry) => ({ key: String(entry.teamIndex), weight: entry.total })),
            reverseWeight,
          ),
        );
        return {
          winnerParticipantId: this.pickRepresentative(input.participants, winnerTeamIndex),
          winnerTeamIndex,
        };
      }

      const winnerParticipantId = this.battleFairness.pickJackpotWinnerByContribution(
        `${input.battleId}:jackpot:solo`,
        input.battleServerSeed,
        input.eosHash,
        input.participants.map((entry) => ({
          key: entry.id,
          weight: input.participantTotals.get(entry.id) ?? 0,
        })),
        reverseWeight,
      );
      return { winnerParticipantId, winnerTeamIndex: null };
    }

    if (input.mode === BattleMode.TERMINAL) {
      return this.determineTerminalWinner(input, teamMode);
    }

    const reverse = input.mode === BattleMode.CRAZY;
    return this.determineValueWinner(input, teamMode, reverse);
  }

  private determineValueWinner(
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
      const entries = this.groupTeamTotals(input.participants, input.participantTotals).map((entry) => ({
        key: entry.teamIndex,
        score: entry.total,
      }));
      const winnerTeamIndex = this.pickByScore(entries, reverse, input.battleId, input.battleServerSeed, input.eosHash);
      return {
        winnerParticipantId: this.pickRepresentative(input.participants, winnerTeamIndex),
        winnerTeamIndex,
      };
    }

    const entries = input.participants.map((entry) => ({
      key: entry.id,
      score: input.participantTotals.get(entry.id) ?? 0,
    }));
    const winnerParticipantId = this.pickByScore(entries, reverse, input.battleId, input.battleServerSeed, input.eosHash);
    return {
      winnerParticipantId,
      winnerTeamIndex: null,
    };
  }

  private determineTerminalWinner(
    input: {
      battleId: string;
      battleServerSeed: string;
      eosHash: string;
      participants: Array<{ id: string; seatIndex: number; teamIndex: number }>;
      rounds: Array<{ roundNumber: number; results: Array<{ participantId: string; value: number }> }>;
    },
    teamMode: boolean,
  ) {
    const lastRound = input.rounds.reduce((acc, current) => (current.roundNumber > acc.roundNumber ? current : acc));
    if (!lastRound) {
      throw new Error("Terminal mode cannot resolve without rounds");
    }

    if (teamMode) {
      const teamTotals = new Map<number, number>();
      for (const result of lastRound.results) {
        const participant = input.participants.find((entry) => entry.id === result.participantId);
        if (!participant) continue;
        teamTotals.set(participant.teamIndex, (teamTotals.get(participant.teamIndex) ?? 0) + result.value);
      }
      const winnerTeamIndex = this.pickByScore(
        Array.from(teamTotals.entries()).map(([teamIndex, score]) => ({ key: teamIndex, score })),
        false,
        input.battleId,
        input.battleServerSeed,
        input.eosHash,
      );
      return {
        winnerParticipantId: this.pickRepresentative(input.participants, winnerTeamIndex),
        winnerTeamIndex,
      };
    }

    const participantScores = new Map<string, number>();
    for (const result of lastRound.results) {
      participantScores.set(result.participantId, result.value);
    }
    const winnerParticipantId = this.pickByScore(
      input.participants.map((entry) => ({ key: entry.id, score: participantScores.get(entry.id) ?? 0 })),
      false,
      input.battleId,
      input.battleServerSeed,
      input.eosHash,
    );
    return {
      winnerParticipantId,
      winnerTeamIndex: null,
    };
  }

  private pickByScore<T extends { key: string | number; score: number }>(
    entries: T[],
    reverse: boolean,
    battleId: string,
    battleServerSeed: string,
    eosHash: string,
  ): T["key"] {
    if (entries.length === 0) {
      throw new Error("Cannot pick winner from empty score set");
    }
    const ordered = [...entries].sort((a, b) => (reverse ? a.score - b.score : b.score - a.score));
    const topScore = ordered[0]?.score ?? 0;
    const ties = ordered.filter((entry) => entry.score === topScore);
    if (ties.length === 1) {
      return ties[0]?.key as T["key"];
    }
    return this.battleFairness.pickJackpotWinnerByContribution(
      `${battleId}:tie_break`,
      battleServerSeed,
      eosHash,
      ties.map((entry) => ({ key: String(entry.key), weight: 1 })),
    ) as T["key"];
  }

  private groupTeamTotals(
    participants: Array<{ id: string; teamIndex: number }>,
    participantTotals: Map<string, number>,
  ) {
    const totals = new Map<number, number>();
    for (const participant of participants) {
      totals.set(
        participant.teamIndex,
        (totals.get(participant.teamIndex) ?? 0) + (participantTotals.get(participant.id) ?? 0),
      );
    }
    return Array.from(totals.entries()).map(([teamIndex, total]) => ({ teamIndex, total }));
  }

  private pickRepresentative(participants: Array<{ id: string; teamIndex: number }>, winnerTeamIndex: number | null) {
    if (winnerTeamIndex === null) {
      return null;
    }
    return participants.find((entry) => entry.teamIndex === winnerTeamIndex)?.id ?? null;
  }

  private nextSeatIndex(usedSeats: number[], maxPlayers: number) {
    for (let index = 0; index < maxPlayers; index += 1) {
      if (!usedSeats.includes(index)) {
        return index;
      }
    }
    throw new Error("No seat available");
  }

  private computeTeamIndex(seatIndex: number, teamSize: number) {
    return Math.floor(seatIndex / teamSize);
  }

  private generateInviteCode() {
    return randomBytes(8).toString("hex");
  }

  private snapshotHash(snapshot: unknown) {
    return createHash("sha256").update(JSON.stringify(snapshot)).digest("hex");
  }
}
