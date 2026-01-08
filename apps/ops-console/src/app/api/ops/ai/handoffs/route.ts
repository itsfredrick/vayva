import { NextResponse } from "next/server";
import { prisma } from "@vayva/db";
import { OpsAuthService } from "@/lib/ops-auth";

export async function GET(request: Request) {
    const { user } = await OpsAuthService.requireSession(); // Ensure auth

    // Fetch recent Handoff Events
    // We want to see conversations where a handoff was triggered recently.
    // Ideally, we'd filter for "Active" ones, but HandoffEvent is just a log.
    // So we fetch the last 50 events and let the UI show them.
    // Bonus: Check if the ticket associated is still OPEN.

    const handoffs = await prisma.handoffEvent.findMany({
        take: 50,
        orderBy: { createdAt: 'desc' },
        include: {
            store: {
                select: { id: true, name: true, slug: true }
            },
            conversation: {
                select: {
                    id: true,
                    contact: {
                        select: {
                            phoneE164: true
                        }
                    },
                    storeId: true, // Use storeId instead of platform if platform is missing on Conversation, implied by context
                    lastMessageAt: true,
                }
            },
            ticket: {
                select: {
                    id: true,
                    status: true, // OPEN, CLOSED
                    priority: true
                }
            }
        }
    });

    // Transform for UI
    const data = handoffs.map(h => ({
        id: h.id,
        storeName: h.store.name,
        customerPhone: h.conversation.contact.phoneE164,
        trigger: h.triggerType, // SENTIMENT, etc
        aiSummary: h.aiSummary,
        ticketStatus: h.ticket.status,
        timestamp: h.createdAt,
        // Mocking last message for now as extracting it from conversation relation might be heavy if not optimized
        lastMessagePreview: "Customer requested specific help..."
    }));

    return NextResponse.json({ data });
}
