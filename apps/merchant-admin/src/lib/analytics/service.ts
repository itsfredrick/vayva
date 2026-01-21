import { prisma } from "@vayva/db";
import {
  ACQUISITION_EVENTS,
  ACTIVATION_EVENTS,
  COMMERCE_EVENTS,
} from "./events";

export interface DateRange {
  from: Date;
  to: Date;
}

export class AnalyticsService {
  // 1. Event Counts (Total & Unique Users)
  static async getEventCounts(storeId: string, range: DateRange) {
    const events = await prisma.analyticsEvent.groupBy({
      by: ["category", "action"],
      where: {
        storeId,
        timestamp: { gte: range.from, lte: range.to },
      },
      _count: {
        _all: true,
      },
    });
    return events.map((e: any) => ({
      category: e.category,
      action: e.action,
      count: e._count._all,
    }));
  }

  // 2. Conversion Funnel (Preview -> Checkout)
  static async getCheckoutFunnel(storeId: string, range: DateRange) {
    // Step 1: View Product
    // Step 2: Add to Cart
    // Step 3: Begin Checkout
    // Step 4: Purchase Success

    const [views, carts, checkouts, purchases] = await Promise.all([
      prisma.analyticsEvent.count({
        where: {
          storeId,
          action: COMMERCE_EVENTS.VIEW_PRODUCT,
          timestamp: { gte: range.from, lte: range.to },
        },
      }),
      prisma.analyticsEvent.count({
        where: {
          storeId,
          action: COMMERCE_EVENTS.ADD_TO_CART,
          timestamp: { gte: range.from, lte: range.to },
        },
      }),
      prisma.analyticsEvent.count({
        where: {
          storeId,
          action: COMMERCE_EVENTS.BEGIN_CHECKOUT,
          timestamp: { gte: range.from, lte: range.to },
        },
      }),
      prisma.analyticsEvent.count({
        where: {
          storeId,
          action: COMMERCE_EVENTS.PURCHASE_SUCCESS,
          timestamp: { gte: range.from, lte: range.to },
        },
      }),
    ]);

    return [
      { step: "View Product", count: views },
      { step: "Add to Cart", count: carts },
      { step: "Checkout", count: checkouts },
      { step: "Purchase", count: purchases },
    ];
  }

  // 3. Activation Progress (For Merchant Admin)
  static async getActivationProgress(storeId: string) {
    // Check distinct activation events for this store
    const events = await prisma.analyticsEvent.groupBy({
      by: ["action"],
      where: {
        storeId,
        category: "ACTIVATION",
      },
    });

    const actions = new Set(events.map((e: any) => e.action));

    return {
      categorySelected: actions.has(ACTIVATION_EVENTS.SELECT_CATEGORY),
      templateSelected: actions.has(ACTIVATION_EVENTS.SELECT_TEMPLATE),
      firstProductAdded: actions.has(ACTIVATION_EVENTS.ADD_FIRST_PRODUCT),
      storePublished: actions.has(ACTIVATION_EVENTS.PUBLISH_STORE),
    };
  }

  // 4. Daily Revenue (For Trend Chart)
  static async getDailyRevenue(storeId: string, range: DateRange) {
    // Group by Date
    // Note: Prisma groupBy doesn't natively support Date truncation easily across all DBs without raw query.
    // For local Postgres/Launch, we can fetch orders and aggregate in JS or use raw query.
    // Aggregating in JS for simplicity/safety given volume < 100k.

    const orders = await prisma.order.findMany({
      where: {
        storeId,
        paymentStatus: "PAID" as any,
        createdAt: { gte: range.from, lte: range.to },
      },
      select: {
        createdAt: true,
        total: true,
      },
      orderBy: { createdAt: "asc" },
    });

    // Map to daily buckets
    const dailyMap = new Map<string, number>();
    const dayMilliseconds = 24 * 60 * 60 * 1000;

    // Initialize all days in range
    for (let d = range.from.getTime(); d <= range.to.getTime(); d += dayMilliseconds) {
      const dateStr = new Date(d).toISOString().split('T')[0];
      dailyMap.set(dateStr, 0);
    }

    orders.forEach(o => {
      const dateStr = o.createdAt.toISOString().split('T')[0];
      const amount = (o.total as any).toNumber ? (o.total as any).toNumber() : Number(o.total);
      dailyMap.set(dateStr, (dailyMap.get(dateStr) || 0) + amount);
    });

    return Array.from(dailyMap.values());
  }
}
