
import { prisma } from '@vayva/db';
// @ts-ignore
import { StoreDeliverySettings, Order, Shipment, Customer } from '@prisma/client';
import { getDeliveryProvider, DispatchData } from './DeliveryProvider';

// Helper to bypass strict typing issues with generated client temporarily
const db = prisma as any;

interface AutoDispatchResult {
    success: boolean;
    status: 'DISPATCHED' | 'PENDING_CONFIRMATION' | 'BLOCKED' | 'SKIPPED';
    reason?: string;
    shipment?: Shipment;
}


export type DeliveryReadiness =
    | 'READY'
    | 'NOT_READY_ADDRESS_MISSING'
    | 'NOT_READY_PICKUP_MISSING'
    | 'NOT_READY_PROVIDER_MISSING'
    | 'DISABLED';

export class DeliveryService {

    /**
     * Checks if an order is ready for delivery dispatch based on settings and data.
     */
    static checkReadiness(
        order: Order & { Shipment?: Shipment | null, Customer?: Customer | null },
        settings: StoreDeliverySettings
    ): { status: DeliveryReadiness, blockers: string[] } {
        const blockers: string[] = [];

        if (!settings.isEnabled) {
            return { status: 'DISABLED', blockers: ['Delivery Disabled'] };
        }

        if (!settings.pickupAddressLine1) {
            blockers.push('Store Pickup Address Missing');
        }

        if (settings.provider === 'KWIK' && !process.env.KWIK_API_KEY) {
            blockers.push('Kwik API Key Not Configured');
        }

        // Check Order Address Presence (Naive check for now)
        // We look at Shipment snapshot first, then Order/Customer fallback
        const hasAddress =
            (order.Shipment?.addressLine1) ||
            (order.Customer?.defaultAddressId) || // Weak check, but assume address exists if ID exists? Better to check fields if visible.
            (order as any).shippingAddress || // Future proofing
            ((order.Customer?.phone || order.customerPhone) && (order.Customer?.lastName)); // Bare minimum?

        // Actually, let's be strict. We need AT LEAST a phone and a line 1.
        // Since we don't have strictly typed Address object on Order yet (Stage 1.2 note), 
        // we check the best available sources.

        const recipientPhone = order.Shipment?.recipientPhone || order.customerPhone || order.Customer?.phone;
        const addressLine1 = order.Shipment?.addressLine1; // If shipment doesn't exist, we rely on having created it or Order having address fields.

        // If no shipment exists yet, we can't be sure of address unless it's on Order.
        // For Stage 3, we assume triggers might create the shipment or Order has fields.
        // Let's assume for readiness we need EITHER an existing Shipment with address OR we can derive it.

        if (!recipientPhone) blockers.push('Recipient Phone Missing');

        // If we don't have a shipment, and we don't have address fields on Order (which we don't in schema yet explicitly except via relations),
        // we might rely on 'deliveryReady' flag or similar. 
        // For this implementation, we will assume if Shipment is missing, we are NOT ready, 
        // UNLESS it comes from a channel that guarantees address (like Storefront).

        if (!addressLine1 && !blockers.includes('Recipient Phone Missing')) { // Don't double report if we are just missing everything
            // Relaxed check: Custom courier might not need it? No, we said "Never dispatch without address".
            blockers.push('Delivery Address Missing');
        }

        if (blockers.length > 0) {
            if (blockers.includes('Store Pickup Address Missing')) return { status: 'NOT_READY_PICKUP_MISSING', blockers };
            if (blockers.includes('Kwik API Key Not Configured')) return { status: 'NOT_READY_PROVIDER_MISSING', blockers };
            return { status: 'NOT_READY_ADDRESS_MISSING', blockers };
        }

        return { status: 'READY', blockers: [] };
    }

    /**
     * Attempt to Auto-Dispatch an order.
     * Enforces Idempotency and Settings.
     */
    static async autoDispatch(
        orderId: string,
        channel: 'whatsapp' | 'storefront',
        idempotencyKey: string
    ): Promise<AutoDispatchResult> {
        console.log(`[AutoDispatch] Attempting for Order ${orderId} via ${channel}`);

        // 1. Fetch Context
        const order = await db.order.findUnique({
            where: { id: orderId },
            include: { Shipment: true, Customer: true, store: { include: { deliverySettings: true } } }
        });

        if (!order || !order.store.deliverySettings) {
            return { success: false, status: 'SKIPPED', reason: 'Order or Settings not found' };
        }

        const settings = order.store.deliverySettings;

        // 2. Check Global Auto-Dispatch Enablement
        if (!settings.autoDispatchEnabled) {
            return { success: false, status: 'SKIPPED', reason: 'Auto-Dispatch Disabled globally' };
        }

        // 3. Check Channel Enablement
        if (channel === 'whatsapp' && !settings.autoDispatchWhatsapp) {
            return { success: false, status: 'SKIPPED', reason: 'Auto-Dispatch Disabled for WhatsApp' };
        }
        if (channel === 'storefront' && !settings.autoDispatchStorefront) {
            return { success: false, status: 'SKIPPED', reason: 'Auto-Dispatch Disabled for Storefront' };
        }

        // 4. Idempotency Check (Check if Shipment already exists and is not DRAFT/CREATED by this process)
        // If shipment exists and is > REQUESTED, we skip.
        if (order.Shipment && ['REQUESTED', 'ACCEPTED', 'PICKED_UP', 'IN_TRANSIT', 'DELIVERED'].includes(order.Shipment.status)) {
            return { success: true, status: 'SKIPPED', reason: 'Already Dispatched', shipment: order.Shipment };
        }

        // 5. Readiness Check
        const readiness = this.checkReadiness(order, settings);
        if (readiness.status !== 'READY') {
            // Create blockers note or log?
            return { success: false, status: 'BLOCKED', reason: `Readiness Failed: ${readiness.blockers.join(', ')}` };
        }

        // 6. Mode Check
        if (settings.autoDispatchMode === 'CONFIRM') {
            // "Pending Confirmation" flow. 
            // Create DRAFT shipment to signal "Pending Confirmation" state
            await db.shipment.upsert({
                where: { orderId: order.id },
                create: {
                    storeId: order.storeId,
                    orderId: order.id,
                    provider: settings.provider,
                    status: 'DRAFT',
                    recipientName: order.Shipment?.recipientName || order.Customer?.name || 'Customer',
                    recipientPhone: order.Shipment?.recipientPhone || order.customerPhone || order.Customer?.phone || '',
                    addressLine1: order.Shipment?.addressLine1 || '',
                    addressCity: order.Shipment?.addressCity || '',
                },
                update: {
                    // If exists, ensure it's at least visible, but don't overwrite user edits if any?
                    // Safe to just ensure it exists.
                }
            });

            try {
                const { logAudit } = await import('@/lib/audit');
                await logAudit({
                    storeId: order.storeId,
                    actor: { type: 'SYSTEM', id: 'auto_dispatch', label: 'AutoDispatch' },
                    action: 'DELIVERY_AUTO_DISPATCH_PENDING',
                    entity: { type: 'ORDER', id: order.id },
                    after: { mode: 'CONFIRM', channel }
                });
            } catch (ignore) { }

            return { success: true, status: 'PENDING_CONFIRMATION', reason: 'Awaiting Admin Confirmation' };
        }

        // 7. EXECUTE DISPATCH (AUTO MODE)
        // Using the API logic? Or calling Provider directly?
        // Better to reuse the route logic or extract it?
        // Extracting logic:

        const provider = getDeliveryProvider(settings.provider);

        const dispatchData: DispatchData = {
            id: order.id,
            recipientName: order.Shipment?.recipientName || order.Customer?.name || 'Customer',
            recipientPhone: order.Shipment?.recipientPhone || order.customerPhone || order.Customer?.phone || '',
            addressLine1: order.Shipment?.addressLine1 || '', // We verified readiness, but actual value might need derivation
            addressCity: order.Shipment?.addressCity || '',
            parcelDescription: `Order #${order.orderNumber}`
        };

        // Re-verify address existence for strict type safety
        if (!dispatchData.addressLine1 || !dispatchData.recipientPhone) {
            return { success: false, status: 'BLOCKED', reason: 'Address/Phone missing at dispatch time' };
        }

        try {
            const result = await provider.dispatch(dispatchData, settings);

            if (!result.success) {
                // Log failure but don't crash
                // Upsert shipment as FAILED or DRAFT with error?
                /* await prisma.shipment.upsert({ ... status: 'FAILED' ... }) */
                return { success: false, status: 'BLOCKED', reason: `Provider Error: ${result.error}` };
            }

            // Success! Upsert Shipment
            const shipment = await db.shipment.upsert({
                where: { orderId: order.id },
                create: {
                    storeId: order.storeId,
                    orderId: order.id,
                    provider: settings.provider,
                    status: 'REQUESTED',
                    recipientPhone: dispatchData.recipientPhone,
                    addressLine1: dispatchData.addressLine1,
                    addressCity: dispatchData.addressCity,
                    trackingCode: result.providerJobId, // Using trackingCode as primary ID
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

            try {
                const { logAudit, AuditAction } = await import('@/lib/audit');
                await logAudit({
                    storeId: order.storeId,
                    actor: { type: 'SYSTEM', id: 'auto_dispatch', label: 'AutoDispatch' },
                    action: 'DELIVERY_AUTO_DISPATCH_ATTEMPTED',
                    entity: { type: 'SHIPMENT', id: shipment.id },
                    after: {
                        channel,
                        status: 'REQUESTED',
                        mode: settings.autoDispatchMode,
                        trackingUrl: result.trackingUrl
                    }
                });
            } catch (ignore) { /* non-blocking */ }

            return { success: true, status: 'DISPATCHED', shipment };

        } catch (error: any) {
            return { success: false, status: 'BLOCKED', reason: error.message };
        }
    }
}
