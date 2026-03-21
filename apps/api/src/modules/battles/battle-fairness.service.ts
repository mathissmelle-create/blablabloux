import { Injectable } from "@nestjs/common";
import { BattleMode, CaseItem, Prisma } from "@prisma/client";
import { FairnessService } from "../fairness/fairness.service.js";

type FairRoundInput = {
  battleId: string;
  roundNumber: number;
  battleServerSeed: string;
  eosBlockHash: string;
  caseItems: Array<CaseItem & { itemDefinition: { value: Prisma.Decimal } }>;
  seatIndexes: number[];
  mode: BattleMode;
  casePrice: Prisma.Decimal;
};

@Injectable()
export class BattleFairnessService {
  constructor(private readonly fairnessService: FairnessService) {}

  computeRoundResults(input: FairRoundInput) {
    const totalWeight = input.caseItems.reduce((acc, item) => acc + item.weight, 0);
    if (totalWeight <= 0) {
      throw new Error("Invalid case items weight for battle round");
    }

    return input.seatIndexes.map((seatIndex) => {
      const ticket = this.fairnessService.deriveBattleTicket(
        {
          battleId: input.battleId,
          roundNumber: input.roundNumber,
          seatIndex,
          battleServerSeed: input.battleServerSeed,
          eosBlockHash: input.eosBlockHash,
        },
        totalWeight,
      );

      let cumulative = 0;
      const mapped = input.caseItems.find((item) => {
        cumulative += item.weight;
        return ticket.ticket < cumulative;
      });

      if (!mapped) {
        throw new Error("Ticket mapping failed for battle round");
      }

      const goldThreshold = input.casePrice.mul(8);
      const isGoldSpin = mapped.itemDefinition.value.greaterThanOrEqualTo(goldThreshold) && mapped.isGoldEligible;
      const baitOffset = seatIndex % 3 === 0 ? 1 : seatIndex % 3 === 1 ? -1 : 2;

      return {
        seatIndex,
        itemDefinitionId: mapped.itemDefinitionId,
        itemValue: mapped.itemDefinition.value,
        ticket: BigInt(ticket.ticket),
        hash: ticket.hash,
        isGoldSpin,
        baitIndex: Math.max(0, ticket.ticket + baitOffset),
      };
    });
  }

  pickJackpotWinnerByContribution(
    battleId: string,
    battleServerSeed: string,
    eosHash: string,
    weightedContributions: Array<{ key: string; weight: number }>,
    reverseWeight = false,
  ) {
    if (weightedContributions.length === 0) {
      throw new Error("No contributions available");
    }

    const max = Math.max(...weightedContributions.map((value) => value.weight), 0);
    const normalized = weightedContributions.map((entry) => ({
      key: entry.key,
      weight: reverseWeight ? Math.max(1, Math.round((max - entry.weight + 0.01) * 10_000)) : Math.max(1, Math.round(entry.weight * 10_000)),
    }));

    const total = normalized.reduce((acc, entry) => acc + entry.weight, 0);
    const draw = this.fairnessService.deriveBattleTicket(
      {
        battleId,
        roundNumber: 99_001,
        seatIndex: normalized.length,
        battleServerSeed,
        eosBlockHash: eosHash,
      },
      total,
    );

    let cursor = 0;
    for (const entry of normalized) {
      cursor += entry.weight;
      if (draw.ticket < cursor) {
        return entry.key;
      }
    }

    return normalized[normalized.length - 1]?.key ?? normalized[0]?.key ?? "";
  }
}
