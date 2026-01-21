import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { withVayvaAPI } from "@/lib/api-handler";
import { PERMISSIONS } from "@/lib/team/permissions";
export const GET = withVayvaAPI(PERMISSIONS.SETTINGS_VIEW, async (req, { storeId }) => {
    try {
        const { searchParams } = new URL(req.url);
        const status = searchParams.get("status") || "unread"; // 'unread' | 'all'
        const category = searchParams.get("category");
        const type = searchParams.get("type");
        const limit = Math.min(parseInt(searchParams.get("limit") || "50"), 100);
        const cursor = searchParams.get("cursor");
        const where = { storeId };
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
            take: limit + 1,
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
                storeId,
                isRead: false,
            },
        });
        return NextResponse.json({
            items: notifications.map((n) => ({
                ...n,
                type: n.severity,
                message: n.body,
            })),
            next_cursor: nextCursor,
            unread_count: unreadCount,
        });
    }
    catch (error) {
        console.error("Notifications API Error:", error);
        return NextResponse.json({ error: "Internal Error" }, { status: 500 });
    }
});
