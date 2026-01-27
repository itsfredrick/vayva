import { NextResponse } from "next/server";
import { withVayvaAPI } from "@/lib/api-handler";
import { PERMISSIONS } from "@/lib/team/permissions";
import { prisma } from "@vayva/db";

export const GET = withVayvaAPI(PERMISSIONS.FINANCE_VIEW, async (_req, { storeId }) => {
  try {
    const wallet = await prisma.wallet.findUnique({ where: { storeId } });

    const availableKobo = BigInt(wallet?.availableKobo ?? 0);
    const pendingKobo = BigInt(wallet?.pendingKobo ?? 0);

    const toNgn = (kobo: bigint) => Number(kobo) / 100;

    return NextResponse.json({
      totalSales: 0,
      platformFees: 0,
      netEarnings: 0,
      pendingBalance: toNgn(pendingKobo),
      availableBalance: toNgn(availableKobo),
      currency: "NGN",
      dailySales: [],
    });
  } catch (error: any) {
    console.error("[FINANCE_OVERVIEW_GET]", error);
    return NextResponse.json({ error: "Failed to load finance overview" }, { status: 500 });
  }
});
