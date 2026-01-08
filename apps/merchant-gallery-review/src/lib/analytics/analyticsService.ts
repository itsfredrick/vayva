import { prisma } from "@vayva/db";

export class AnalyticsService {
  static async trackEvent(data: {
    merchantId: string;
    storeId?: string | null;
    eventName: string;
    visitorId?: string;
    sessionId?: string;
    path?: string;
    properties?: any;
  }) {
    // Validate event names if strict
    const ALLOWED_EVENTS = [
      "page_view",
      "product_view",
      "add_to_cart",
      "checkout_start",
      "purchase",
      "signup_started",
      "signup_completed",
      "onboarding_step_complete",
      "store_live",
    ];

    // if (!ALLOWED_EVENTS.includes(data.eventName)) return; // Strict mode

    return prisma.analytics_event.create({
      data: {
        merchantId: data.merchantId,
        storeId: data.storeId,
        eventName: data.eventName,
        visitorId: data.visitorId,
        sessionId: data.sessionId,
        path: data.path,
        properties: data.properties || {},
        correlationId: `evt_${Date.now()}_${Math.random().toString(36).slice(2)}`,
      },
    });
  }

  static async getMerchantSummary(merchantId: string, from: Date, to: Date) {
    // Aggregate Counts
    // Prisma groupBy is good here
    const events = await prisma.analytics_event.groupBy({
      by: ["eventName"],
      where: {
        merchantId,
        occurredAt: { gte: from, lte: to },
      },
      _count: {
        _all: true,
      },
    });

    const counts: Record<string, number> = {};
    events.forEach((e: any) => (counts[e.eventName] = e._count._all));

    // Visitors (Approximate distinct)
    // Prisma doesn't do distinct count easily in groupBy without raw query or separate query
    const visitors = await prisma.analytics_event.findMany({
      where: { merchantId, occurredAt: { gte: from, lte: to } },
      distinct: ["visitorId"],
      select: { visitorId: true },
    });

    return {
      visitors: visitors.length,
      pageViews: counts["page_view"] || 0,
      addToCart: counts["add_to_cart"] || 0,
      checkouts: counts["checkout_start"] || 0,
      purchases: counts["purchase"] || 0,
      conversionRate:
        visitors.length > 0
          ? ((counts["purchase"] || 0) / visitors.length) * 100
          : 0,
    };
  }

  static async getFunnel(from: Date, to: Date) {
    // Internal Admin Funnel
    // Steps: signup_started -> signup_completed -> store_live

    const stats = await prisma.analytics_event.groupBy({
      by: ["eventName"],
      where: {
        eventName: { in: ["signup_started", "signup_completed", "store_live"] },
        occurredAt: { gte: from, lte: to },
      },
      _count: { _all: true },
    });

    const map: any = {};
    stats.forEach((s: any) => (map[s.eventName] = s._count._all));

    return {
      started: map["signup_started"] || 0,
      completed: map["signup_completed"] || 0,
      live: map["store_live"] || 0,
    };
  }
}
