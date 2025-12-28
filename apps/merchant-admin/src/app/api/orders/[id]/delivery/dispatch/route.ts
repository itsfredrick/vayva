import { NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth/session';
import { prisma } from '@vayva/db';
import { getDeliveryProvider, DispatchData } from '@/lib/delivery/DeliveryProvider';
import { FEATURES } from '@/lib/env-validation';

// Helper to bypass stale client types if models/fields are missing in generated client
const db = prisma as any;

// DISPATCH (POST /api/orders/[id]/delivery/dispatch)
export async function POST(request: Request, context: { params: Promise<{ id: string }> }) {
    try {
        const { id: orderId } = await context.params;

        // 1. Feature Flag Check
        if (!FEATURES.DELIVERY_ENABLED) {
            return NextResponse.json(
                { code: "feature_not_configured", feature: "DELIVERY_ENABLED", message: "Delivery is disabled." },
                { status: 503 }
            );
        }

        const session = await requireAuth();
        const { storeId, role } = session.user;

        // Role Check: Staff+
        if (['viewer'].includes(role)) {
            return NextResponse.json({ error: "Forbidden" }, { status: 403 });
        }

        // 2. Load Store Settings
        const settings = await db.storeDeliverySettings.findUnique({ where: { storeId } });

        if (!settings?.isEnabled) {
            return NextResponse.json({ error: "Delivery feature is not enabled for this store." }, { status: 400 });
        }
        if (!settings.pickupAddressLine1) {
            return NextResponse.json({ error: "Store pickup address is missing. Please configure it in Delivery Settings." }, { status: 400 });
        }

        // 3. Load Order with Shipment and Customer
        const order = await db.order.findUnique({
            where: { id: orderId, storeId },
            include: {
                Shipment: true,
                Customer: true
            }
        });

        if (!order) return NextResponse.json({ error: "Order not found" }, { status: 404 });

        // Check if shipment is in terminal state
        if (order.Shipment) {
            const status = order.Shipment.status;
            if (['DELIVERED', 'CANCELED', 'FAILED'].includes(status)) {
                return NextResponse.json({ error: "Delivery is already finished (Terminal State)." }, { status: 409 });
            }
            if (['REQUESTED', 'ACCEPTED', 'PICKED_UP', 'IN_TRANSIT'].includes(status)) {
                return NextResponse.json({ success: true, shipment: order.Shipment });
            }
            // If DRAFT, we proceed
        }

        // 4. Prepare Dispatch Data
        const recipientName = order.Shipment?.recipientName || order.Customer?.name || 'Customer';
        const recipientPhone = order.Shipment?.recipientPhone || order.customerPhone || order.Customer?.phone || '';
        const addressLine1 = order.Shipment?.addressLine1 || '';
        const addressCity = order.Shipment?.addressCity || '';

        // Kwik Validation
        if (settings.provider === 'KWIK') {
            if (!recipientPhone || !addressLine1) {
                return NextResponse.json({
                    error: "Missing recipient phone or address required for Kwik dispatch."
                }, { status: 400 });
            }
        }

        const dispatchData: DispatchData = {
            id: orderId,
            recipientName,
            recipientPhone,
            addressLine1,
            addressCity,
            parcelDescription: `Order #${order.orderNumber || order.refCode}`
        };

        // 5. Get Provider and Dispatch
        const provider = getDeliveryProvider(settings.provider);
        const result = await provider.dispatch(dispatchData, settings);

        if (!result.success) {
            // Log failure locally if needed?
            return NextResponse.json({ error: `Dispatch Failed: ${result.error}` }, { status: 502 });
        }

        // 6. Upsert Shipment (Using trackingCode and notes for compatibility)
        const shipment = await db.shipment.upsert({
            where: { orderId },
            create: {
                storeId,
                orderId,
                provider: settings.provider,
                status: 'REQUESTED',
                recipientName,
                recipientPhone,
                addressLine1,
                addressCity,

                trackingCode: result.providerJobId, // primary tracking ID
                trackingUrl: result.trackingUrl,
                notes: result.rawResponse ? JSON.stringify(result.rawResponse) : undefined
            },
            update: {
                provider: settings.provider,
                status: 'REQUESTED',
                trackingCode: result.providerJobId,
                trackingUrl: result.trackingUrl,
                notes: result.rawResponse ? JSON.stringify(result.rawResponse) : undefined
            }
        });

        // 7. Log Event (Safe Cast)
        try {
            if (db.deliveryEvent) {
                await db.deliveryEvent.create({
                    data: {
                        shipmentId: shipment.id,
                        status: 'REQUESTED',
                        note: `Dispatched via ${settings.provider} (Job: ${result.providerJobId})`,
                        providerStatus: 'REQUESTED'
                    }
                });
            }
        } catch (e) {
            console.warn('Failed to create delivery event log:', e);
            // Non-blocking
        }

        return NextResponse.json({ success: true, shipment });

    } catch (error: any) {
        console.error('Dispatch error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
