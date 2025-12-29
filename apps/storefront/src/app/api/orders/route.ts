import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@vayva/db';
import { reportError } from '@/lib/error';

export async function POST(req: NextRequest) {
    let storeId: string | undefined;

    try {
        const body = await req.json();
        storeId = body.storeId; // Capture for error context
        const { items, customer, deliveryMethod, subtotal, total } = body;

        // Basic validation
        if (!storeId || !items || items.length === 0 || !total) {
            return NextResponse.json({ message: 'Invalid order data' }, { status: 400 });
        }

        // Generate Order Details
        const count = await prisma.order.count({ where: { storeId } });
        const orderNumber = `ORD-${Date.now().toString().slice(-6)}-${count + 1}`;
        const refCode = `REF-${Math.random().toString(36).substring(7).toUpperCase()}`;

        let initialPaymentStatus = 'INITIATED';
        if (deliveryMethod === 'shipping' || body.paymentMethod === 'credit_card') {
            initialPaymentStatus = 'SUCCESS';
        }

        // Execute as a Transaction to ensure Inventory Integrity
        const result = await prisma.$transaction(async (tx) => {
            // 1. Check and Decrement Inventory
            for (const item of items) {
                if (item.id) {
                    const product = await tx.product.findUnique({ where: { id: item.id } });

                    if (product && product.trackInventory) {
                        // Attempt to update only if enough stock exists
                        const updateResult = await tx.inventoryItem.updateMany({
                            where: {
                                productId: item.id,
                                InventoryLocation: { isDefault: true },
                                available: { gte: item.quantity } // Integrity Guard
                            },
                            data: {
                                available: { decrement: item.quantity }
                            }
                        });

                        if (updateResult.count === 0) {
                            throw new Error(`Out of stock for product: ${item.title}`);
                        }
                    }
                }
            }

            // 2. Create Order
            const order = await tx.order.create({
                data: {
                    storeId: storeId!,
                    refCode,
                    orderNumber,
                    status: 'DRAFT',
                    paymentStatus: initialPaymentStatus as any,
                    fulfillmentStatus: 'UNFULFILLED',
                    total: total,
                    subtotal: subtotal || total,
                    customerEmail: customer?.email,
                    customerPhone: customer?.phone,
                    customerNote: customer?.note,
                    deliveryMethod: deliveryMethod || 'shipping',
                    OrderItem: {
                        create: items.map((item: any) => ({
                            title: item.title,
                            quantity: item.quantity,
                            price: item.price,
                            productId: item.id
                        }))
                    }
                }
            });

            // 3. Wallet Credit Logic
            if (initialPaymentStatus === 'SUCCESS') {
                const amountKobo = BigInt(Math.round((total || 0) * 100));

                await tx.wallet.upsert({
                    where: { storeId: storeId! },
                    update: {
                        availableKobo: { increment: amountKobo }
                    },
                    create: {
                        storeId: storeId!,
                        availableKobo: amountKobo,
                        kycStatus: 'VERIFIED',
                        vaStatus: 'CREATED',
                        vaBankName: 'Wema Bank',
                        vaAccountNumber: `9${Math.floor(Math.random() * 9000000000)}`,
                        vaAccountName: 'Vayva Merchant Store'
                    }
                });
            }

            return order;
        });

        // Return success
        return NextResponse.json({
            success: true,
            orderId: result.id,
            paymentUrl: `/checkout/pay/${result.id}`
        });

    } catch (error: any) {
        reportError(error, { route: 'POST /api/orders', storeId: storeId });
        return NextResponse.json(
            { error: 'Failed to create order', details: error instanceof Error ? error.message : 'Unknown error' },
            { status: 500 }
        );
    }
}
