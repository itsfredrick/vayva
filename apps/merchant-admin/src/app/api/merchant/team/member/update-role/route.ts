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
      const { userId: targetUserId, role } = await req.json();

      const targetMembership = await prisma.membership.findUnique({
        where: { userId_storeId: { userId: targetUserId, storeId } },
        select: { role_enum: true, id: true },
      });

      if (!targetMembership)
        return new NextResponse("Member not found", { status: 404 });

      // Cannot change OWNER role
      if (targetMembership.role_enum === "OWNER") {
        return new NextResponse("Cannot modify owner role", { status: 400 });
      }

      // Cannot assign OWNER role via this route (transfer ownership is separate flow)
      if (role.toUpperCase() === "OWNER") {
        return new NextResponse("Cannot assign owner role directly", {
          status: 400,
        });
      }

      const isCustomRole = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(role);

      await prisma.membership.update({
        where: { userId_storeId: { userId: targetUserId, storeId } },
        data: {
          role_enum: isCustomRole ? "STAFF" : role.toUpperCase() as any,
          roleId: isCustomRole ? role : null
        },
      });

      // Log audit event
      await logAuditEvent(storeId, user.id, AuditEventType.TEAM_ROLE_CHANGED, {
        targetType: "USER",
        targetId: targetUserId,
        meta: {
          oldRole: targetMembership.role_enum,
          newRole: role,
        }
      });

      const actorLabel =
        `${user.firstName || ""} ${user.lastName || ""}`.trim() ||
        user.email ||
        "System";

      await EventBus.publish({
        merchantId: storeId,
        type: "team.role_updated",
        payload: { targetUserId, oldRole: targetMembership.role_enum, newRole: role },
        ctx: {
          actorId: user.id,
          actorType: "merchant_user",
          actorLabel,
          correlationId,
        },
      });

      return NextResponse.json({ ok: true });
    } catch (error) {
      console.error("Update Role API Error:", error);
      return NextResponse.json({ error: "Internal Error" }, { status: 500 });
    }
  }
);
