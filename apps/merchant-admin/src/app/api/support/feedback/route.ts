import { NextResponse } from "next/server";
import { prisma } from "@vayva/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { conversationId, messageId, rating, reason, comment } = body;
    const storeId = (session.user as any).storeId;

    if (!messageId || !rating) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 },
      );
    }

    // Enforce Rules
    const finalReason = rating === "SOLVED" ? null : reason;
    const finalComment = rating === "SOLVED" ? null : comment;

    // Store Feedback
    await (prisma as any).supportBotFeedback.create({
      data: {
        storeId,
        conversationId: conversationId || "unknown",
        messageId,
        rating,
        reason: finalReason,
        // input comment if schema supported it, for now we stick to schema
      },
    });

    // Telemetry
    await (prisma as any).supportTelemetryEvent.create({
      data: {
        storeId,
        conversationId: conversationId || "unknown",
        eventType: "MERCHANT_FEEDBACK_RECORDED",
        messageId,
        payload: { rating, reason: finalReason },
      },
    });

    // Simple Auto-Escalation Check on Negative Feedback Loop
    // If this conversation has > 2 NOT_SOLVED ratings, we could auto-escalate here.
    // For MVP, we just store the data.

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[SupportFeedback] Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
