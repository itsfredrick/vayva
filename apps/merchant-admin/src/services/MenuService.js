import { db } from "@/lib/db";
import { Prisma } from "@vayva/db";
export const MenuService = {
    async createMenuItem(storeId, data) {
        // 1. Create the base Product
        const product = await db.product.create({
            data: {
                storeId,
                title: data.name,
                handle: data.name.toLowerCase().replace(/[^a-z0-9]+/g, '-') + '-' + Date.now(),
                description: data.description,
                price: new Prisma.Decimal(data.price),
                productType: "menu_item",
                status: "ACTIVE", // Default to active for menu items
                trackInventory: false, // Usually unlimited for restaurants unless specific
                // 2. Store food-specific fields in metadata
                metadata: data.metadata,
                // Default category handling could go here if categoryId is provided
            }
        });
        return product;
    },
    async getKitchenOrders(storeId) {
        return await db.order.findMany({
            where: {
                storeId,
                // Using fulfillmentStatus as proxy for Kitchen Status
                // In a real system, might want a specific 'kitchenStatus' field
                fulfillmentStatus: { in: ["UNFULFILLED", "PREPARING"] },
                paymentStatus: { in: ["SUCCESS", "PAID", "VERIFIED"] } // Cast for enum mismatch if any
            },
            include: {
                items: true,
            },
            orderBy: {
                createdAt: "asc" // Oldest first (FIFO)
            }
        });
    },
    async updateOrderStatus(orderId, status) {
        // Map simplified kitchen status to Order schema status
        // READY -> FULFILLED (or separate status if exists)
        const fulfillmentStatus = status === "READY" ? "FULFILLED" : "FULFILLED";
        return await db.order.update({
            where: { id: orderId },
            data: {
                fulfillmentStatus: fulfillmentStatus
            }
        });
    }
};
