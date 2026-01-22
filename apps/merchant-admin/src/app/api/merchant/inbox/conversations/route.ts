import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { withVayvaAPI, HandlerContext } from "@/lib/api-handler";
import { PERMISSIONS } from "@/lib/team/permissions";

export const GET = withVayvaAPI(
  PERMISSIONS.SUPPORT_VIEW,
  async (req: NextRequest, { storeId }: HandlerContext) => {
    try {
      const { searchParams } = new URL(req.url);
      const status = searchParams.get("status") || "OPEN";
      const limit = parseInt(searchParams.get("limit") || "20");

      const where: unknown = { merchantId: storeId };
      if (status !== "ALL") where.status = status;

      const items = await prisma.conversation.findMany({
        where,
        orderBy: { lastMessageAt: "desc" },
        take: limit,
        include: {
          contact: { select: { phoneE164: true, displayName: true } },
          messages: {
            take: 1,
            orderBy: { createdAt: "desc" },
            select: { textBody: true, createdAt: true, direction: true },
          },
        },
      });

      const now = new Date();
      const result = items.map((c: unknown) => {
        let slaStatus = "active";
        if (c.unreadCount > 0 && c.lastInboundAt) {
          const diff = now.getTime() - new Date(c.lastInboundAt).getTime();
          if (diff > 24 * 60 * 60 * 1000) slaStatus = "overdue";
          else slaStatus = "unread";
        }
        return {
          ...c,
          slaStatus,
          lastMessage: c.messages[0],
        };
      });

      return NextResponse.json({ items: result });
    } catch (error) {
      console.error("Inbox Conversations API Error:", error);
      return NextResponse.json({ error: "Internal Error" }, { status: 500 });
    }
  }
);
