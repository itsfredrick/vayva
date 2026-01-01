
import { NextResponse } from "next/server";
import { prisma } from "@vayva/db";
import { OpsAuthService } from "@/lib/ops-auth";

export const dynamic = "force-dynamic";

export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { user } = await OpsAuthService.requireSession();
        if (!["OPS_OWNER", "OPS_ADMIN", "OPS_SUPPORT"].includes(user.role)) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
        }

        const resolvedParams = await params;
        const { id } = resolvedParams;

        const [conversation, messages] = await Promise.all([
            prisma.conversation.findUnique({
                where: { id },
                include: {
                    store: { select: { name: true } },
                    contact: { select: { displayName: true, phoneE164: true } }
                }
            }),
            prisma.message.findMany({
                where: { conversationId: id },
                orderBy: { createdAt: "asc" },
                take: 50
            })
        ]);

        if (!conversation) {
            return NextResponse.json({ error: "Conversation not found" }, { status: 404 });
        }

        return NextResponse.json({
            conversation: {
                id: conversation.id,
                storeName: conversation.store.name,
                customer: conversation.contact,
                status: conversation.status
            },
            messages
        });

    } catch (error: any) {
        if (error.message === "Unauthorized") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

export async function POST(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { user } = await OpsAuthService.requireSession();
        if (!["OPS_OWNER", "OPS_ADMIN", "OPS_SUPPORT"].includes(user.role)) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
        }

        const resolvedParams = await params;
        const { id } = resolvedParams;
        const { text, reason } = await request.json();

        if (!text || !reason) {
            return NextResponse.json({ error: "Message text and reason are required" }, { status: 400 });
        }

        const conversation = await prisma.conversation.findUnique({
            where: { id }
        });

        if (!conversation) {
            return NextResponse.json({ error: "Conversation not found" }, { status: 404 });
        }

        // Create message and log audit
        const [message] = await prisma.$transaction([
            prisma.message.create({
                data: {
                    conversationId: id,
                    storeId: conversation.storeId,
                    direction: "OUTBOUND",
                    textBody: text,
                    type: "TEXT",
                    status: "SENT",
                    sentAt: new Date(),
                }
            }),
            prisma.opsAuditEvent.create({
                data: {
                    opsUserId: user.id,
                    eventType: "SUPPORT_REPLY_SENT",
                    metadata: { conversationId: id, reason }
                }
            }),
            prisma.conversation.update({
                where: { id },
                data: { lastMessageAt: new Date() }
            })
        ]);

        return NextResponse.json({ success: true, message });

    } catch (error: any) {
        if (error.message === "Unauthorized") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
