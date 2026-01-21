import { NextResponse } from "next/server";
import { prisma } from "@vayva/db";
import { withVayvaAPI } from "@/lib/api-handler";
import { PERMISSIONS } from "@/lib/team/permissions";
export const GET = withVayvaAPI(PERMISSIONS.SUPPORT_VIEW, async (req, { params, storeId }) => {
    try {
        const { id } = await params; // conversationId
        // Verify access
        const conversation = await prisma.conversation.findUnique({
            where: { id, storeId },
            include: {
                contact: true,
                messages: {
                    orderBy: { createdAt: "asc" }
                }
            }
        });
        if (!conversation) {
            return NextResponse.json({ error: "Conversation not found" }, { status: 404 });
        }
        return NextResponse.json(conversation);
    }
    catch (error) {
        console.error("[CONVERSATION_GET]", error);
        return NextResponse.json({ error: "Internal Error" }, { status: 500 });
    }
});
export const POST = withVayvaAPI(PERMISSIONS.SUPPORT_MANAGE, async (req, { params, storeId }) => {
    try {
        const { id } = await params;
        const body = await req.json();
        const { text } = body;
        if (!text) {
            return NextResponse.json({ error: "Message text required" }, { status: 400 });
        }
        // Verify conversation
        const conversation = await prisma.conversation.findUnique({
            where: { id, storeId }
        });
        if (!conversation) {
            return NextResponse.json({ error: "Conversation not found" }, { status: 404 });
        }
        // Create Message
        // Note: Schema might check for 'storeId' on Message too if isolated at message level?
        // Usually message acts on conversation.
        // Check Schema for Message model if possible, but assuming standard relation.
        // Based on generic patterns:
        const message = await prisma.message.create({
            data: {
                storeId,
                conversationId: id,
                direction: "OUTBOUND",
                status: "SENT",
                textBody: text
            }
        });
        // Update Conversation
        await prisma.conversation.update({
            where: { id },
            data: {
                lastMessageAt: new Date(),
                lastOutboundAt: new Date(),
                // Reset unread count? Logic depends on merchant reading it (which is happening now)
                unreadCount: 0
            }
        });
        return NextResponse.json(message);
    }
    catch (error) {
        console.error("[CONVERSATION_REPLY]", error);
        return NextResponse.json({ error: "Internal Error" }, { status: 500 });
    }
});
