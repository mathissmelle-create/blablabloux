import { Injectable, NotFoundException } from "@nestjs/common";
import { Prisma } from "@prisma/client";
import { createHash } from "node:crypto";
import { PrismaService } from "../prisma/prisma.service.js";
import { CreateCaseDto } from "./dto/create-case.dto.js";

type SnapshotItem = {
  itemDefinitionId: string;
  weight: number;
  ticketStart: bigint;
  ticketEnd: bigint;
  isGoldEligible: boolean;
  value: Prisma.Decimal;
};

@Injectable()
export class AdminService {
  constructor(private readonly prisma: PrismaService) {}

  listCases() {
    return this.prisma.case.findMany({
      include: {
        versions: {
          orderBy: { version: "desc" },
          take: 1,
        },
      },
      orderBy: { createdAt: "desc" },
    });
  }

  async createCase(actorUserId: string, dto: CreateCaseDto) {
    return this.prisma.$transaction(async (tx) => {
      const slug = this.slugify(dto.name);
      const alreadyExists = await tx.case.findUnique({ where: { slug } });
      if (alreadyExists) {
        throw new Error("Case slug already exists");
      }

      const caseEntity = await tx.case.create({
        data: {
          name: dto.name,
          slug,
          imageUrl: dto.imageUrl,
          description: dto.description,
          price: new Prisma.Decimal(dto.price),
          active: dto.active ?? true,
          goldSpinEnabled: dto.goldSpinEnabled ?? true,
          goldSpinMultiplier: new Prisma.Decimal(dto.goldSpinMultiplier ?? 8),
        },
      });

      const version = await this.createCaseVersionInternal(tx, caseEntity.id, actorUserId, dto);

      await tx.auditLog.create({
        data: {
          actorUserId,
          action: "admin.case.create",
          entityType: "case",
          entityId: caseEntity.id,
          metadata: { version: version.version },
        },
      });

      return { case: caseEntity, version };
    });
  }

  async createCaseVersion(actorUserId: string, caseId: string, dto: CreateCaseDto) {
    return this.prisma.$transaction(async (tx) => {
      const caseEntity = await tx.case.findUnique({ where: { id: caseId } });
      if (!caseEntity) {
        throw new NotFoundException("Case not found");
      }

      const version = await this.createCaseVersionInternal(tx, caseEntity.id, actorUserId, dto);

      await tx.case.update({
        where: { id: caseEntity.id },
        data: {
          name: dto.name,
          imageUrl: dto.imageUrl,
          description: dto.description,
          price: new Prisma.Decimal(dto.price),
          active: dto.active ?? true,
          goldSpinEnabled: dto.goldSpinEnabled ?? true,
          goldSpinMultiplier: new Prisma.Decimal(dto.goldSpinMultiplier ?? 8),
        },
      });

      await tx.auditLog.create({
        data: {
          actorUserId,
          action: "admin.case.version.create",
          entityType: "case_version",
          entityId: version.id,
          metadata: { caseId },
        },
      });

      return version;
    });
  }

  async toggleCaseActive(actorUserId: string, caseId: string, active: boolean) {
    const updated = await this.prisma.case.update({
      where: { id: caseId },
      data: { active },
    });

    await this.prisma.auditLog.create({
      data: {
        actorUserId,
        action: "admin.case.toggle_active",
        entityType: "case",
        entityId: caseId,
        metadata: { active },
      },
    });

    return updated;
  }

  private async createCaseVersionInternal(
    tx: Prisma.TransactionClient,
    caseId: string,
    actorUserId: string,
    dto: CreateCaseDto,
  ) {
    const totalWeight = dto.items.reduce((acc, item) => acc + item.weight, 0);
    if (totalWeight <= 0) {
      throw new Error("Case items total weight must be positive");
    }

    const nextVersion = await tx.caseVersion.count({ where: { caseId } }).then((count) => count + 1);

    const snapshotItems: SnapshotItem[] = [];
    let cursor = 0n;
    for (const item of dto.items) {
      const itemDefinition = await tx.itemDefinition.create({
        data: {
          itemName: item.itemName,
          imageUrl: item.imageUrl,
          rarity: item.rarity,
          value: new Prisma.Decimal(item.value),
          specialFlags: {
            source: "admin_case_creator",
          },
        },
      });

      const start = cursor;
      const end = cursor + BigInt(item.weight) - 1n;
      snapshotItems.push({
        itemDefinitionId: itemDefinition.id,
        weight: item.weight,
        ticketStart: start,
        ticketEnd: end,
        isGoldEligible: item.isGoldEligible ?? false,
        value: itemDefinition.value,
      });
      cursor = end + 1n;
    }

    const expectedReturn = snapshotItems.reduce(
      (acc, item) => acc + item.value.toNumber() * (item.weight / totalWeight),
      0,
    );

    const snapshotHash = createHash("sha256")
      .update(
        JSON.stringify({
          caseId,
          items: snapshotItems.map((item) => ({
            itemDefinitionId: item.itemDefinitionId,
            weight: item.weight,
            ticketStart: item.ticketStart.toString(),
            ticketEnd: item.ticketEnd.toString(),
            isGoldEligible: item.isGoldEligible,
          })),
        }),
      )
      .digest("hex");

    const version = await tx.caseVersion.create({
      data: {
        caseId,
        version: nextVersion,
        snapshotHash,
        expectedReturn: new Prisma.Decimal(expectedReturn.toFixed(4)),
        createdByUserId: actorUserId,
      },
    });

    await tx.caseItem.createMany({
      data: snapshotItems.map((item) => ({
        caseVersionId: version.id,
        itemDefinitionId: item.itemDefinitionId,
        weight: item.weight,
        ticketStart: item.ticketStart,
        ticketEnd: item.ticketEnd,
        isGoldEligible: item.isGoldEligible,
      })),
    });

    return version;
  }

  private slugify(name: string): string {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
  }
}
