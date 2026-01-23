import { prisma } from "@vayva/db";

/**
 * Delivery Consolidation Service
 * Calculates "One Fee" for multi-vendor carts
 */
export class DeliveryConsolidationService {
    /**
     * Calculate consolidated delivery fee for multi-vendor cart
     * Rules:
     * - Use highest individual fee as base
     * - Add 20% for each additional store
     * - Cap at 150% of highest fee
     */
    async calculateConsolidatedFee(childOrderIds: string[]): Promise<number> {
        const childOrders = await prisma.order.findMany({
            where: { id: { in: childOrderIds } },
            select: { id: true, deliveryFee: true, subtotal: true },
        });

        if (childOrders.length === 0) {
            return 0;
        }

        if (childOrders.length === 1) {
            return Number(childOrders[0].deliveryFee);
        }

        const individualFees = childOrders.map((o) => Number(o.deliveryFee));
        const highestFee = Math.max(...individualFees);
        const additionalStores = childOrders.length - 1;

        // Calculate with 20% increment per additional store, capped at 150%
        const consolidatedFee = Math.min(
            highestFee * (1 + additionalStores * 0.2),
            highestFee * 1.5
        );

        return Math.round(consolidatedFee * 100) / 100; // Round to 2 decimals
    }

    /**
     * Distribute consolidated fee across child orders
     * Proportional to item subtotals
     */
    async distributeFee(
        parentOrderId: string,
        consolidatedFee: number
    ): Promise<void> {
        const childOrders = await prisma.order.findMany({
            where: { parentOrderId },
            select: { id: true, subtotal: true },
        });

        if (childOrders.length === 0) {
            throw new Error("No child orders found");
        }

        const totalSubtotal = childOrders.reduce(
            (sum, o) => sum + Number(o.subtotal),
            0
        );

        // Distribute fee proportionally
        for (const child of childOrders) {
            const proportion = Number(child.subtotal) / totalSubtotal;
            const allocatedFee = consolidatedFee * proportion;

            await prisma.order.update({
                where: { id: child.id },
                data: {
                    deliveryFee: Math.round(allocatedFee * 100) / 100,
                    metadata: {
                        ...(await this.getOrderMetadata(child.id) as Record<string, unknown>),
                        deliveryFeeAllocation: {
                            consolidatedTotal: consolidatedFee,
                            allocatedAmount: allocatedFee,
                            proportion,
                            calculatedAt: new Date().toISOString(),
                        },
                    },
                },
            });
        }

        // Update parent order with consolidated fee info
        await prisma.order.update({
            where: { id: parentOrderId },
            data: {
                deliveryFee: consolidatedFee,
                metadata: {
                    ...(await this.getOrderMetadata(parentOrderId) as Record<string, unknown>),
                    deliveryConsolidation: {
                        enabled: true,
                        totalFee: consolidatedFee,
                        childOrderCount: childOrders.length,
                        calculatedAt: new Date().toISOString(),
                    },
                },
            },
        });
    }

    /**
     * Check if order qualifies for consolidated delivery
     */
    async shouldConsolidate(parentOrderId: string): Promise<boolean> {
        const childOrders = await prisma.order.findMany({
            where: { parentOrderId },
            select: { id: true },
        });

        // Only consolidate if there are multiple child orders
        return childOrders.length > 1;
    }

    /**
     * Get delivery fee breakdown for display
     */
    async getFeeBreakdown(parentOrderId: string) {
        const parentOrder = await prisma.order.findUnique({
            where: { id: parentOrderId },
            select: { deliveryFee: true, metadata: true },
        });

        const childOrders = await prisma.order.findMany({
            where: { parentOrderId },
            select: {
                id: true,
                deliveryFee: true,
                metadata: true,
                store: { select: { name: true } },
            },
        });

        const consolidationData = (parentOrder?.metadata as Record<string, unknown>)
            ?.deliveryConsolidation as { enabled?: boolean; totalFee?: number; childOrderCount?: number };

        return {
            consolidated: consolidationData?.enabled || false,
            totalFee: Number(parentOrder?.deliveryFee || 0),
            childOrders: childOrders.map((child) => ({
                orderId: child.id,
                storeName: (child.store! as { name: string }).name,
                allocatedFee: Number(child.deliveryFee),
                allocation: (child.metadata as Record<string, unknown>)?.deliveryFeeAllocation,
            })),
            savings: consolidationData?.enabled
                ? childOrders.reduce((sum, o) => sum + Number(o.deliveryFee), 0) -
                Number(parentOrder?.deliveryFee || 0)
                : 0,
        };
    }

    /**
     * Helper to get order metadata safely
     */
    private async getOrderMetadata(orderId: string): Promise<unknown> {
        const order = await prisma.order.findUnique({
            where: { id: orderId },
            select: { metadata: true },
        });
        return (order?.metadata as unknown) || {};
    }
}

// Export singleton instance
export const deliveryConsolidationService =
    new DeliveryConsolidationService();
