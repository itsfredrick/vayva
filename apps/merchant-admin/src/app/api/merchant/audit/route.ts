import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@vayva/db";

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!(session?.user as any)?.storeId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const limit = Math.min(parseInt(searchParams.get("limit") || "50"), 100);
  const cursor = searchParams.get("cursor"); // expects "id"

  // Filters
  const entityType = searchParams.get("entity_type");
  const entityId = searchParams.get("entity_id");
  const action = searchParams.get("action");
  const actorId = searchParams.get("actor_id");

  const where: any = {
    storeId: (session!.user as any).storeId,
  };

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
}
