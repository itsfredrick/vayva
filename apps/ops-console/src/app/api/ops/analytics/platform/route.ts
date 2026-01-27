import { NextResponse } from "next/server";
import { prisma } from "@vayva/db";
import { OpsAuthService } from "@/lib/ops-auth";

interface IndustryData {
    category: string | null;
    _count: { id: number };
}

interface PlanData {
    planKey: string | null;
    _count: { id: number };
}

interface MerchantData {
    id: string;
    name: string;
    _count: { orders: number };
    orders: { total: any }[];
}

export async function GET() {
    const session = await OpsAuthService.getSession();
    if (!session) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const now = new Date();
        const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        const sixtyDaysAgo = new Date(now.getTime() - 60 * 24 * 60 * 60 * 1000);

        // Total merchants
        const totalMerchants = await prisma.store.count();

        // Active merchants (had orders in last 30 days)
        const activeMerchants = await prisma.store.count({
            where: {
                orders: {
                    some: {
                        createdAt: { gte: thirtyDaysAgo }
                    }
                }
            }
        });

        // New merchants this month
        const newMerchantsThisMonth = await prisma.store.count({
            where: { createdAt: { gte: thirtyDaysAgo } }
        });

        // New merchants last month (for growth calculation)
        const newMerchantsLastMonth = await prisma.store.count({
            where: {
                createdAt: {
                    gte: sixtyDaysAgo,
                    lt: thirtyDaysAgo
                }
            }
        });

        const merchantGrowth = newMerchantsLastMonth > 0
            ? Math.round(((newMerchantsThisMonth - newMerchantsLastMonth) / newMerchantsLastMonth) * 100)
            : newMerchantsThisMonth > 0 ? 100 : 0;

        // GMV calculations
        const totalGMVResult = await prisma.order.aggregate({
            _sum: { total: true },
            where: { paymentStatus: "SUCCESS" }
        });
        const totalGMV = Number(totalGMVResult._sum.total || 0);

        const gmvThisMonthResult = await prisma.order.aggregate({
            _sum: { total: true },
            where: {
                paymentStatus: "SUCCESS",
                createdAt: { gte: thirtyDaysAgo }
            }
        });
        const gmvThisMonth = Number(gmvThisMonthResult._sum.total || 0);

        const gmvLastMonthResult = await prisma.order.aggregate({
            _sum: { total: true },
            where: {
                paymentStatus: "SUCCESS",
                createdAt: {
                    gte: sixtyDaysAgo,
                    lt: thirtyDaysAgo
                }
            }
        });
        const gmvLastMonth = Number(gmvLastMonthResult._sum.total || 0);

        const gmvGrowth = gmvLastMonth > 0
            ? Math.round(((gmvThisMonth - gmvLastMonth) / gmvLastMonth) * 100)
            : gmvThisMonth > 0 ? 100 : 0;

        // Orders
        const totalOrders = await prisma.order.count({
            where: { paymentStatus: "SUCCESS" }
        });

        const ordersThisMonth = await prisma.order.count({
            where: {
                paymentStatus: "SUCCESS",
                createdAt: { gte: thirtyDaysAgo }
            }
        });

        const ordersLastMonth = await prisma.order.count({
            where: {
                paymentStatus: "SUCCESS",
                createdAt: {
                    gte: sixtyDaysAgo,
                    lt: thirtyDaysAgo
                }
            }
        });

        const orderGrowth = ordersLastMonth > 0
            ? Math.round(((ordersThisMonth - ordersLastMonth) / ordersLastMonth) * 100)
            : ordersThisMonth > 0 ? 100 : 0;

        // Subscription revenue (from MerchantAiSubscription)
        const subscriptions = await prisma.merchantAiSubscription.findMany({
            where: { status: "active" },
            select: { planKey: true }
        });

        const planPrices: Record<string, number> = {
            FREE: 0,
            STARTER: 5000,
            GROWTH: 15000,
            PRO: 35000,
            ENTERPRISE: 100000,
        };

        const subscriptionRevenueThisMonth = subscriptions.reduce((sum: number, sub: { planKey: string | null }) => {
            return sum + (planPrices[sub.planKey?.toUpperCase() || "FREE"] || 0);
        }, 0);

        const totalSubscriptionRevenue = subscriptionRevenueThisMonth * 12; // Annualized estimate

        // Marketplace listings
        const marketplaceListings = await prisma.marketplaceListing.count();
        const pendingListings = await prisma.marketplaceListing.count({
            where: { status: "PENDING_REVIEW" }
        });

        // Industry breakdown
        const industryData = await prisma.store.groupBy({
            by: ["category"],
            _count: { id: true },
        });

        // Get GMV per industry
        const industryBreakdown = await Promise.all(
            industryData.map(async (ind: IndustryData) => {
                const gmvResult = await prisma.order.aggregate({
                    _sum: { total: true },
                    where: {
                        paymentStatus: "SUCCESS",
                        store: { category: ind.category || undefined }
                    }
                });
                return {
                    industry: ind.category || "General",
                    count: ind._count.id,
                    gmv: Number(gmvResult._sum?.total || 0)
                };
            })
        );

        // Sort by GMV descending
        industryBreakdown.sort((a: { gmv: number }, b: { gmv: number }) => b.gmv - a.gmv);

        // Plan breakdown
        const planData = await prisma.merchantAiSubscription.groupBy({
            by: ["planKey"],
            _count: { id: true },
        });

        const planBreakdown = planData.map((p: PlanData) => ({
            plan: p.planKey?.toUpperCase() || "FREE",
            count: p._count.id,
            revenue: p._count.id * (planPrices[p.planKey?.toUpperCase() || "FREE"] || 0)
        }));

        // Add FREE plan for merchants without subscription
        const merchantsWithSub = await prisma.merchantAiSubscription.count();
        const freeMerchants = totalMerchants - merchantsWithSub;
        if (freeMerchants > 0) {
            const existingFree = planBreakdown.find((p: { plan: string }) => p.plan === "FREE");
            if (existingFree) {
                existingFree.count += freeMerchants;
            } else {
                planBreakdown.push({ plan: "FREE", count: freeMerchants, revenue: 0 });
            }
        }

        // Sort by plan tier
        const planOrder = ["FREE", "STARTER", "GROWTH", "PRO", "ENTERPRISE"];
        planBreakdown.sort((a: { plan: string }, b: { plan: string }) => planOrder.indexOf(a.plan) - planOrder.indexOf(b.plan));

        // Top merchants by GMV
        const topMerchantsData = await prisma.store.findMany({
            select: {
                id: true,
                name: true,
                _count: {
                    select: {
                        orders: {
                            where: {
                                paymentStatus: "SUCCESS",
                                createdAt: { gte: thirtyDaysAgo }
                            }
                        }
                    }
                },
                orders: {
                    where: {
                        paymentStatus: "SUCCESS",
                        createdAt: { gte: thirtyDaysAgo }
                    },
                    select: { total: true }
                }
            },
            take: 10
        });

        const topMerchants = topMerchantsData
            .map((m: MerchantData) => ({
                id: m.id,
                name: m.name,
                gmv: m.orders.reduce((sum: number, o: { total: any }) => sum + Number(o.total || 0), 0),
                orders: m._count.orders
            }))
            .sort((a: { gmv: number }, b: { gmv: number }) => b.gmv - a.gmv)
            .slice(0, 10);

        return NextResponse.json({
            totalMerchants,
            activeMerchants,
            newMerchantsThisMonth,
            merchantGrowth,
            totalGMV,
            gmvThisMonth,
            gmvGrowth,
            totalOrders,
            ordersThisMonth,
            orderGrowth,
            totalSubscriptionRevenue,
            subscriptionRevenueThisMonth,
            subscriptionGrowth: 0, // Would need historical data
            marketplaceListings,
            pendingListings,
            industryBreakdown,
            planBreakdown,
            topMerchants,
        });
    } catch (error: any) {
        console.error("Platform analytics error:", error);
        return NextResponse.json({ error: "Failed to fetch analytics" }, { status: 500 });
    }
}
