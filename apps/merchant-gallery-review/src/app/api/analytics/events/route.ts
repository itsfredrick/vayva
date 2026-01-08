import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@vayva/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { AnalyticsEvent } from "@/lib/analytics/events";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { category, action, label, value, metadata, anonymousId, path } =
      body;

    // Basic Validation
    if (!category || !action) {
      return NextResponse.json(
        { error: "Missing defined category or action" },
        { status: 400 },
      );
    }

    // Auth Context (Optional)
    const session = await getServerSession(authOptions);
    const userId = session?.user?.id;
    const storeId = (session?.user as any)?.storeId;

    // Enrichment
    const userAgent = req.headers.get("user-agent") || undefined;
    // IP Handling: In production, trust Vercel/Proxy headers
    const forwardedFor = req.headers.get("x-forwarded-for");
    const ip = forwardedFor ? forwardedFor.split(",")[0] : "127.0.0.1";

    // Persist to DB (Append Only)
    // In a high-scale scenario, checking eventId dedupe effectively might be costly here.
    // We rely on the client sending unique events or just append.
    const event = await prisma.analyticsEvent.create({
      data: {
        category,
        action,
        label,
        value: value ? Number(value) : 0,
        metadata: metadata || {},
        userId,
        storeId,
        anonymousId,
        userAgent,
        path,
        ip,
        timestamp: new Date(),
      },
    });

    // Trigger Async Handlers (Webhooks, Segment, etc.) - Placeholder
    // await EventBus.publish(event);

    return NextResponse.json({ success: true, id: event.id });
  } catch (error) {
    console.error("Analytics Ingestion Error:", error);
    return NextResponse.json(
      { error: "Failed to ingest event" },
      { status: 500 },
    );
  }
}
