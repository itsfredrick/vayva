import { requireAuth } from "@/lib/auth/session";
import { prisma } from "@vayva/db";
import { ReferralService } from "@/services/referral.service";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const session = await requireAuth();
    const storeId = session.user.storeId;

    const store = await prisma.store.findUnique({
      where: { id: storeId },
      select: { settings: true },
    });

    let code = (store?.settings as any)?.referralCode;
    if (!code) {
      code = await ReferralService.generateCode(storeId);
    }

    const stats = await prisma.referralAttribution.findMany({
      where: { metadata: { path: ["referrerStoreId"], equals: storeId } },
    });

    const rewards = await prisma.ledgerEntry.findMany({
      where: {
        storeId,
        referenceType: "REFERRAL_REWARD",
      },
      orderBy: { createdAt: "desc" },
    });

    const pendingDiscount = await ReferralService.getMonthlyDiscount(storeId);

    return NextResponse.json({
      code,
      stats: {
        total: stats.length,
        conversions: stats.filter((s: any) => !!s.firstPaymentAt).length,
      },
      pendingDiscount,
      rewards: rewards.map((r: any) => ({
        id: r.id,
        amount: r.amount,
        createdAt: r.createdAt,
        description: r.description,
      })),
    });
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      { error: "Failed to fetch referral data" },
      { status: 500 },
    );
  }
}
