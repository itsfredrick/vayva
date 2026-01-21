import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { EscalationService, } from "@/lib/support/escalation.service";
export async function POST(req) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }
        const storeId = session.user.storeId;
        const body = await req.json();
        const { conversationId, trigger, reason, aiSummary, metadata } = body;
        // Validation
        if (!trigger || !reason) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }
        const ticket = await EscalationService.triggerHandoff({
            storeId,
            conversationId: conversationId || `manual_${Date.now()}`,
            trigger: trigger,
            reason,
            aiSummary: aiSummary || "Manual escalation requested via API",
            metadata,
        });
        return NextResponse.json({ success: true, ticketId: ticket.id });
    }
    catch (error) {
        console.error("[SupportEscalation] Error triggering handoff", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
