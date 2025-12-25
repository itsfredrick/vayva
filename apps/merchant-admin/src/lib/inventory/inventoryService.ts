
import { prisma } from '@vayva/db';

export class InventoryService {

    /**
     * Helper to resolve default location (Store-based)
     */
    private static async resolveLocation(storeId: string): Promise<string> {
        const loc = await prisma.inventoryLocation.findFirst({
            where: { storeId, isDefault: true }
        });
        if (loc) return loc.id;

        // Create default if none
        const newLoc = await prisma.inventoryLocation.create({
            data: {
                storeId,
                name: 'Default Warehouse',
                isDefault: true
            }
        });
        return newLoc.id;
    }

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
        const locationId = await this.resolveLocation(merchantId);

        return prisma.$transaction(async (tx) => {
            // Find existing or create default
            let item = await tx.inventoryItem.findFirst({
                where: {
                    locationId,
                    productId: productId, // Assuming InventoryItem still has productId based on previous repo.ts edits
                    variantId: variantId || undefined
                }
            });

            if (!item) {
                // To create, we need productId in InventoryItem? 
                // Schema check: InventoryItem has productId?
                // repo.ts check: it used productId.
                // Checking schema again: InventoryItem { id, locationId, variantId, productId ... }
                // Yes it has productId.
                item = await tx.inventoryItem.create({
                    data: {
                        locationId,
                        productId,
                        variantId: variantId!,
                        onHand: 0,
                        reserved: 0
                    }
                });
            }

            const diff = newOnHand - item.onHand;
            if (diff === 0) return item;

            const updated = await tx.inventoryItem.update({
                where: { id: item.id },
                data: { onHand: newOnHand }
            });

            // Inventory Movement
            await tx.inventoryMovement.create({
                data: {
                    storeId: merchantId,
                    locationId,
                    variantId: variantId!,
                    type: 'adjust',
                    quantity: diff,
                    // Dropping extraneous fields not in schema
                    performedBy: actor.label,
                    referenceId: 'manual'
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
        const locationId = await this.resolveLocation(merchantId);
        const expiresAt = new Date(Date.now() + 15 * 60 * 1000); // 15 mins

        await prisma.$transaction(async (tx) => {
            for (const item of items) {
                const inventory = await tx.inventoryItem.findFirst({
                    where: {
                        locationId,
                        productId: item.productId,
                        variantId: item.variantId || undefined
                    }
                });

                // Check availability
                const currentOnHand = inventory?.onHand || 0;
                const currentReserved = inventory?.reserved || 0;
                const available = currentOnHand - currentReserved;

                if (available < item.quantity) {
                    throw new Error(`Out of stock for product ${item.productId}`);
                }

                if (!inventory) throw new Error(`Product ${item.productId} not found in inventory`);

                // Increment Reserved
                await tx.inventoryItem.update({
                    where: { id: inventory.id },
                    data: { reserved: { increment: item.quantity } }
                });

                // Create Reservation Record
                // Schema: stock_reservation
                await tx.stock_reservation.create({
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
                await tx.inventoryMovement.create({
                    data: {
                        storeId: merchantId,
                        locationId,
                        variantId: item.variantId || 'unknown',
                        type: 'reserve',
                        quantity: item.quantity,
                        performedBy: 'Checkout Reservation',
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
        const reservations = await prisma.stock_reservation.findMany({
            where: { orderDraftId, status: 'active' }
        });

        if (reservations.length === 0) return;

        const locationId = await this.resolveLocation(merchantId);

        await prisma.$transaction(async (tx) => {
            for (const res of reservations) {
                const inventory = await tx.inventoryItem.findFirstOrThrow({
                    where: {
                        locationId,
                        productId: res.productId,
                        variantId: res.variantId || undefined
                    }
                });

                // Decrement OnHand AND Reserved
                await tx.inventoryItem.update({
                    where: { id: inventory.id },
                    data: {
                        onHand: { decrement: res.quantity },
                        reserved: { decrement: res.quantity }
                    }
                });

                // Update Reservation Status
                await tx.stock_reservation.update({
                    where: { id: res.id },
                    data: { status: 'confirmed' }
                });

                // Log Movement (Sale)
                await tx.inventoryMovement.create({
                    data: {
                        storeId: merchantId,
                        locationId,
                        variantId: res.variantId || 'unknown',
                        type: 'sale',
                        quantity: res.quantity * -1,
                        performedBy: 'Order Confirmation',
                        referenceId: orderId
                    }
                });
            }
        });
    }

    /**
     * Release reservation (e.g. timeout or cancel)
     */
    static async releaseReservation(merchantId: string, orderDraftId: string) {
        const reservations = await prisma.stock_reservation.findMany({
            where: { orderDraftId, status: 'active' }
        });

        const locationId = await this.resolveLocation(merchantId);

        await prisma.$transaction(async (tx) => {
            for (const res of reservations) {
                const inventory = await tx.inventoryItem.findFirst({
                    where: {
                        locationId,
                        productId: res.productId,
                        variantId: res.variantId || undefined
                    }
                });
                if (!inventory) continue;

                // Decrement Reserved Only (Back to Available)
                await tx.inventoryItem.update({
                    where: { id: inventory.id },
                    data: { reserved: { decrement: res.quantity } }
                });

                await tx.stock_reservation.update({
                    where: { id: res.id },
                    data: { status: 'released' }
                });

                await tx.inventoryMovement.create({
                    data: {
                        storeId: merchantId,
                        locationId,
                        variantId: res.variantId || 'unknown',
                        type: 'release',
                        quantity: 0,
                        performedBy: 'Reservation Release',
                        referenceId: orderDraftId,
                    }
                });
            }
        });
    }
}
