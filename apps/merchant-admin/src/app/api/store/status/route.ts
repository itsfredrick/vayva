import { NextResponse } from "next/server";
import { withVayvaAPI } from "@/lib/api-handler";
import { PERMISSIONS } from "@/lib/team/permissions";
import { prisma } from "@vayva/db";

export const GET = withVayvaAPI(PERMISSIONS.SETTINGS_VIEW, async (_req, { storeId }) => {
  try {
    const store = await prisma.store.findUnique({
      where: { id: storeId },
      select: { kycStatus: true },
    });

    return NextResponse.json({
      kycStatus: store?.kycStatus ? String(store.kycStatus) : "NONE",
    });
  } catch (error: any) {
    console.error("[STORE_STATUS_GET]", error);
    return NextResponse.json({ error: "Failed to load store status" }, { status: 500 });
  }
});
