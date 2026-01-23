import { NextResponse } from "next/server";
import { prisma } from "@vayva/db";
import { withVayvaAPI } from "@/lib/api-handler";
import { PERMISSIONS } from "@/lib/team/permissions";
export const GET = withVayvaAPI(PERMISSIONS.SUPPORT_MANAGE, async (req, { storeId }) => {
    try {
        const conversations = await prisma.conversation.findMany({
            where: { storeId },
            include: {
                contact: { select: { displayName: true, phoneE164: true, externalId: true } },
                messages: {
                    orderBy: { createdAt: "desc" },
                    take: 1,
                    select: { textBody: true, createdAt: true, direction: true }
                }
            },
            orderBy: { lastMessageAt: "desc" },
            take: 30
        });
        const formatted = conversations.map((c) => ({
            id: c.id,
            contactName: c.contact?.displayName || c.contact?.phoneE164 || "Unknown Contact",
            subtitle: c.contact?.phoneE164 || c.contact?.externalId,
            status: c.status,
            unread: c.unreadCount > 0,
            lastMessage: c.messages[0]?.textBody || "No messages",
            lastMessageAt: c.messages[0]?.createdAt || c.createdAt,
            direction: c.messages[0]?.direction || "INBOUND"
        }));
        return NextResponse.json({ success: true, data: formatted });
    }
    catch (error) {
        console.error("Conversations API Error:", error);
        return NextResponse.json({ error: "Failed to fetch conversations" }, { status: 500 });
    }
});
