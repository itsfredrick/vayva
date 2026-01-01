import { NextResponse } from "next/server";
import { prisma } from "@vayva/db";
import { checkPermission } from "@/lib/team/rbac";
import { PERMISSIONS } from "@/lib/team/permissions";

export async function GET() {
  try {
    const session = await checkPermission(PERMISSIONS.SETTINGS_VIEW);
    const storeId = (session.user as any).storeId;

    const [members, invites] = await Promise.all([
      prisma.membership.findMany({
        where: { storeId, status: "active" },
        include: { User: true },
      }),
      prisma.staffInvite.findMany({
        where: { storeId, acceptedAt: null },
      }),
    ]);

    return NextResponse.json({ members, invites });
  } catch (error: any) {
    console.error("Team fetch error:", error);
    if (
      error.message.includes("Forbidden") ||
      error.message.includes("Unauthorized")
    ) {
      return NextResponse.json(
        { error: error.message },
        { status: error.message.includes("Forbidden") ? 403 : 401 },
      );
    }
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
