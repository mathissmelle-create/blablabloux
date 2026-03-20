import { Injectable } from "@nestjs/common";
import { Prisma, TransactionType } from "@prisma/client";

type BalanceChangeInput = {
  tx: Prisma.TransactionClient;
  userId: string;
  amount: Prisma.Decimal;
  type: TransactionType;
  reason: string;
  direction: "credit" | "debit";
  referenceType?: string;
  referenceId?: string;
  metadata?: Prisma.InputJsonValue;
};

@Injectable()
export class LedgerService {
  async applyBalanceChange(input: BalanceChangeInput) {
    await input.tx.$queryRaw`SELECT id FROM "Wallet" WHERE "userId" = ${input.userId} FOR UPDATE`;

    const wallet = await input.tx.wallet.findUnique({
      where: { userId: input.userId },
    });

    if (!wallet) {
      throw new Error("Wallet not found for user");
    }

    const before = new Prisma.Decimal(wallet.availableBalance);
    const signedAmount =
      input.direction === "credit"
        ? new Prisma.Decimal(input.amount)
        : new Prisma.Decimal(input.amount).negated();
    const after = before.add(signedAmount);

    if (after.lessThan(0)) {
      throw new Error("Insufficient balance");
    }

    await input.tx.wallet.update({
      where: { id: wallet.id },
      data: {
        availableBalance: after,
      },
    });

    await input.tx.balanceLedger.create({
      data: {
        walletId: wallet.id,
        userId: input.userId,
        direction: input.direction === "credit" ? "CREDIT" : "DEBIT",
        amount: input.amount,
        balanceBefore: before,
        balanceAfter: after,
        reason: input.reason,
        referenceType: input.referenceType,
        referenceId: input.referenceId,
        metadata: input.metadata,
      },
    });

    await input.tx.transaction.create({
      data: {
        userId: input.userId,
        type: input.type,
        amount: input.amount,
        status: "COMPLETED",
        metadata: input.metadata,
      },
    });

    return { before, after };
  }
}
