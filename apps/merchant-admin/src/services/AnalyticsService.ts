
import { prisma } from "@/lib/prisma";
import { startOfDay, subDays, format } from "date-fns";
// import { OrderStatus, PaymentStatus } from "@prisma/client";

interface DateRange {
    from: Date;
    to: Date;
}

export class AnalyticsService {
    /**
     * Get Overview Metrics (Real Data)
     */
    static async getOverview(storeId: string, range: '7d' | '30d' | '90d' = '7d') {
        const days = range === '90d' ? 90 : range === '30d' ? 30 : 7;
        const startDate = startOfDay(subDays(new Date(), days));

        // 1. Fetch Orders in Range
        const orders = await prisma.order.findMany({
            where: {
                storeId,
                createdAt: { gte: startDate },
                status: { not: "CANCELLED" }, // Exclude canceled
                paymentStatus: "SUCCESS" // Only paid orders count for revenue? (Or verify logic)
                // Let's count all non-canceled for now, or strictly PAID.
                // Standard e-commerce usually reports "Gross Sales" (committed) or "Net Sales" (paid).
                // We'll stick to 'PAID' or 'FULFILLED' for revenue safety, or just non-canceled for broader view.
                // Let's go with: status != CANCELED
            },
            select: {
                id: true,
                total: true,
                createdAt: true,
                customerId: true
            }
        });

        // 2. Calculate Aggregates
        const totalSales = orders.reduce((sum, o) => sum + Number(o.total), 0);
        const totalOrders = orders.length;
        const aov = totalOrders > 0 ? totalSales / totalOrders : 0;

        // 3. Unique Customers in Range
        const uniqueCustomerIds = new Set(orders.map(o => o.customerId).filter(Boolean));
        const activeCustomers = uniqueCustomerIds.size;

        // 4. Time Series Data for Charts
        const chartData = this.groupByDay(orders, days);

        return {
            totalSales,
            totalOrders,
            aov,
            activeCustomers,
            chartData
        };
    }

    /**
     * Group orders by day and return array for Recharts
     */
    private static groupByDay(orders: any[], days: number) {
        const map = new Map<string, { date: string, sales: number, orders: number }>();
        const now = new Date();

        // Initialize all days with 0 to ensure continuous line
        for (let i = days; i >= 0; i--) {
            const date = subDays(now, i);
            const key = format(date, "MMM dd");
            map.set(key, { date: key, sales: 0, orders: 0 });
        }

        // Fill with data
        orders.forEach(order => {
            const key = format(order.createdAt, "MMM dd");
            if (map.has(key)) {
                const entry = map.get(key)!;
                entry.sales += Number(order.total);
                entry.orders += 1;
            }
        });

        return Array.from(map.values());
    }

    /**
     * Generate Insights (Text Summary)
     * For Pro: Could be more advanced. For now, rule-based.
     */
    static async getInsights(storeId: string) {
        // Fetch last 7 days vs previous 7 days
        const today = new Date();
        const startLast7 = subDays(today, 7);
        const startPrev7 = subDays(today, 14);

        const [last7, prev7] = await Promise.all([
            prisma.order.count({ where: { storeId, createdAt: { gte: startLast7 } } }),
            prisma.order.count({ where: { storeId, createdAt: { gte: startPrev7, lt: startLast7 } } })
        ]);

        const insights = [];

        if (last7 > prev7) {
            insights.push({
                type: 'positive',
                text: `Orders include perambulating on an upward trend! (${last7} vs ${prev7} last week).`
            });
        } else if (last7 < prev7) {
            insights.push({
                type: 'neutral',
                text: `Order volume slightly lower than last week (${last7} vs ${prev7}).`
            });
        } else {
            insights.push({
                type: 'neutral',
                text: `Order volume remains stable (${last7} orders).`
            });
        }

        // Add more manual insights...
        return insights;
    }
}
