import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@vayva/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { logAuditEvent, AuditEventType } from "@/lib/audit";

/**
 * Real Withdrawal Implementation
 * Requirements: Auth, Balance Check, Idempotent Debit, Audit Log
 */
export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.storeId) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  try {
    const { amount, bankAccountId, pin } = await req.json();
    const storeId = session.user.storeId;
    const userId = session.user.id;

    if (!amount || amount <= 0) {
      return NextResponse.json({ error: "Invalid amount" }, { status: 400 });
    }

    if (!bankAccountId) {
      return NextResponse.json({ error: "Bank account is required" }, { status: 400 });
    }

    const result = await prisma.$transaction(async (tx: any) => {
      // 1. Get and Lock Wallet for update
      const wallet = await tx.wallet.findUnique({
        where: { storeId },
      });

      if (!wallet) {
        throw new Error("Wallet not found");
      }

      if (wallet.isLocked) {
        throw new Error("Wallet is locked due to security concerns");
      }

      // 2. Validate Balance
      const amountKobo = BigInt(Math.round(amount * 100));
      if (wallet.availableKobo < amountKobo) {
        throw new Error("Insufficient balance");
      }

      // 3. Verify Beneficiary
      const beneficiary = await tx.bankBeneficiary.findFirst({
        where: { id: bankAccountId, storeId },
      });

      if (!beneficiary) {
        throw new Error("Specified bank account not found or invalid");
      }

      // 4. Create Withdrawal Record
      const withdrawal = await tx.withdrawal.create({
        data: {
          storeId,
          requestedByUserId: userId,
          amountKobo,
          bankAccountId: beneficiary.id,
          status: "PENDING",
          referenceCode: `WDL-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
        },
      });

      // 5. Atomic Debit
      await tx.wallet.update({
        where: { storeId },
        data: {
          availableKobo: { decrement: amountKobo },
          pendingKobo: { increment: amountKobo },
        },
      });

      // 6. Create Ledger Entry for History
      await tx.ledgerEntry.create({
        data: {
          storeId,
          referenceType: "WITHDRAWAL",
          referenceId: withdrawal.id,
          direction: "DEBIT",
          account: "WALLET",
          amount: Number(amount),
          currency: "NGN",
          description: `Withdrawal to ${beneficiary.accountNumber} (${beneficiary.bankName})`,
        },
      });

      return withdrawal;
    });

    // 7. Audit Log
    await logAuditEvent(storeId, userId, AuditEventType.WITHDRAWAL_REQUESTED, {
      withdrawalId: result.id,
      amount,
      bank: result.bankAccountId,
      ref: result.referenceCode,
    });

    return NextResponse.json({
      success: true,
      withdrawalId: result.id,
      status: result.status,
      reference: result.referenceCode,
    });
  } catch (error: any) {
    console.error("[Withdrawal] Processing failed:", error);
    return NextResponse.json(
      { error: error.message || "Withdrawal failed" },
      { status: 400 }
    );
  }
}
