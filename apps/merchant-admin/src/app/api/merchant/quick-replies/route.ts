import { NextResponse } from "next/server";
import { withVayvaAPI } from "@/lib/api-handler";
import { PERMISSIONS } from "@/lib/team/permissions";
import { prisma } from "@vayva/db";

export const GET = withVayvaAPI(PERMISSIONS.SUPPORT_VIEW, async (_req, { storeId }) => {
  try {
    const store = await prisma.store.findUnique({
      where: { id: storeId },
      select: { settings: true },
    });

    const settings: any = (store?.settings as any) || {};
    const items = Array.isArray(settings.quickReplies) ? settings.quickReplies : [];

    return NextResponse.json({ items });
  } catch (error: any) {
    console.error("[QUICK_REPLIES_GET]", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
});
