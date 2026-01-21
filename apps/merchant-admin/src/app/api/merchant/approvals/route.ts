import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { withVayvaAPI, HandlerContext } from "@/lib/api-handler";
import { PERMISSIONS } from "@/lib/team/permissions";
import { EventBus } from "@/lib/events/eventBus";

export const POST = withVayvaAPI(
  PERMISSIONS.COMMERCE_MANAGE,
  async (req: NextRequest, { storeId, user, correlationId }: HandlerContext) => {
    try {
      const body = await req.json();
      const { actionType, entityType, entityId, payload, reason } = body;

      const approval = await prisma.approval.create({
        data: {
          merchantId: storeId,
          requestedByUserId: user.id,
          requestedByLabel: `${user.firstName || ""} ${user.lastName || ""}`.trim() || user.email,
          actionType,
          entityType,
          entityId,
          payload,
          reason,
          correlationId,
        },
      });

      // Audit & Notify
      await EventBus.publish({
        merchantId: storeId,
        type: "approvals.requested",
        payload: {
          approvalId: approval.id,
          actionType,
          requestedBy: approval.requestedByLabel,
        },
        ctx: {
          actorId: user.id,
          actorType: "user" as any,
          actorLabel: approval.requestedByLabel || "Unknown User",
          correlationId,
        },
      });

      return NextResponse.json({ ok: true, id: approval.id });
    } catch (error: any) {
      console.error("Approval Request Error", error);
      return NextResponse.json({ error: error.message || "Internal Error" }, { status: 500 });
    }
  }
);

export const GET = withVayvaAPI(
  PERMISSIONS.COMMERCE_VIEW,
  async (req: NextRequest, { storeId }: HandlerContext) => {
    try {
      const { searchParams } = new URL(req.url);
      const status = searchParams.get("status");
      const limit = parseInt(searchParams.get("limit") || "20");

      const where: any = { merchantId: storeId };
      if (status && status !== "all") where.status = status;

      const items = await prisma.approval.findMany({
        where,
        orderBy: { createdAt: "desc" },
        take: limit,
      });

      return NextResponse.json({ items });
    } catch (error) {
      console.error("Fetch Approvals Error:", error);
      return NextResponse.json({ error: "Internal Error" }, { status: 500 });
    }
  }
);
