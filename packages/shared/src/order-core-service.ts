
import { prisma, FulfillmentStatus, OrderStatus, PaymentStatus, Channel, MerchantType, ImportOrderState } from "@vayva/db";
import { CartService } from "./cart-service";

export class OrderCoreService {

    /**
     * Splits a Parent Order into Fulfillment Groups (Child Orders) based on the store of each item.
     * This logic assumes items are already created and linked to the parent order.
     */
    static async splitOrder(parentOrderId: string) {
        // 1. Fetch Order with Items and Product->Store info
        const order = await prisma.order.findUnique({
            where: { id: parentOrderId },
            include: {
                items: {
                    include: {
                        productVariant: {
                            include: {
                                product: true // Get storeId from product
                            }
                        }
                    }
                },
                fulfillmentGroups: true // Check if already split
            }
        }) as any; // Cast to any to avoid TS inference issues with Prisma include in shared package

        if (!order) throw new Error("Order not found");
        // Access with safe checks, though 'any' allows anything
        const existingGroups = order.fulfillmentGroups;
        if (existingGroups && existingGroups.length > 0) {
            // Already split?
            return;
        }

        // 2. Group items by Store ID
        // Use 'any' to avoid strict type complex inference issues with include
        const groups: Record<string, any[]> = {};

        if (order.items) {
            for (const item of order.items) {
                // Resolve storeId
                // Fallback: If product/variant is missing, this fails. 
                // Assumption: Marketplace orders always have valid product links.
                // Cast item to any to access deep relations
                const variant = item.productVariant;
                const storeId = variant?.product?.storeId; // Uppercase P

                if (!storeId) {
                    console.error(`Item ${item.id} has no linked store (via ProductVariant). Skipping split for this item.`);
                    continue;
                }

                if (!groups[storeId]) {
                    groups[storeId] = [];
                }
                groups[storeId].push(item);
            }
        }

        // 3. Create Fulfillment Groups
        await prisma.$transaction(async (tx) => {
            for (const [storeId, items] of Object.entries(groups)) {

                // Create Group
                const group = await tx.fulfillmentGroup.create({
                    data: {
                        orderId: parentOrderId,
                        storeId: storeId,
                        status: 'UNFULFILLED', // Default
                        deliveryMethod: 'STANDARD',
                        deliveryFee: 0,
                        total: 0
                    }
                });

                // Link Items to Group
                for (const item of items) {
                    await tx.orderItem.update({
                        where: { id: item.id },
                        data: { fulfillmentGroupId: group.id }
                    });
                }
            }
        });

        return { success: true };
    }

    /**
 * Creates a Parent Order and Fulfillment Groups from a Cart.
 */
    static async createOrdersFromCart(cartId: string, userId: string) {
        // 1. Get Cart with "Virtual Splitting" logic
        const cart = await CartService.getCart(cartId);
        if (!cart || cart.items.length === 0) {
            throw new Error("Cart is empty or not found");
        }

        // 2. Prepare Order Data
        const refCode = `ORD-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
        // Calculate Totals
        // cart.cartTotal is the items subtotal
        // grandTotal is items + all delivery fees
        const deliveryTotal = cart.groups.reduce((sum, g) => sum + g.deliveryFee, 0);
        const grandTotal = cart.cartTotal + deliveryTotal;



        // 2b. CAP Integration: Detect China Suppliers
        const storeIds = cart.groups.map(g => g.storeId);
        const chinaStores = await prisma.store.findMany({
            where: {
                id: { in: storeIds },
                type: MerchantType.CHINA_SUPPLIER
            },
            select: { id: true }
        });
        const isImportOrder = chinaStores.length > 0;

        // 3. Transactional Creation
        return await prisma.$transaction(async (tx) => {
            // A. Create Parent Order
            const order = await tx.order.create({
                data: {
                    refCode,
                    orderNumber: `#${refCode}`,
                    customerId: userId, // Link to buyer
                    status: 'DRAFT', // Moved to OPEN/PROCESSING after payment
                    paymentStatus: 'INITIATED', // Will check later if deposit required
                    fulfillmentStatus: 'UNFULFILLED',
                    currency: 'NGN',
                    storeId: storeIds[0],

                    // Deposit Logic
                    // We need to calculate if this is a "Deposit Order"
                    // Iterate items to see if any require deposit? Or if ALL require?
                    // For now, simpler: If ANY item requires deposit, the whole order is "Partial/Deposit" flow?
                    // Better: Calculated metadata.
                    // But we don't have metadata field on Order schema exposed in create easily without casting.
                    // We'll stick to standard fields.

                    subtotal: cart.cartTotal,
                    deliveryFee: deliveryTotal,
                    total: grandTotal,
                    channel: 'MARKETPLACE',
                    // Optional fields
                    tax: 0,
                    shippingTotal: deliveryTotal,
                    discountTotal: 0,
                    source: 'MARKETPLACE', // Critical for Merchant Admin filtering
                    // CAP Integration
                    importStatus: isImportOrder ? ImportOrderState.CREATED : null,
                }
            });

            // B. Create Fulfillment Groups (Per Store)
            const groupMap = new Map<string, string>(); // storeId -> fulfillmentGroupId

            for (const group of cart.groups) {
                const fg = await tx.fulfillmentGroup.create({
                    data: {
                        orderId: order.id,
                        storeId: group.storeId,
                        status: 'UNFULFILLED',
                        deliveryMethod: 'STANDARD',
                        deliveryFee: group.deliveryFee,
                        total: group.subtotal + group.deliveryFee
                    }
                });
                groupMap.set(group.storeId, fg.id);
            }

            // C. Create Order Items
            for (const item of cart.items) {
                // We need to find which store this item belongs to to link FG.
                const product = (item as any).variant?.product;
                const storeId = product?.storeId;

                if (!storeId || !groupMap.has(storeId)) {
                    throw new Error(`Item ${item.id} belongs to unknown store or group creation failed.`);
                }

                await tx.orderItem.create({
                    data: {
                        orderId: order.id,
                        fulfillmentGroupId: groupMap.get(storeId),
                        productId: product.id,
                        variantId: item.variantId,
                        title: product.title,
                        sku: (item as any).variant.sku || product.sku,
                        price: (item as any).variant.price,
                        quantity: item.quantity
                    }
                });
            }

            // D. Delete Cart
            await tx.cart.delete({
                where: { id: cartId }
            });

            return order;
        });
    }
}

