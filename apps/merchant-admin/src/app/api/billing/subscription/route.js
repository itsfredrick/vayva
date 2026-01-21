import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth/session";
import { prisma } from "@/lib/prisma";
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
            include: {},
        });
        if (!store) {
            return NextResponse.json({ error: "Store not found" }, { status: 404 });
        }
        const currentPlan = store.plan || "FREE";
        const subscription = await prisma.merchantAiSubscription.findUnique({
            where: { storeId },
        });
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
            limits: PLAN_LIMITS[currentPlan],
            usage: {
                orders: ordersThisMonth,
                whatsappMessages: 0,
                staffSeats: staffCount,
                products: productsCount,
                leads: leadsCount,
            },
            subscription,
            availablePlans: Object.entries(PLAN_LIMITS).map(([name, limits]) => ({
                name,
                ...limits,
            })),
        });
    }
    catch (error) {
        console.error("Subscription fetch error:", error);
        if (error.message === "Unauthorized") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }
        if (error.message.startsWith("Forbidden")) {
            return NextResponse.json({ error: "Forbidden" }, { status: 403 });
        }
        return NextResponse.json({ error: "Failed to fetch subscription" }, { status: 500 });
    }
}
export async function POST(request) {
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
            // Note: aiSubscription model does not exist. 
            // TODO: Implement proper subscription cancellation when model is available.
            /*
            const existingSubscription = await prisma.aiSubscription.findUnique(
              {
                where: { storeId },
              },
            );
      
            if (existingSubscription) {
              await prisma.aiSubscription.update({
                where: { storeId },
                data: {
                  status: "CANCELLED",
                  cancelAtPeriodEnd: true,
                },
              });
            }
            */
            return NextResponse.json({
                success: true,
                message: "Plan downgraded to Starter",
            });
        }
        // For paid plans, initiate Paystack payment
        const { PaystackService } = await import("@/lib/payment/paystack");
        const payment = await PaystackService.createPaymentForPlanChange(session.user.email, newPlan, storeId);
        return NextResponse.json({
            success: true,
            message: "Payment initiated",
            paymentUrl: payment.authorization_url,
            reference: payment.reference,
        });
    }
    catch (error) {
        console.error("Plan change error:", error);
        if (error.message === "Unauthorized") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }
        return NextResponse.json({ error: error.message || "Failed to change plan" }, { status: 500 });
    }
}
