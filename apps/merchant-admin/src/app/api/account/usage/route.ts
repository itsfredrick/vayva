import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth/session";
import { prisma } from "@/lib/prisma";
export async function GET() {
    try {
        const session = await requireAuth();
        const storeId = session.user.storeId;
        // Get current month's stats
        const now = new Date();
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        const [ordersCount, staffCount, store] = await Promise.all([
            prisma.order.count({
                where: {
                    storeId,
                    createdAt: { gte: startOfMonth },
                },
            }),
            prisma.membership.count({
                where: {
                    storeId,
                    status: "active",
                },
            }),
            prisma.store.findUnique({
                where: { id: storeId },
                select: { plan: true },
            }),
        ]);
        const plan = store?.plan || "STARTER";
        // Define limits based on plan
        const limits = {
            STARTER: {
                ordersPerMonth: 100,
                whatsappMessages: 1000,
                staffSeats: 2,
                templates: 5,
            },
            GROWTH: {
                ordersPerMonth: 1000,
                whatsappMessages: 5000,
                staffSeats: 5,
                templates: "unlimited",
            },
            PRO: {
                ordersPerMonth: "unlimited",
                whatsappMessages: "unlimited",
                staffSeats: "unlimited",
                templates: "unlimited",
            },
        };
        return NextResponse.json({
            orders: {
                used: ordersCount,
                limit: (limits as any)[plan].ordersPerMonth,
            },
            whatsappMessages: {
                used: 0, // Pending integration
                limit: (limits as any)[plan].whatsappMessages,
            },
            staffSeats: {
                used: staffCount,
                limit: (limits as any)[plan].staffSeats,
            },
            templates: {
                unlocked: (limits as any)[plan].templates,
            },
        });
    }
    catch (error: any) {
        console.error("Usage fetch error:", error);
        if (error.message === "Unauthorized") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }
        return NextResponse.json({ error: "Failed to fetch usage" }, { status: 500 });
    }
}
