import { NextResponse } from "next/server";
import { SupportBotService } from "@/lib/support/support-bot.service";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

const rateLimitMap = new Map<string, { count: number; resetAt: number }>();

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const storeId = (session.user as any).storeId;

    // 0. Feature Flags & Kill Switch
    const ALLOWLIST = ["store_placeholder_123", "store_dev_pilot"]; // Replace with real IDs
    const IS_ENABLED =
      process.env.SUPPORT_BOT_ENABLED === "true" || ALLOWLIST.includes(storeId);
    const MODE = process.env.SUPPORT_BOT_MODE || "normal"; // 'normal' | 'escalate_only' | 'disabled'

    if (!IS_ENABLED || MODE === "disabled") {
      return NextResponse.json(
        {
          error: "Support bot is currently unavailable.",
          // Return a non-error status so UI handles it gracefully if needed,
          // but 404/503 is also fine. Let's send a standard message.
          message:
            "Our automated support is offline. Please email support@vayva.ng.",
        },
        { status: 503 },
      );
    }

    // Rate Limiting (30 requests / 10 mins)
    const now = Date.now();
    const limit = rateLimitMap.get(storeId) || {
      count: 0,
      resetAt: now + 600000,
    };

    if (now > limit.resetAt) {
      limit.count = 0;
      limit.resetAt = now + 600000;
    }

    if (limit.count >= 30) {
      return NextResponse.json(
        { error: "Rate limit exceeded. Please try again later." },
        { status: 429 },
      );
    }

    limit.count++;
    rateLimitMap.set(storeId, limit);

    const { query, history } = await req.json();

    if (!query) {
      return NextResponse.json({ error: "Missing query" }, { status: 400 });
    }

    // Emergency Mode: Auto-Escalate Everything
    if (MODE === "escalate_only") {
      // Lazily import service if not already at top, or just use it
      const { EscalationService } =
        await import("@/lib/support/escalation.service");
      await EscalationService.triggerHandoff({
        storeId,
        conversationId: "emergency_handoff_" + Date.now(),
        trigger: "MANUAL_REQUEST", // Treat as manual for safety
        reason: "Kill switch enabled: escalate_only mode",
        aiSummary: `System in emergency mode. User Query: "${query}"`,
      });
      return NextResponse.json({
        messageId: `msg_${Date.now()}_emergency`,
        message:
          "I'm connecting you to a human agent immediately. They will be with you shortly.",
        suggestedActions: [],
      });
    }

    // Use the Orchestrator
    const result = await SupportBotService.processMessage(
      storeId,
      query,
      history,
    );
    const messageId = `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    // Telemetry: Log Bot Reply
    // In a real event queue, this would be async/fire-and-forget
    const prismaCtx: any =
      (global as any).prisma || (await import("@vayva/db")).prisma;

    await prismaCtx.supportTelemetryEvent.create({
      data: {
        storeId,
        conversationId: "unknown", // Need client to pass this in next refactor
        eventType: "BOT_MESSAGE_CREATED",
        messageId,
        payload: {
          intent: "UNKNOWN", // Placeholder until NLU is separate
          suggestedActions: result.actions,
          toolFailures: 0,
        },
      },
    });

    return NextResponse.json({
      messageId,
      message: result.reply,
      suggestedActions: result.actions,
    });
  } catch (error) {
    console.error("[SupportAPI] Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
