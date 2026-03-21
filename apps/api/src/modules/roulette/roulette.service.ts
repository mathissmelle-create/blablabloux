import { Injectable } from "@nestjs/common";
import { Prisma, RouletteBetType, RouletteColor, RouletteRoundStatus, TransactionType } from "@prisma/client";
import { createHash, randomBytes } from "node:crypto";
import { FairnessService } from "../fairness/fairness.service.js";
import { LedgerService } from "../ledger/ledger.service.js";
import { PrismaService } from "../prisma/prisma.service.js";
import { PlaceBetDto } from "./dto/place-bet.dto.js";

const ROULETTE_SEGMENTS: RouletteColor[] = [
  "GREEN",
  "RED",
  "BLACK",
  "RED",
  "BLACK",
  "RED",
  "BLACK",
  "RED",
  "BLACK",
  "RED",
  "BLACK",
  "RED",
  "BLACK",
  "RED",
  "GOLD",
];

@Injectable()
export class RouletteService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly fairnessService: FairnessService,
    private readonly ledgerService: LedgerService,
  ) {}

  async getCurrentRound() {
    const existing = await this.prisma.rouletteRound.findFirst({
      where: {
        status: {
          in: [RouletteRoundStatus.OPEN, RouletteRoundStatus.LOCKED, RouletteRoundStatus.SPINNING],
        },
      },
      orderBy: { roundNumber: "desc" },
    });

    if (existing) {
      return existing;
    }

    return this.createRound();
  }

  async placeBet(userId: string, dto: PlaceBetDto) {
    if (dto.betType === RouletteBetType.COLOR && !dto.color) {
      throw new Error("Color bet requires color");
    }
    if (dto.betType === RouletteBetType.SEGMENT && typeof dto.segment !== "number") {
      throw new Error("Segment bet requires segment");
    }

    return this.prisma.$transaction(async (tx) => {
      const round = await this.getCurrentRoundForTx(tx);
      if (round.status !== "OPEN" || round.closesAt <= new Date()) {
        throw new Error("Bet window is closed");
      }

      const amount = new Prisma.Decimal(dto.amount);
      const payoutMultiplier = this.getPayoutMultiplier(dto);

      await this.ledgerService.applyBalanceChange({
        tx,
        userId,
        amount,
        direction: "debit",
        reason: "Roulette bet placement",
        type: TransactionType.ROULETTE_BET,
        referenceType: "roulette_round",
        referenceId: round.id,
        metadata: { betType: dto.betType, color: dto.color, segment: dto.segment },
      });

      return tx.rouletteBet.create({
        data: {
          rouletteRoundId: round.id,
          userId,
          betType: dto.betType,
          color: dto.color,
          segment: dto.segment,
          amount,
          payoutMultiplier: new Prisma.Decimal(payoutMultiplier),
        },
      });
    });
  }

  async resolveCurrentRound() {
    const round = await this.getCurrentRound();
    if (round.status === "RESOLVED") {
      return round;
    }

    const resolved = await this.prisma.$transaction(async (tx) => {
      const current = await tx.rouletteRound.findUnique({
        where: { id: round.id },
        include: { bets: true },
      });
      if (!current) {
        throw new Error("Round not found");
      }

      if (current.status === "RESOLVED") {
        return current;
      }

      await tx.rouletteRound.update({
        where: { id: current.id },
        data: { status: "LOCKED" },
      });

      const derived = this.fairnessService.deriveRouletteSegment(
        {
          serverSeed: current.serverSeedEncrypted,
          clientSeed: current.clientSeed,
          nonce: current.nonce,
          roundNumber: current.roundNumber,
        },
        ROULETTE_SEGMENTS.length,
      );

      const winningSegment = derived.ticket;
      const winningColor = ROULETTE_SEGMENTS[winningSegment];

      for (const bet of current.bets) {
        const won =
          bet.betType === RouletteBetType.COLOR
            ? bet.color === winningColor
            : bet.segment === winningSegment;

        if (!won) {
          await tx.rouletteBet.update({
            where: { id: bet.id },
            data: { status: "LOST" },
          });
          continue;
        }

        const payoutAmount = bet.amount.mul(bet.payoutMultiplier);
        await this.ledgerService.applyBalanceChange({
          tx,
          userId: bet.userId,
          amount: payoutAmount,
          direction: "credit",
          reason: "Roulette payout",
          type: TransactionType.ROULETTE_PAYOUT,
          referenceType: "roulette_bet",
          referenceId: bet.id,
          metadata: { roundId: current.id, winningSegment, winningColor },
        });

        await tx.rouletteBet.update({
          where: { id: bet.id },
          data: {
            status: "WON",
            payoutAmount,
          },
        });
      }

      const updated = await tx.rouletteRound.update({
        where: { id: current.id },
        data: {
          status: "RESOLVED",
          winningSegment,
          winningColor,
          resolvedAt: new Date(),
          serverSeedRevealed: current.serverSeedEncrypted,
          outcomeValue: new Prisma.Decimal(winningSegment),
          fairnessEvidence: {
            hash: derived.hash,
            normalized: derived.normalized,
          },
        },
      });

      await tx.fairnessRecord.create({
        data: {
          gameType: "roulette",
          referenceId: updated.id,
          serverSeedHash: updated.serverSeedHash,
          serverSeed: updated.serverSeedRevealed,
          clientSeed: updated.clientSeed,
          nonce: updated.nonce,
          derivationInput: {
            segments: ROULETTE_SEGMENTS.length,
            roundNumber: updated.roundNumber,
          },
          resultHash: derived.hash,
          resultTicket: BigInt(winningSegment),
          immutableHash: createHash("sha256")
            .update(`${updated.id}:${derived.hash}:${winningSegment}`)
            .digest("hex"),
        },
      });

      return updated;
    });

    await this.createRound();
    return resolved;
  }

  async history() {
    return this.prisma.rouletteRound.findMany({
      where: { status: "RESOLVED" },
      orderBy: { roundNumber: "desc" },
      take: 20,
    });
  }

  private async createRound() {
    const lastRound = await this.prisma.rouletteRound.findFirst({
      orderBy: { roundNumber: "desc" },
      select: { roundNumber: true },
    });

    const nextRoundNumber = (lastRound?.roundNumber ?? 0) + 1;
    const serverSeed = randomBytes(32).toString("hex");
    const serverSeedHash = createHash("sha256").update(serverSeed).digest("hex");

    return this.prisma.rouletteRound.create({
      data: {
        roundNumber: nextRoundNumber,
        status: "OPEN",
        opensAt: new Date(),
        closesAt: new Date(Date.now() + 20_000),
        serverSeedEncrypted: serverSeed,
        serverSeedHash,
        clientSeed: `roulette-round-${nextRoundNumber}`,
        nonce: nextRoundNumber,
      },
    });
  }

  private async getCurrentRoundForTx(tx: Prisma.TransactionClient) {
    const existing = await tx.rouletteRound.findFirst({
      where: {
        status: {
          in: ["OPEN", "LOCKED", "SPINNING"],
        },
      },
      orderBy: { roundNumber: "desc" },
    });
    if (existing) {
      return existing;
    }

    const last = await tx.rouletteRound.findFirst({
      orderBy: { roundNumber: "desc" },
      select: { roundNumber: true },
    });
    const nextRoundNumber = (last?.roundNumber ?? 0) + 1;
    const serverSeed = randomBytes(32).toString("hex");
    const serverSeedHash = createHash("sha256").update(serverSeed).digest("hex");

    return tx.rouletteRound.create({
      data: {
        roundNumber: nextRoundNumber,
        status: "OPEN",
        opensAt: new Date(),
        closesAt: new Date(Date.now() + 20_000),
        serverSeedEncrypted: serverSeed,
        serverSeedHash,
        clientSeed: `roulette-round-${nextRoundNumber}`,
        nonce: nextRoundNumber,
      },
    });
  }

  private getPayoutMultiplier(dto: PlaceBetDto) {
    if (dto.betType === RouletteBetType.SEGMENT) {
      return 14;
    }

    if (dto.color === "GREEN") {
      return 14;
    }
    if (dto.color === "GOLD") {
      return 20;
    }
    return 2;
  }
}
