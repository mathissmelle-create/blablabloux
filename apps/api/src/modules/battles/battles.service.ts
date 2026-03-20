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

    const snapshot = await this.getBattleSnapshot(battleId);
    const envelope = this.realtimeService.nextEnvelope(`battle:${battleId}`, "battle.round_resolved", {
      battleId,
      roundNumber,
      snapshot,
    });
    this.realtimeGateway.emitToBattleRoom(battleId, "battle:event", envelope);
    return snapshot;
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
