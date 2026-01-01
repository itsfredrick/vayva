import { NextResponse } from "next/server";
import { prisma } from "@vayva/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { searchParams } = new URL(req.url);
    const range = searchParams.get("range") || "today";

    // 1. Date Logic (UTC-based simple window)
    const now = new Date();
    const start = new Date();
    if (range === "7d") {
      start.setDate(now.getDate() - 7);
    } else {
      start.setHours(0, 0, 0, 0); // Start of today
    }

    const dateFilter = { createdAt: { gte: start } };

    // 2. Fetch Aggregates
    // Tickets Created
    const ticketsCreated = await (prisma as any).supportTicket.count({
      where: dateFilter,
    });

    // Overdue (Open & Past Due)
    const overdueTickets = await (prisma as any).supportTicket.count({
      where: {
        status: { not: "RESOLVED" },
        slaDueAt: { lt: now },
      },
    });

    // Escalation Triggers Breakdown (from Telemetry)
    const escalations = await (prisma as any).supportTelemetryEvent.groupBy({
      by: ["payload"],
      where: {
        eventType: "BOT_ESCALATED",
        ...dateFilter,
      },
    });

    // Manual aggregation of JSON payloads (prisma group by json is limited)
    // Ideally we'd map this, but for MVP we count raw events or query all
    const rawEscalations = await (prisma as any).supportTelemetryEvent.findMany(
      {
        where: { eventType: "BOT_ESCALATED", ...dateFilter },
        select: { payload: true },
      },
    );

    const triggerCounts: Record<string, number> = {};
    rawEscalations.forEach((e: any) => {
      const t = e.payload?.trigger || "UNKNOWN";
      triggerCounts[t] = (triggerCounts[t] || 0) + 1;
    });

    const triggerBreakdown = Object.entries(triggerCounts).map(([k, v]) => ({
      trigger: k,
      count: v,
    }));

    // Feedback Stats
    const feedback = await (prisma as any).supportBotFeedback.findMany({
      where: dateFilter,
    });
    const thumbsUp = feedback.filter((f: any) => f.rating === "SOLVED").length;
    const totalFeedback = feedback.length;
    const thumbsUpRate = totalFeedback > 0 ? thumbsUp / totalFeedback : 0;

    // Deflection Rate Proxy
    // (Total Bot Messages - Tickets Created) / Total Bot Messages
    // A crude but effective proxy for now.
    // Better: Count unique ConversationIds in telemetry vs Tickets Created
    const botConversations = await (
      prisma as any
    ).supportTelemetryEvent.groupBy({
      by: ["conversationId"],
      where: { eventType: "CHAT_STARTED", ...dateFilter },
    });
    const totalConvos = botConversations.length || 1;
    const deflectionRate = Math.max(
      0,
      (totalConvos - ticketsCreated) / totalConvos,
    );

    return NextResponse.json({
      range,
      ticketsCreated,
      overdueTickets,
      deflectionRate,
      thumbsUpRate,
      triggerBreakdown,
      debug: { totalConvos, ticketsCreated }, // Remove in prod
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Internal Error" }, { status: 500 });
  }
}
