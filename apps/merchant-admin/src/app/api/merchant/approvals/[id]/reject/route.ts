import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { withVayvaAPI, HandlerContext } from "@/lib/api-handler";
import { PERMISSIONS } from "@/lib/team/permissions";
import { EventBus } from "@/lib/events/eventBus";

export const POST = withVayvaAPI(
  PERMISSIONS.COMMERCE_MANAGE,
  async (req: NextRequest, { storeId, user, params }: HandlerContext) => {
    try {
      const { id } = await params;

      const request = await prisma.approval.findUnique({ where: { id } });
      if (!request) return NextResponse.json({ error: "Not Found" }, { status: 404 });
      if (request.merchantId !== storeId)
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });
      if (request.status !== "PENDING")
        return NextResponse.json({ error: "Request not pending" }, { status: 400 });

      const body = await req.json().catch(() => ({}));
      const reason = body?.decisionReason;

      await prisma.approval.update({
        where: { id },
        data: {
          status: "REJECTED",
          decidedByUserId: user.id,
          decidedByLabel: `${user.firstName || ""} ${user.lastName || ""}`.trim() || user.email,
          decidedAt: new Date(),
          decisionReason: reason,
        },
      });

      await EventBus.publish({
        merchantId: storeId,
        type: "approvals.rejected",
        payload: { approvalId: id, reason },
        ctx: {
          actorId: user.id,
          actorType: "user" as unknown,
          actorLabel: `${user.firstName || ""} ${user.lastName || ""}`.trim() || user.email,
          correlationId: request.correlationId || `req_${id}`,
        },
      });

      return NextResponse.json({ ok: true, status: "rejected" });
    } catch (error) {
      console.error("Reject Approval Error:", error);
      return NextResponse.json({ error: "Internal Error" }, { status: 500 });
    }
  }
);
