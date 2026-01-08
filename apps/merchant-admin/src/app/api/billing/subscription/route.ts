import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth/session";
import { prisma } from "@vayva/db";

const PLAN_LIMITS = {
  FREE: {
    ordersPerMonth: 0,
    whatsappMessages: 100,
    staffSeats: 0,
    templates: 2,
    price: 0,
    isTrial: true,
  },
  STARTER: {
    ordersPerMonth: 100,
    whatsappMessages: 500,
    staffSeats: 1,
    templates: 5,
    price: 30000,
  },
  PRO: {
    ordersPerMonth: "unlimited",
    whatsappMessages: "unlimited",
    staffSeats: 3,
    templates: "unlimited",
    price: 40000,
  },
};

export async function GET() {
  try {
    const session = await requireAuth();
    const storeId = session.user.storeId;

    const store = await prisma.store.findUnique({
      where: { id: storeId },
      include: {
        merchantSubscription: true,
      },
    });

    if (!store) {
      return NextResponse.json({ error: "Store not found" }, { status: 404 });
    }

    const currentPlan = store.plan || "FREE";
    const subscription = store.merchantSubscription;

    const [ordersThisMonth, staffCount, productsCount, leadsCount] = await Promise.all([
      prisma.order.count({
        where: {
          storeId,
          createdAt: {
            gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
          },
        },
      }),
      prisma.membership.count({
        where: {
          storeId,
          status: "active",
        },
      }),
      prisma.product.count({
        where: { storeId },
      }),
      prisma.customer.count({
        where: { storeId },
      }),
    ]);

    return NextResponse.json({
      currentPlan,
      limits: PLAN_LIMITS[currentPlan as keyof typeof PLAN_LIMITS],
      usage: {
        orders: ordersThisMonth,
        whatsappMessages: 0,
        staffSeats: staffCount,
        products: productsCount,
        leads: leadsCount,
      },
      subscription: subscription
        ? {
          status: subscription.status,
          currentPeriodStart: subscription.currentPeriodStart,
          currentPeriodEnd: subscription.currentPeriodEnd,
          cancelAtPeriodEnd: subscription.cancelAtPeriodEnd,
        }
        : null,
      availablePlans: Object.entries(PLAN_LIMITS).map(([name, limits]) => ({
        name,
        ...limits,
      })),
    });
  } catch (error: any) {
    console.error("Subscription fetch error:", error);

    if (error.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    if (error.message.startsWith("Forbidden")) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    return NextResponse.json(
      { error: "Failed to fetch subscription" },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  try {
    const session = await requireAuth();
    const storeId = session.user.storeId;

    const body = await request.json();
    const { newPlan } = body;

    if (!["FREE", "STARTER", "PRO"].includes(newPlan)) {
      return NextResponse.json({ error: "Invalid plan" }, { status: 400 });
    }

    // Get current plan
    const store = await prisma.store.findUnique({
      where: { id: storeId },
      select: { plan: true },
    });

    const currentPlan = store?.plan || "STARTER";

    // If downgrading to starter, no payment needed
    if (newPlan === "STARTER") {
      await prisma.store.update({
        where: { id: storeId },
        data: { plan: newPlan },
      });

      // Cancel subscription
      const existingSubscription = await prisma.merchantSubscription.findUnique(
        {
          where: { storeId },
        },
      );

      if (existingSubscription) {
        await prisma.merchantSubscription.update({
          where: { storeId },
          data: {
            status: "CANCELLED",
            cancelAtPeriodEnd: true,
          },
        });
      }

      return NextResponse.json({
        success: true,
        message: "Plan downgraded to Starter",
      });
    }

    // For paid plans, initiate Paystack payment
    const { PaystackService } = await import("@/lib/payment/paystack");

    const payment = await PaystackService.createPaymentForPlanChange(
      session.user.email,
      newPlan,
      storeId,
    );

    return NextResponse.json({
      success: true,
      message: "Payment initiated",
      paymentUrl: payment.authorization_url,
      reference: payment.reference,
    });
  } catch (error: any) {
    console.error("Plan change error:", error);

    if (error.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    return NextResponse.json(
      { error: error.message || "Failed to change plan" },
      { status: 500 },
    );
  }
}
