import { db } from "@/lib/db";
class KitchenServiceManager {
    constructor() {
        // Config
        this.maxConcurrentOrders = 20;
        this.averagePrepTime = 15; // minutes
    }
    /**
     * Fetches active orders for the kitchen (Unfulfilled or Preparing)
     */
    async getOrders(storeId) {
        return await db.order.findMany({
            where: {
                storeId,
                fulfillmentStatus: { in: ["UNFULFILLED", "PREPARING"] },
                paymentStatus: { in: ["SUCCESS", "PAID", "VERIFIED"] }
            },
            include: {
                items: true,
            },
            orderBy: {
                createdAt: "asc" // FIFO
            }
        });
    }
    /**
     * Updates order status from the kitchen
     */
    async updateStatus(orderId, status) {
        // READY -> READY_FOR_PICKUP or SHIPPED
        // PREPARING -> PREPARING
        // 1. Update Order
        const updatedOrder = await db.order.update({
            where: { id: orderId },
            data: {
                fulfillmentStatus: status
            }
        });
        // 2. Log Timeline Event
        await db.orderTimelineEvent.create({
            data: {
                orderId,
                title: `Kitchen Update: ${status}`,
                body: `Order status changed to ${status} by kitchen display system.`
            }
        });
        return updatedOrder;
    }
    /**
     * Fetches daily kitchen metrics
     */
    async getMetrics(storeId) {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const now = new Date();
        const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000);
        // 1. Basic Counts
        const ordersToday = await db.order.count({
            where: {
                storeId,
                createdAt: { gte: today }
            }
        });
        const ordersInQueue = await db.order.count({
            where: {
                storeId,
                fulfillmentStatus: { in: ["UNFULFILLED", "PREPARING"] }
            }
        });
        // 2. Throughput (Orders completed in last hour)
        const throughput = await db.order.count({
            where: {
                storeId,
                fulfillmentStatus: { in: ["READY_FOR_PICKUP", "OUT_FOR_DELIVERY", "DELIVERED"] },
                updatedAt: { gte: oneHourAgo }
            }
        });
        // 3. Avg Prep Time (Simple Estimate from today's completed orders)
        // In a real high-scale system, this would be pre-calculated or cached.
        const completedOrdersToday = await db.order.findMany({
            where: {
                storeId,
                fulfillmentStatus: { in: ["READY_FOR_PICKUP", "OUT_FOR_DELIVERY", "DELIVERED"] },
                createdAt: { gte: today }
            },
            select: {
                createdAt: true,
                updatedAt: true,
                orderTimelineEvents: {
                    where: { title: { contains: "PREPARING" } },
                    take: 1
                }
            },
            take: 100 // Sample size limit for performance
        });
        let totalPrepTimeMinutes = 0;
        let countedOrders = 0;
        for (const order of completedOrdersToday) {
            // Use explicit "PREPARING" event if available, otherwise assume created -> fulfilled
            // Cast to any because the select type inference is failing in this specific setup
            const events = order.orderTimelineEvents;
            const startTime = events && events[0] ? events[0].createdAt : order.createdAt;
            const endTime = order.updatedAt;
            const diffMs = endTime.getTime() - startTime.getTime();
            const diffMins = diffMs / 1000 / 60;
            if (diffMins > 0 && diffMins < 480) { // Filter anomalies > 8 hours
                totalPrepTimeMinutes += diffMins;
                countedOrders++;
            }
        }
        const avgPrepTime = countedOrders > 0
            ? Math.round(totalPrepTimeMinutes / countedOrders)
            : this.averagePrepTime; // Fallback to config default if no data
        return {
            ordersToday,
            ordersInQueue,
            avgPrepTime,
            throughput,
        };
    }
    checkCapacity(storeId) {
        // For now returning default, in a real system we would count active orders
        return { allowed: true, waitTime: this.averagePrepTime };
    }
    // --- Client-side Compatibility Mocks (No-ops for real DB) ---
    subscribe(callback) {
        // This used to be for in-memory updates. Now handled by polling in KitchenBoard.
        return () => { };
    }
    addOrder(order) {
        console.warn("KitchenService.addOrder is a no-op on the server. Use /api/orders instead.");
    }
}
// Global Singleton
export const KitchenService = new KitchenServiceManager();
