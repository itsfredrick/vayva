import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/session";
import { prisma } from "@vayva/db";

export async function GET() {
  try {
    // Require authentication
    const user = await getSessionUser();
    if (!user) {
      return NextResponse.json(
        { error: "Unauthorized - Please login" },
        { status: 401 },
      );
    }

    // Get real settlements/payouts from database
    const settlements = await prisma.payout.findMany({
      where: { storeId: user.storeId },
      orderBy: { createdAt: "desc" },
      take: 50,
    });

    // Transform to expected format
    const formattedSettlements = settlements.map((settlement) => ({
      id: settlement.id,
      amount: Number(settlement.amount), // Already in naira (Decimal)
      currency: settlement.currency,
      status: settlement.status,
      payoutDate:
        settlement.arrivalDate?.toISOString() ||
        settlement.createdAt.toISOString(),
      referenceId: settlement.providerPayoutId || settlement.id,
      description: `Payout via ${settlement.provider}`,
    }));

    return NextResponse.json(formattedSettlements);
  } catch (error: any) {
    console.error("Fetch Settlements Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
