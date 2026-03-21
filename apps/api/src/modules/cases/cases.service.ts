import { Injectable, NotFoundException } from "@nestjs/common";
import { GameType, Prisma, TransactionType } from "@prisma/client";
import { createHash } from "node:crypto";
import { FairnessService } from "../fairness/fairness.service.js";
import { LedgerService } from "../ledger/ledger.service.js";
import { PrismaService } from "../prisma/prisma.service.js";
import { OpenCaseDto } from "./dto/open-case.dto.js";

@Injectable()
export class CasesService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly fairnessService: FairnessService,
    private readonly ledgerService: LedgerService,
  ) {}

  async listCases() {
    return this.prisma.case.findMany({
      where: { active: true },
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        name: true,
        slug: true,
        imageUrl: true,
        price: true,
        goldSpinEnabled: true,
        goldSpinMultiplier: true,
      },
    });
  }

  async getCaseBySlug(slug: string) {
    const caseEntity = await this.prisma.case.findUnique({
      where: { slug },
      include: {
        versions: {
          orderBy: { version: "desc" },
          take: 1,
          include: {
            caseItems: {
              include: {
                itemDefinition: true,
              },
            },
          },
        },
      },
    });

    if (!caseEntity) {
      throw new NotFoundException("Case not found");
    }

    return caseEntity;
  }

  async openCase(userId: string, caseId: string, dto: OpenCaseDto) {
    const openAmount = dto.amount ?? 1;
    const openedRounds = [] as Array<{
      caseOpenId: string;
      ticket: number;
      itemId: string;
      itemName: string;
      value: Prisma.Decimal;
      isGoldSpin: boolean;
      goldSpinResultItemName?: string;
      goldSpinResultValue?: Prisma.Decimal;
      nonce: number;
      resultHash: string;
    }>;

    await this.prisma.$transaction(async (tx) => {
      const caseEntity = await tx.case.findFirst({
        where: { id: caseId, active: true },
        include: {
          versions: {
            orderBy: { version: "desc" },
            take: 1,
            include: {
              caseItems: {
                include: { itemDefinition: true },
              },
            },
          },
        },
      });

      if (!caseEntity || caseEntity.versions.length === 0) {
        throw new NotFoundException("Case is not available");
      }

      const caseVersion = caseEntity.versions[0];
      if (!caseVersion) {
        throw new Error("Case version missing");
      }
      const seedPair = await tx.userSeedPair.findUnique({
        where: {
          userId_gameType: {
            userId,
            gameType: GameType.case_open,
          },
        },
      });

      if (!seedPair) {
        throw new NotFoundException("Seed pair not initialized for user");
      }

      const totalWeight = caseVersion.caseItems.reduce((acc, item) => acc + item.weight, 0);
      if (totalWeight <= 0) {
        throw new Error("Case version has no valid weighted items");
      }

      for (let i = 0; i < openAmount; i += 1) {
        const currentNonce = seedPair.nonce + i;
        const derived = this.fairnessService.deriveCaseTicket(
          {
            serverSeed: seedPair.currentServerSeedEncrypted,
            clientSeed: seedPair.clientSeed,
            nonce: currentNonce,
            caseVersionId: caseVersion.id,
            userId,
          },
          totalWeight,
        );

        let cumulative = 0;
        const winningCaseItem = caseVersion.caseItems.find((item) => {
          cumulative += item.weight;
          return derived.ticket < cumulative;
        });

        if (!winningCaseItem) {
          throw new Error("Failed to map ticket to case item");
        }

        const isGoldSpin = caseEntity.goldSpinEnabled
          ? winningCaseItem.itemDefinition.value.greaterThanOrEqualTo(
              caseEntity.price.mul(caseEntity.goldSpinMultiplier),
            )
          : false;
        const goldEligiblePool = caseVersion.caseItems.filter((item) => {
          const threshold = caseEntity.price.mul(caseEntity.goldSpinMultiplier);
          return item.isGoldEligible && item.itemDefinition.value.greaterThanOrEqualTo(threshold);
        });

        const caseOpen = await tx.caseOpen.create({
          data: {
            userId,
            caseId: caseEntity.id,
            caseVersionId: caseVersion.id,
            seedPairId: seedPair.id,
            serverSeedHash: seedPair.currentServerSeedHash,
            clientSeed: seedPair.clientSeed,
            nonce: currentNonce,
            status: "PENDING",
            totalSpent: caseEntity.price,
            totalWon: winningCaseItem.itemDefinition.value,
          },
        });

        await this.ledgerService.applyBalanceChange({
          tx,
          userId,
          amount: caseEntity.price,
          direction: "debit",
          reason: "Case open purchase",
          type: TransactionType.CASE_OPEN,
          referenceType: "case_open",
          referenceId: caseOpen.id,
          metadata: { caseId: caseEntity.id, caseVersionId: caseVersion.id },
        });

        await tx.caseOpenResult.create({
          data: {
            caseOpenId: caseOpen.id,
            itemDefinitionId: winningCaseItem.itemDefinitionId,
            ticket: BigInt(derived.ticket),
            itemValue: winningCaseItem.itemDefinition.value,
            isGoldSpin,
            position: 0,
            metadata: {
              fairnessHash: derived.hash,
              normalized: derived.normalized,
            },
          },
        });

        let goldSpinResultItemName: string | undefined;
        let goldSpinResultValue: Prisma.Decimal | undefined;
        if (isGoldSpin && goldEligiblePool.length > 0) {
          const goldPoolWeight = goldEligiblePool.reduce((acc, item) => acc + item.weight, 0);
          const goldDerived = this.fairnessService.deriveCaseTicket(
            {
              serverSeed: seedPair.currentServerSeedEncrypted,
              clientSeed: seedPair.clientSeed,
              nonce: currentNonce,
              caseVersionId: `${caseVersion.id}:gold`,
              userId,
            },
            goldPoolWeight,
          );

          let goldCursor = 0;
          const goldWinningItem = goldEligiblePool.find((item) => {
            goldCursor += item.weight;
            return goldDerived.ticket < goldCursor;
          });

          if (goldWinningItem) {
            goldSpinResultItemName = goldWinningItem.itemDefinition.itemName;
            goldSpinResultValue = goldWinningItem.itemDefinition.value;

            await tx.caseOpenResult.create({
              data: {
                caseOpenId: caseOpen.id,
                itemDefinitionId: goldWinningItem.itemDefinitionId,
                ticket: BigInt(goldDerived.ticket),
                itemValue: goldWinningItem.itemDefinition.value,
                isGoldSpin: true,
                position: 1,
                metadata: {
                  fairnessHash: goldDerived.hash,
                  normalized: goldDerived.normalized,
                  reason: "gold_spin_respin",
                },
              },
            });

            await tx.inventoryItem.create({
              data: {
                userId,
                itemDefinitionId: goldWinningItem.itemDefinitionId,
                sourceType: "CASE_OPEN",
                sourceId: caseOpen.id,
                value: goldWinningItem.itemDefinition.value,
                withdrawable: false,
              },
            });

            await tx.caseOpen.update({
              where: { id: caseOpen.id },
              data: {
                totalWon: winningCaseItem.itemDefinition.value.add(goldWinningItem.itemDefinition.value),
              },
            });
          }
        }

        await tx.inventoryItem.create({
          data: {
            userId,
            itemDefinitionId: winningCaseItem.itemDefinitionId,
            sourceType: "CASE_OPEN",
            sourceId: caseOpen.id,
            value: winningCaseItem.itemDefinition.value,
            withdrawable: false,
          },
        });

        await tx.caseOpen.update({
          where: { id: caseOpen.id },
          data: { status: "RESOLVED", resolvedAt: new Date() },
        });

        const immutableHash = createHash("sha256")
          .update(`${caseOpen.id}:${derived.hash}:${winningCaseItem.itemDefinitionId}`)
          .digest("hex");

        await tx.fairnessRecord.create({
          data: {
            gameType: "case_open",
            referenceId: caseOpen.id,
            serverSeedHash: seedPair.currentServerSeedHash,
            clientSeed: seedPair.clientSeed,
            nonce: currentNonce,
            derivationInput: {
              caseVersionId: caseVersion.id,
              userId,
              totalWeight,
            },
            resultHash: derived.hash,
            resultTicket: BigInt(derived.ticket),
            immutableHash,
          },
        });

        openedRounds.push({
          caseOpenId: caseOpen.id,
          ticket: derived.ticket,
          itemId: winningCaseItem.itemDefinitionId,
          itemName: winningCaseItem.itemDefinition.itemName,
          value: winningCaseItem.itemDefinition.value,
          isGoldSpin,
          goldSpinResultItemName,
          goldSpinResultValue,
          nonce: currentNonce,
          resultHash: derived.hash,
        });
      }

      await tx.userSeedPair.update({
        where: { id: seedPair.id },
        data: { nonce: seedPair.nonce + openAmount },
      });
    });

    return { caseId, rounds: openedRounds };
  }
}
