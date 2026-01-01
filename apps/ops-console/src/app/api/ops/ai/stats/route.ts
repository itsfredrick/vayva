
import { NextResponse } from "next/server";
import { prisma } from "@vayva/db";
import { OpsAuthService } from "@/lib/ops-auth";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
    try {
        const { user } = await OpsAuthService.requireSession();
        // Any Ops role can view AI stats
        if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        // 1. Total Aggregates (All Time)
        // Note: Prisma aggregate on BigInt needs handling for JSON serialization
        const aggregates = await prisma.aiUsageDaily.aggregate({
            _sum: {
                tokensCount: true,
                costKobo: true,
                requestsCount: true,
                imagesCount: true,
            }
        });

        // 2. Daily Trend (Last 7 Days)
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

        const dailyTrend = await prisma.aiUsageDaily.groupBy({
            by: ['date'],
            where: {
                date: { gte: sevenDaysAgo }
            },
            _sum: {
                tokensCount: true,
                costKobo: true
            },
            orderBy: {
                date: 'asc'
            }
        });

        // 3. Top Consumers (Stores with highest cost)
        const topStores = await prisma.aiUsageDaily.groupBy({
            by: ['storeId'],
            _sum: {
                costKobo: true,
                tokensCount: true,
                requestsCount: true
            },
            orderBy: {
                _sum: {
                    costKobo: 'desc'
                }
            },
            take: 10
        });

        // Fetch store names for top consumers
        const storeIds = topStores.map(s => s.storeId);
        const stores = await prisma.store.findMany({
            where: { id: { in: storeIds } },
            select: { id: true, name: true, slug: true, logoUrl: true }
        });

        const storeMap = new Map(stores.map(s => [s.id, s]));

        const consumersFormatted = topStores.map(s => {
            const store = storeMap.get(s.storeId);
            return {
                storeId: s.storeId,
                name: store?.name || "Unknown Store",
                slug: store?.slug,
                logoUrl: store?.logoUrl,
                totalCostKobo: Number(s._sum.costKobo || 0),
                totalTokens: s._sum.tokensCount || 0,
                totalRequests: s._sum.requestsCount || 0
            };
        });

        return NextResponse.json({
            totals: {
                tokens: aggregates._sum.tokensCount || 0,
                costKobo: Number(aggregates._sum.costKobo || 0),
                requests: aggregates._sum.requestsCount || 0,
                images: aggregates._sum.imagesCount || 0
            },
            trend: dailyTrend.map(d => ({
                date: d.date.toISOString().split('T')[0],
                tokens: d._sum.tokensCount || 0,
                costKobo: Number(d._sum.costKobo || 0)
            })),
            topConsumers: consumersFormatted
        });

    } catch (error) {
        console.error("Fetch AI Stats Error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
