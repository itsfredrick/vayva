import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { withVayvaAPI, APIContext } from "@/lib/api-handler";
import { PERMISSIONS } from "@/lib/team/permissions";
export const GET = withVayvaAPI(PERMISSIONS.METRICS_VIEW, async (request, { storeId }: APIContext) => {
    try {
        // 1. Sales Today (Revenue)
        const startOfToday = new Date();
        startOfToday.setHours(0, 0, 0, 0);
        const salesToday = await prisma.order.aggregate({
            where: {
                storeId,
                paymentStatus: "SUCCESS",
                createdAt: { gte: startOfToday },
            },
            _sum: { total: true },
        });
        // 2. Pending Orders
        const pendingOrders = await prisma.order.count({
            where: {
                storeId,
                fulfillmentStatus: "UNFULFILLED",
            },
        });
        // 3. Customers Count
        const customersCount = await prisma.customer.count({
            where: { storeId },
        });
        // 4. Trend calculation
        const startOfLastMonth = new Date(startOfToday.getFullYear(), startOfToday.getMonth() - 1, 1);
        const endOfLastMonth = new Date(startOfToday.getFullYear(), startOfToday.getMonth(), 0, 23, 59, 59, 999);
        const [prevSales, prevOrders, prevCustomers] = await Promise.all([
            prisma.order.aggregate({
                where: {
                    storeId,
                    paymentStatus: "SUCCESS",
                    createdAt: { gte: startOfLastMonth, lte: endOfLastMonth },
                },
                _sum: { total: true },
            }),
            prisma.order.count({
                where: {
                    storeId,
                    createdAt: { gte: startOfLastMonth, lte: endOfLastMonth },
                },
            }),
            prisma.customer.count({
                where: {
                    storeId,
                    createdAt: { gte: startOfLastMonth, lte: endOfLastMonth },
                },
            }),
        ]);
        const calculateTrend = (current: number, previous: number) => {
            if (previous === 0)
                return current > 0 ? 100 : 0;
            return Math.round(((current - previous) / previous) * 100);
        };
        const currentRevenue = Number(salesToday._sum.total || 0);
        const lastMonthRevenue = Number(prevSales._sum.total || 0);
        return NextResponse.json({
            metrics: {
                revenue: {
                    value: currentRevenue,
                    trend: calculateTrend(currentRevenue, lastMonthRevenue),
                },
                orders: {
                    value: pendingOrders,
                    trend: calculateTrend(pendingOrders, prevOrders),
                },
                customers: {
                    value: customersCount,
                    trend: calculateTrend(customersCount, prevCustomers),
                },
            },
        });
    }
    catch (error: any) {
        console.error("Dashboard Metrics Error:", error);
        return NextResponse.json({ error: "Failed to fetch dashboard metrics" }, { status: 500 });
    }
});
