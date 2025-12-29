
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { DeliveryService } from './DeliveryService'; // Ensure this path is correct
import { prisma } from '@vayva/db';

// Mock prisma
vi.mock('@vayva/db', () => ({
    prisma: {
        order: { findUnique: vi.fn() },
        shipment: { upsert: vi.fn().mockResolvedValue({ id: 'ship_123' }) },
        deliveryEvent: { create: vi.fn() },
        auditLog: { create: vi.fn().mockResolvedValue({ id: 'audit_123' }) }
    }
}));

// Mock DeliveryProvider factory
vi.mock('./DeliveryProvider', () => ({
    getDeliveryProvider: () => ({
        dispatch: vi.fn().mockResolvedValue({ success: true, providerJobId: 'JOB_123', trackingUrl: 'http://track.me' })
    })
}));

describe('DeliveryService', () => {
    const mockOrder = {
        id: 'ord_1',
        orderNumber: '#1001',
        storeId: 'store_1',
        customerPhone: '08012345678',
        store: {
            deliverySettings: {
                isEnabled: true,
                provider: 'CUSTOM',
                pickupName: 'Store',
                pickupPhone: '08000000000',
                pickupAddressLine1: 'Pickup St',
                autoDispatchEnabled: true,
                autoDispatchMode: 'CONFIRM',
                autoDispatchWhatsapp: true,
                autoDispatchStorefront: true
            }
        },
        Shipment: {
            status: 'DRAFT',
            recipientName: 'John Doe',
            recipientPhone: '08012345678',
            addressLine1: '123 Test St',
            addressCity: 'Test City',
            provider: 'CUSTOM'
        },
        Customer: { phone: '08012345678', name: 'John Doe', defaultAddressId: null }
    };

    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('should return SKIPPED if auto-dispatch is disabled', async () => {
        const order = { ...mockOrder, store: { deliverySettings: { ...mockOrder.store.deliverySettings, autoDispatchEnabled: false } } };
        (prisma.order.findUnique as any).mockResolvedValue(order);

        const result = await DeliveryService.autoDispatch('ord_1', 'storefront', 'key_1');
        expect(result.status).toBe('SKIPPED');
        expect(result.reason).toContain('Disabled globally');
    });

    it('should return BLOCKED if address is missing', async () => {
        // Ensure Shipment is null to trigger readiness failure
        const order = { ...mockOrder, customerPhone: null, Customer: null, Shipment: null };
        (prisma.order.findUnique as any).mockResolvedValue(order);

        const result = await DeliveryService.autoDispatch('ord_1', 'storefront', 'key_1');
        expect(result.status).toBe('BLOCKED');
        expect(result.reason).toContain('Readiness Failed');
    });

    it('should return PENDING_CONFIRMATION and create DRAFT shipment in CONFIRM mode', async () => {
        (prisma.order.findUnique as any).mockResolvedValue(mockOrder);

        const result = await DeliveryService.autoDispatch('ord_1', 'storefront', 'key_1');

        expect(result.status).toBe('PENDING_CONFIRMATION');
        expect(prisma.shipment.upsert).toHaveBeenCalledWith(expect.objectContaining({
            create: expect.objectContaining({ status: 'DRAFT' })
        }));
    });

    it('should return DISPATCHED and create REQUESTED shipment in AUTO mode', async () => {
        const order = {
            ...mockOrder,
            store: {
                deliverySettings: {
                    ...mockOrder.store.deliverySettings,
                    autoDispatchMode: 'AUTO',
                    provider: 'CUSTOM' // Ensure matches mock provider
                }
            },
            Shipment: {
                status: 'DRAFT',
                recipientName: 'John',
                recipientPhone: '080111',
                addressLine1: '123 St',
                addressCity: 'Lagos',
                provider: 'CUSTOM'
            }
        };
        (prisma.order.findUnique as any).mockResolvedValue(order);

        const result = await DeliveryService.autoDispatch('ord_1', 'storefront', 'key_1');

        if (result.status !== 'DISPATCHED') console.log('AUTO Mode Failed Reason:', result.reason);

        expect(result.status).toBe('DISPATCHED');
        expect(prisma.shipment.upsert).toHaveBeenCalledWith(expect.objectContaining({
            create: expect.objectContaining({ status: 'REQUESTED' })
        }));
    });
});
