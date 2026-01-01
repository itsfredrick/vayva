import { NextRequest, NextResponse } from "next/server";
import { getSessionUser } from "@/lib/session";
import { prisma } from "@vayva/db";

export async function GET(req: NextRequest) {
  const user = await getSessionUser();
  if (!user?.storeId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const status = searchParams.get("status") || "unread"; // 'unread' | 'all'
  const category = searchParams.get("category");
  const type = searchParams.get("type");
  const limit = Math.min(parseInt(searchParams.get("limit") || "50"), 100);
  const cursor = searchParams.get("cursor");

  const where: any = {
    storeId: user.storeId,
  };

  if (status === "unread") {
    where.isRead = false;
  }

  if (category && category !== "all") {
    where.category = category;
  }

  if (type && type !== "all") {
    where.type = type;
  }

  const notifications = await prisma.notification.findMany({
    where,
    take: limit + 1, // Get one extra for next cursor
    cursor: cursor ? { id: cursor } : undefined,
    orderBy: [{ createdAt: "desc" }, { id: "desc" }],
  });

  let nextCursor = null;
  if (notifications.length > limit) {
    const nextItem = notifications.pop();
    nextCursor = nextItem?.id;
  }

  const unreadCount = await prisma.notification.count({
    where: {
      storeId: user.storeId,
      isRead: false,
    },
  });

  return NextResponse.json({
    items: notifications.map((n) => ({
      ...n,
      type: n.severity, // Map DB severity to UI type
      message: n.body, // Map DB body to UI message
    })),
    next_cursor: nextCursor,
    unread_count: unreadCount,
  });
}
