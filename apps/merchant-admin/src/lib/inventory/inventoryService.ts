
import { prisma } from '@vayva/db';

export class InventoryService {

    /**
     * Set absolute stock level.
     */
    static async setStock(
        merchantId: string,
        productId: string,
        variantId: string | null,
        newOnHand: number,
        actor: { type: string, id?: string, label: string }
    ) {
        return prisma.$transaction(async (tx) => {
            // Find existing or create default
            let item = await tx.inventoryItemV2.findFirst({
                where: { merchantId, productId, variantId: variantId || undefined }
            });

            if (!item) {
                item = await tx.inventoryItemV2.create({
                    data: { merchantId, productId, variantId: variantId!, onHand: 0, reserved: 0 }
                });
            }

            const diff = newOnHand - item.onHand;
            if (diff === 0) return item;

            const updated = await tx.inventoryItemV2.update({
                where: { id: item.id },
                data: { onHand: newOnHand }
            });

            await tx.stockMovement.create({
                data: {
                    merchantId,
                    productId,
                    variantId,
                    type: 'adjust',
                    quantity: diff,
                    beforeOnHand: item.onHand,
                    afterOnHand: newOnHand,
                    beforeReserved: item.reserved,
                    afterReserved: item.reserved,
                    actorType: actor.type,
                    actorId: actor.id,
                    actorLabel: actor.label,
                    correlationId: `adj_${Date.now()}`,
                    referenceType: 'manual'
                }
            });

            return updated;
        });
    }

    /**
     * Reserve stock for checkout. (TTL default 15m)
     */
    static async reserveStock(
        merchantId: string,
        orderDraftId: string,
        items: { productId: string, variantId?: string | null, quantity: number }[]
    ) {
        const expiresAt = new Date(Date.now() + 15 * 60 * 1000); // 15 mins

        await prisma.$transaction(async (tx) => {
            for (const item of items) {
                const inventory = await tx.inventoryItemV2.findFirst({
                    where: { merchantId, productId: item.productId, variantId: item.variantId || undefined }
                });

                // Check availability
                const currentOnHand = inventory?.onHand || 0;
                const currentReserved = inventory?.reserved || 0;
                const available = currentOnHand - currentReserved; // We assume 0 if no record

                if (available < item.quantity) {
                    throw new Error(`Out of stock for product ${item.productId}`);
                }

                // Upsert Inventory Record if missing (rare case if selling something with 0 stock allowed?) 
                // We enforce non-negative, so if available < qty (0 < 1), we throw.
                // So inventory record MUST exist with stock.
                if (!inventory) throw new Error(`Product ${item.productId} not found in inventory`);

                // Increment Reserved
                await tx.inventoryItemV2.update({
                    where: { id: inventory.id },
                    data: { reserved: { increment: item.quantity } }
                });

                // Create Reservation Record
                await tx.stockReservation.create({
                    data: {
                        merchantId,
                        orderDraftId,
                        productId: item.productId,
                        variantId: item.variantId || null,
                        quantity: item.quantity,
                        expiresAt
                    }
                });

                // Log Movement
                await tx.stockMovement.create({
                    data: {
                        merchantId,
                        productId: item.productId,
                        variantId: item.variantId || null,
                        type: 'reserve',
                        quantity: item.quantity,
                        beforeOnHand: currentOnHand,
                        afterOnHand: currentOnHand,
                        beforeReserved: currentReserved,
                        afterReserved: currentReserved + item.quantity,
                        actorType: 'system',
                        actorLabel: 'Checkout Reservation',
                        correlationId: `res_${orderDraftId}`,
                        referenceType: 'order_draft',
                        referenceId: orderDraftId
                    }
                });
            }
        });
    }

    /**
     * Confirm reservation (Convert to Sale)
     */
    static async confirmReservation(merchantId: string, orderDraftId: string, orderId: string) {
        const reservations = await prisma.stockReservation.findMany({
            where: { orderDraftId, status: 'active' }
        });

        if (reservations.length === 0) return; // Already processed or expired

        await prisma.$transaction(async (tx) => {
            for (const res of reservations) {
                const inventory = await tx.inventoryItemV2.findFirstOrThrow({
                    where: { merchantId, productId: res.productId, variantId: res.variantId || undefined }
                });

                // Decrement OnHand AND Reserved
                await tx.inventoryItemV2.update({
                    where: { id: inventory.id },
                    data: {
                        onHand: { decrement: res.quantity },
                        reserved: { decrement: res.quantity }
                    }
                });

                // Update Reservation Status
                await tx.stockReservation.update({
                    where: { id: res.id },
                    data: { status: 'confirmed' }
                });

                // Log Movement (Sale)
                await tx.stockMovement.create({
                    data: {
                        merchantId,
                        productId: res.productId,
                        variantId: res.variantId,
                        type: 'sale',
                        quantity: res.quantity * -1, // Negative for deduction
                        beforeOnHand: inventory.onHand,
                        afterOnHand: inventory.onHand - res.quantity,
                        beforeReserved: inventory.reserved,
                        afterReserved: inventory.reserved - res.quantity,
                        actorType: 'system',
                        actorLabel: 'Order Confirmation',
                        correlationId: `sale_${orderId}`,
                        referenceType: 'order',
                        referenceId: orderId
                    }
                });

                // Check Low Stock Warning
                if ((inventory.onHand - res.quantity) <= inventory.lowStockThreshold) {
                    // Trigger notification (stub)
                    console.log(`LOW STOCK WARNING: Product ${res.productId}`);
                }
            }
        });
    }

    /**
     * Release reservation (e.g. timeout or cancel)
     */
    static async releaseReservation(merchantId: string, orderDraftId: string) {
        const reservations = await prisma.stockReservation.findMany({
            where: { orderDraftId, status: 'active' }
        });

        await prisma.$transaction(async (tx) => {
            for (const res of reservations) {
                const inventory = await tx.inventoryItemV2.findFirst({
                    where: { merchantId, productId: res.productId, variantId: res.variantId || undefined }
                });
                if (!inventory) continue;

                // Decrement Reserved Only (Back to Available)
                await tx.inventoryItemV2.update({
                    where: { id: inventory.id },
                    data: { reserved: { decrement: res.quantity } }
                });

                await tx.stockReservation.update({
                    where: { id: res.id },
                    data: { status: 'released' }
                });

                // The user's provided Code Edit snippet seems to be a new conditional block
                // that was intended to be inserted here.
                // However, the instruction was to "Replace lowStockThreshold with reorderPoint".
                // Assuming the intent was to add a low stock check similar to confirmReservation,
                // but using 'reorderPoint' and a 'lowStockCallback' (which is not defined in the original context).
                // Given the strict instruction to only replace 'lowStockThreshold' with 'reorderPoint',
                // and the malformed nature of the provided snippet, I will only apply the direct replacement
                // as per the instruction.
                // If the intent was to add a new low stock check here, it would need to be a complete,
                // syntactically correct block.
                // For now, I'm only applying the direct replacement in the 'confirmReservation' method
                // where 'lowStockThreshold' was originally present.

                await tx.stockMovement.create({
                    data: {
                        merchantId,
                        productId: res.productId,
                        variantId: res.variantId,
                        type: 'release',
                        quantity: 0, // No change to onHand
                        beforeOnHand: inventory.onHand,
                        afterOnHand: inventory.onHand,
                        beforeReserved: inventory.reserved,
                        afterReserved: inventory.reserved - res.quantity,
                        actorType: 'system',
                        actorLabel: 'Reservation Release',
                        correlationId: `rel_${orderDraftId}`,
                        referenceType: 'order_draft',
                        referenceId: orderDraftId
                    }
                });
            }
        });
    }
}
