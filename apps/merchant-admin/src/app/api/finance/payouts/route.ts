import { NextResponse } from "next/server";
import { withVayvaAPI } from "@/lib/api-handler";
import { PERMISSIONS } from "@/lib/team/permissions";
import { prisma } from "@vayva/db";

export const GET = withVayvaAPI(PERMISSIONS.FINANCE_VIEW, async (_req, { storeId }) => {
  try {
    const payouts = await prisma.payout.findMany({
      where: { storeId },
      orderBy: { createdAt: "desc" },
      take: 50,
    });

    return NextResponse.json(payouts);
  } catch (error: any) {
    console.error("[FINANCE_PAYOUTS_GET]", error);
    return NextResponse.json({ error: "Failed to load payouts" }, { status: 500 });
  }
});

export const POST = withVayvaAPI(PERMISSIONS.PAYOUTS_MANAGE, async (req, { storeId }) => {
  try {
    const body = await req.json().catch(() => ({}));
    const amount = Number(body?.amount);
    if (!Number.isFinite(amount) || amount <= 0) {
      return NextResponse.json({ error: "Invalid amount" }, { status: 400 });
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
        destination: body?.bankDetails || null,
      } as any,
    });

    return NextResponse.json(payout);
  } catch (error: any) {
    console.error("[FINANCE_PAYOUTS_POST]", error);
    return NextResponse.json({ error: error?.message || "Failed to request payout" }, { status: 500 });
  }
});
