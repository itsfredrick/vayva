import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { withVayvaAPI } from "@/lib/api-handler";
import { PERMISSIONS } from "@/lib/team/permissions";

export const POST = withVayvaAPI(PERMISSIONS.SETTINGS_EDIT, async (req: NextRequest, { storeId }) => {
  const body = await req.json().catch(() => ({}));
  const reason = typeof body?.reason === "string" ? body.reason.trim() : "";

  await prisma.store.update({
    where: { id: storeId },
    data: { isLive: false },
  });

  return NextResponse.json({ success: true, reason: reason || undefined });
});
