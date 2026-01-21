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

    const { query, history, conversationId: clientConversationId } = await req.json();

    if (!query) {
      return NextResponse.json({ error: "Missing query" }, { status: 400 });
    }

    const conversationId = clientConversationId || `conv_${storeId}_${Date.now()}`;

    // 0. Feature Flags & Kill Switch
    // Allowed stores are defined in env or assume enabled if env is set to *
    const envAllowList = process.env.SUPPORT_BOT_ALLOWLIST?.split(",") || [];
    const ALLOWLIST = [...envAllowList];
    const isGlobalEnabled = process.env.SUPPORT_BOT_ENABLED === "true";

    // Enable if globally enabled OR explicitly allowlisted
    const IS_ENABLED = isGlobalEnabled || ALLOWLIST.includes(storeId) || ALLOWLIST.includes("*");
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

    // Rate Limiting (Distributed via DB - using OtpCode as store)
    const MAX_REQUESTS = 30;
    const WINDOW_MS = 600000; // 10 mins
    const now = new Date();
    const rateLimitKey = `rate_limit_support_${storeId}`;

    // --- Rate Limit Check (Distributed) ---
    // Use a scoped variable for prisma to avoid top-level shadowing if that was the issue,
    // or just reuse the import properly.
    const prismaRateLimit = (global as any).prisma || (await import("@vayva/db")).prisma;

    // Clean up old entries (Lazy cleanup)
    // await prismaCtx.otpCode.deleteMany({ where: { expiresAt: { lt: now }, type: "SUPPORT_RATE_LIMIT" } }); 

    // Find existing bucket
    let limitEntry = await prismaRateLimit.otpCode.findFirst({
      where: { identifier: rateLimitKey, type: "SUPPORT_RATE_LIMIT", expiresAt: { gt: now } }
    });

    let currentCount = 0;

    if (limitEntry) {
      currentCount = parseInt(limitEntry.code, 10);
      if (currentCount >= MAX_REQUESTS) {
        return NextResponse.json(
          { error: "Rate limit exceeded. Please try again later." },
          { status: 429 }
        );
      }
      // Increment
      await prismaRateLimit.otpCode.update({
        where: { id: limitEntry.id },
        data: { code: (currentCount + 1).toString() }
      });
    } else {
      // Create new bucket
      await prismaRateLimit.otpCode.create({
        data: {
          identifier: rateLimitKey,
          code: "1",
          type: "SUPPORT_RATE_LIMIT",
          expiresAt: new Date(now.getTime() + WINDOW_MS)
        }
      });
    }

    // Old in-memory map removed
    // const now = Date.now();
    // const limit = rateLimitMap.get(storeId) ...

    // Old body parse removed
    // const { query, history } = await req.json();

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
        conversationId, // Synced with client or generated
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
