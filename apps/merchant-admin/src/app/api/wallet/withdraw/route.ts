import { NextResponse } from "next/server";
import { withVayvaAPI } from "@/lib/api-handler";
import { PERMISSIONS } from "@/lib/team/permissions";
import { prisma } from "@vayva/db";

export const POST = withVayvaAPI(PERMISSIONS.PAYOUTS_MANAGE, async (req, { storeId }) => {
  try {
    const body = await req.json().catch(() => ({}));
    const amount = Number(body?.amount);
    const bankAccountId = String(body?.bankAccountId || "");

    if (!Number.isFinite(amount) || amount <= 0) {
      return NextResponse.json({ error: "Invalid amount" }, { status: 400 });
    }
    if (!bankAccountId) {
      return NextResponse.json({ error: "Bank account is required" }, { status: 400 });
    }

    // Minimal v1: create payout record; real transfer should be handled by provider integration.
    const dest = await prisma.bankBeneficiary.findFirst({
      where: { id: bankAccountId, storeId },
      select: { bankName: true, accountNumber: true, accountName: true, bankCode: true },
    });

    if (!dest) {
      return NextResponse.json({ error: "Payout account not found" }, { status: 404 });
    }

    const payout = await prisma.payout.create({
      data: {
        storeId,
        provider: "MANUAL",
        providerPayoutId: `manual_${Date.now()}`,
        status: "PENDING",
        amount,
        currency: "NGN",
        reference: `payout_${Date.now()}`,
        destination: {
          bankName: dest.bankName,
          accountNumber: dest.accountNumber,
          accountName: dest.accountName,
          bankCode: dest.bankCode,
        },
      } as any,
    });

    return NextResponse.json({ ok: true, payout });
  } catch (error: any) {
    console.error("[WALLET_WITHDRAW_POST]", error);
    return NextResponse.json({ error: error?.message || "Withdrawal failed" }, { status: 500 });
  }
});
