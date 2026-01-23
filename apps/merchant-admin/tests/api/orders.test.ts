import { describe, it, expect, vi, beforeEach } from 'vitest';
import { NextRequest, NextResponse } from 'next/server';
import { createMockRequest, mockAuthContext, getResponseJson } from '../helpers/api';
import { createMockOrder, createMockOrders } from '../factories';

// Mock the API handler wrapper
vi.mock('@/lib/api-handler', () => ({
    withVayvaAPI: (permission: unknown, handler: unknown) => handler,
    PERMISSIONS: {
        ORDERS_VIEW: 'ORDERS_VIEW',
        ORDERS_MANAGE: 'ORDERS_MANAGE',
    },
}));

// Mock Prisma with $transaction support
vi.mock('@vayva/db', () => ({
    prisma: {
        order: {
            findMany: vi.fn(),
            count: vi.fn(),
            create: vi.fn(),
            findUnique: vi.fn(),
            update: vi.fn(),
            findFirst: vi.fn(),
        },
        $transaction: vi.fn(),
    },
}));

// Import after mocks
import { GET, POST } from '@/app/api/orders/route';
import { prisma } from '@vayva/db';

describe('Orders API - /api/orders', () => {
    const mockStoreId = 'store_test_123';
    const mockUserId = 'user_test_123';
    const mockContext = {
        storeId: mockStoreId,
        userId: mockUserId,
        user: { id: mockUserId, email: 'test@example.com' },
    };

    beforeEach(() => {
        vi.clearAllMocks();
    });

    describe('GET /api/orders', () => {
        it('should return paginated orders with default params', async () => {
            const mockOrders = createMockOrders(2);

            (prisma.order.findMany as any).mockResolvedValue(mockOrders);
            (prisma.order.count as any).mockResolvedValue(2);

            const request = createMockRequest('GET', '/api/orders');
            const response = await GET(request, mockContext);
            const data = await getResponseJson(response);

            expect(response.status).toBe(200);
            expect(data.data).toBeDefined();
            expect(data.meta.total).toBe(2);
        });

        it('should filter orders by status', async () => {
            const request = createMockRequest('GET', '/api/orders', {
                searchParams: { status: 'PENDING' },
            });

            (prisma.order.findMany as any).mockResolvedValue([]);
            (prisma.order.count as any).mockResolvedValue(0);

            await GET(request, mockContext);

            expect(prisma.order.findMany).toHaveBeenCalledWith(
                expect.objectContaining({
                    where: expect.objectContaining({
                        storeId: mockStoreId,
                        status: 'PENDING',
                    }),
                })
            );
        });

        it('should filter orders by payment status', async () => {
            const request = createMockRequest('GET', '/api/orders', {
                searchParams: { paymentStatus: 'PAID' },
            });

            (prisma.order.findMany as any).mockResolvedValue([]);
            (prisma.order.count as any).mockResolvedValue(0);

            await GET(request, mockContext);

            expect(prisma.order.findMany).toHaveBeenCalledWith(
                expect.objectContaining({
                    where: expect.objectContaining({
                        paymentStatus: 'PAID',
                    }),
                })
            );
        });

        it('should search orders by query', async () => {
            const request = createMockRequest('GET', '/api/orders', {
                searchParams: { q: 'ORD-001' },
            });

            (prisma.order.findMany as any).mockResolvedValue([]);
            (prisma.order.count as any).mockResolvedValue(0);

            await GET(request, mockContext);

            expect(prisma.order.findMany).toHaveBeenCalledWith(
                expect.objectContaining({
                    where: expect.objectContaining({
                        OR: expect.any(Array),
                    }),
                })
            );
        });

        it('should respect pagination limits', async () => {
            const request = createMockRequest('GET', '/api/orders', {
                searchParams: { limit: '200', offset: '10' },
            });

            (prisma.order.findMany as any).mockResolvedValue([]);
            (prisma.order.count as any).mockResolvedValue(0);

            await GET(request, mockContext);

            expect(prisma.order.findMany).toHaveBeenCalledWith(
                expect.objectContaining({
                    take: 100, // Should be capped at 100
                    skip: 10,
                })
            );
        });

        it('should handle database errors gracefully', async () => {
            (prisma.order.findMany as any).mockRejectedValue(new Error('Database error'));

            const request = createMockRequest('GET', '/api/orders');
            const response = await GET(request, mockContext);

            expect(response.status).toBe(500);
            const data = await getResponseJson(response);
            expect(data.error).toBeDefined();
        });
    });

    describe('POST /api/orders', () => {
        // Note: POST order creation uses complex Prisma transactions with $queryRaw
        // which requires deep mocking of transaction context. Skipping for now.
        // This should be tested via integration tests with a real database.

        it('should handle database errors during creation', async () => {
            (prisma.$transaction as any).mockRejectedValue(new Error('Database error'));

            const request = createMockRequest('POST', '/api/orders', {
                body: {
                    customerEmail: 'customer@example.com',
                    items: [],
                    total: 1000,
                },
            });

            const response = await POST(request, mockContext);

            expect(response.status).toBe(500);
        });
    });
});
