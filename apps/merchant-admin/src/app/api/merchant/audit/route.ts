import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { withVayvaAPI, HandlerContext } from "@/lib/api-handler";
import { PERMISSIONS } from "@/lib/team/permissions";

export const GET = withVayvaAPI(
  PERMISSIONS.TEAM_MANAGE,
  async (req: NextRequest, { storeId }: HandlerContext) => {
    try {
      const { searchParams } = new URL(req.url);
      const limit = Math.min(parseInt(searchParams.get("limit") || "50"), 100);
      const cursor = searchParams.get("cursor"); // expects "id"

      // Filters
      const entityType = searchParams.get("entity_type");
      const entityId = searchParams.get("entity_id");
      const action = searchParams.get("action");
      const actorId = searchParams.get("actor_id");

      const where: any = { storeId };

      if (entityType) where.entityType = entityType;
      if (entityId) where.entityId = entityId;
      if (action) where.action = action;
      if (actorId) where.actorId = actorId;

      const logs = await prisma.auditLog.findMany({
        where,
        take: limit + 1,
        cursor: cursor ? { id: cursor } : undefined,
        orderBy: [{ createdAt: "desc" }, { id: "desc" }],
      });

      let nextCursor = null;
      if (logs.length > limit) {
        const nextItem = logs.pop();
        nextCursor = nextItem?.id;
      }

      return NextResponse.json({
        items: logs,
        next_cursor: nextCursor,
      });
    } catch (error) {
      console.error("Audit Log API Error:", error);
      return NextResponse.json({ error: "Internal Error" }, { status: 500 });
    }
  }
);
