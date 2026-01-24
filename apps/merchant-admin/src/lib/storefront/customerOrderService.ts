import { prisma } from "@vayva/db";
export class CustomerOrderService {
    static async getOrders(storeId: any, customerId: any) {
        return prisma.order.findMany({
            where: { storeId, customerId },
            orderBy: { createdAt: "desc" },
        });
    }
    static async getOrderDetail(storeId: any, customerId: any, orderId: any) {
        const order = await prisma.order.findUnique({
            where: { id: orderId },
        });
        if (!order ||
            order.storeId !== storeId ||
            order.customerId !== customerId) {
            throw new Error("Order not found or access denied");
        }
        // Return Order Data (Test)
        return {
            id: orderId,
            items: [{ id: "1", name: "Product A", price: 5000 }],
            total: 5000,
            status: "delivered",
            trackingRef: "TRK_123456",
            canReturn: true,
        };
    }
}
