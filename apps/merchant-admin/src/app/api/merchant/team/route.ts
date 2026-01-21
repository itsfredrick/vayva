import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { withVayvaAPI, HandlerContext } from "@/lib/api-handler";
import { PERMISSIONS } from "@/lib/team/permissions";

export const GET = withVayvaAPI(
  PERMISSIONS.TEAM_MANAGE,
  async (req: NextRequest, { storeId }: HandlerContext) => {
    try {
      const members = await prisma.membership.findMany({
        where: { storeId },
        include: {
          user: {
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
            `${m.user.firstName || ""} ${m.user.lastName || ""}`.trim() ||
            "Unknown",
          email: m.user.email,
          role: m.role_enum,
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
    } catch (error) {
      console.error("Team List API Error:", error);
      return NextResponse.json({ error: "Internal Error" }, { status: 500 });
    }
  }
);
