import { NextRequest, NextResponse } from "next/server";
import { OpsAuthService } from "@/lib/ops-auth";
import { prisma } from "@vayva/db";

export const dynamic = "force-dynamic";

export async function POST(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { user } = await OpsAuthService.requireSession();
        OpsAuthService.requireRole(user, "OPERATOR");

        const { id: ticketId } = await params;
        const { message } = await req.json();

        if (!message || !message.trim()) {
            return NextResponse.json({ error: "Message cannot be empty" }, { status: 400 });
        }

        const ticket = await prisma.supportTicket.findUnique({
            where: { id: ticketId },
        });

        if (!ticket) {
            return NextResponse.json({ error: "Ticket not found" }, { status: 404 });
        }

        // Create the message
        const newMessage = await prisma.ticketMessage.create({
            data: {
                ticketId,
                storeId: ticket.storeId,
                sender: "OPS",
                authorType: "OPS",
                authorId: user.id,
                authorName: user.name,
                message: message.trim(),
                attachments: [], // TODO: attachment support
            },
        });

        // Update ticket metadata
        const updateData: any = {
            lastMessageAt: new Date(),
            status: "open", // Re-open if closed? Usually yes for outgoing replies.
        };

        if (!ticket.firstOpsReplyAt) {
            updateData.firstOpsReplyAt = new Date();
        }

        await prisma.supportTicket.update({
            where: { id: ticketId },
            data: updateData,
        });

        // Audit Log
        await OpsAuthService.logEvent(user.id, "SUPPORT_REPLY", {
            targetType: "SupportTicket",
            targetId: ticketId,
            reason: "Ops Agent Reply",
            storeId: ticket.storeId,
            messagePreview: message.trim().substring(0, 50),
        });

        return NextResponse.json({ success: true, data: newMessage });
    } catch (error: any) {
        if (error.message === "Unauthorized") return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        if (error.message?.includes("permissions")) return NextResponse.json({ error: error.message }, { status: 403 });

        console.error("Reply error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
