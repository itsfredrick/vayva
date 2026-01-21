import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { withVayvaAPI, HandlerContext } from "@/lib/api-handler";
import { PERMISSIONS } from "@/lib/team/permissions";
import { EventBus } from "@/lib/events/eventBus";
import { logAuditEvent, AuditEventType } from "@/lib/audit";

export const POST = withVayvaAPI(
  PERMISSIONS.TEAM_MANAGE,
  async (req: NextRequest, { storeId, user, correlationId }: HandlerContext) => {
    try {
      const { userId: targetUserId } = await req.json();

      const targetMembership = await prisma.membership.findUnique({
        where: { userId_storeId: { userId: targetUserId, storeId } },
        select: { role_enum: true },
      });

      if (!targetMembership)
        return new NextResponse("Member not found", { status: 404 });

      if (targetMembership.role_enum === "OWNER") {
        return new NextResponse("Cannot remove owner", { status: 400 });
      }

      await prisma.membership.delete({
        where: { userId_storeId: { userId: targetUserId, storeId } },
      });

      // Audit Log
      await logAuditEvent(storeId, user.id, AuditEventType.TEAM_MEMBER_REMOVED, {
        targetType: "USER",
        targetId: targetUserId,
        meta: {}
      });

      const actorLabel =
        `${user.firstName || ""} ${user.lastName || ""}`.trim() ||
        user.email ||
        "System";

      await EventBus.publish({
        merchantId: storeId,
        type: "team.member_removed",
        payload: { targetUserId },
        ctx: {
          actorId: user.id,
          actorType: "merchant_user",
          actorLabel,
          correlationId,
        },
      });

      return NextResponse.json({ ok: true });
    } catch (error) {
      console.error("Remove Member API Error:", error);
      return NextResponse.json({ error: "Internal Error" }, { status: 500 });
    }
  }
);
