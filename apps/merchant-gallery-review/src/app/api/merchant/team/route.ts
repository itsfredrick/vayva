import { NextRequest, NextResponse } from "next/server";
import { getSessionUser } from "@/lib/session";
import { prisma } from "@vayva/db";
import { hasPermission, PERMISSIONS } from "@/lib/auth/permissions";

export async function GET(req: NextRequest) {
  const user = await getSessionUser();
  if (!user?.storeId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { storeId, id: userId } = user;

  // View permission check?
  // Team page usually accessible to view if you are a member? Or restricted?
  // Prompt says "Other see a clean 'You don't have access' screen".
  // "Only users with team.manage can access." -> Phase 4 Gating.
  // So API should also enforce.

  // However, basic "who is in my team" might be viewable by everyone?
  // Let's restrict manageable actions to TEAM_MANAGE, but maybe GET is wider?
  // Prompt says: "Only users with team.manage can access."

  const canManage = await hasPermission(
    userId,
    storeId,
    PERMISSIONS.TEAM_MANAGE,
  );
  // If we strict gate the page, we should gate the API.
  if (!canManage) {
    return new NextResponse("Forbidden", { status: 403 });
  }

  const members = await prisma.membership.findMany({
    where: { storeId },
    include: {
      User: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
          email: true,
          avatarUrl: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  const invites = await prisma.staffInvite.findMany({
    where: { storeId },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json({
    members: members.map((m: any) => ({
      id: m.id,
      userId: m.userId,
      name:
        `${m.User.firstName || ""} ${m.User.lastName || ""}`.trim() ||
        "Unknown",
      email: m.User.email,
      role: m.role,
      status: m.status,
      joinedAt: m.createdAt,
    })),
    invites: invites.map((i: any) => ({
      id: i.id,
      email: i.email,
      role: i.role,
      status: i.acceptedAt
        ? "accepted"
        : new Date(i.expiresAt) < new Date()
          ? "expired"
          : "pending",
      createdAt: i.createdAt,
      expiresAt: i.expiresAt,
    })),
  });
}
