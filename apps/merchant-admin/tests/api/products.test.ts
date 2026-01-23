import { describe, it, expect, vi, beforeEach } from 'vitest';
import { NextRequest, NextResponse } from 'next/server';
import { createMockRequest, mockAuthContext, getResponseJson } from '../helpers/api';
import { createMockProduct, createMockProducts } from '../factories';

// Mock the API handler wrapper
vi.mock('@/lib/api-handler', () => ({
    withVayvaAPI: (permission: unknown, handler: unknown) => handler,
    PERMISSIONS: {
        COMMERCE_VIEW: 'COMMERCE_VIEW',
        COMMERCE_MANAGE: 'COMMERCE_MANAGE',
    },
}));

// Mock Prisma
vi.mock('@/lib/prisma', () => ({
    prisma: {
        product: {
            findMany: vi.fn(),
            count: vi.fn(),
            create: vi.fn(),
            findUnique: vi.fn(),
            update: vi.fn(),
            delete: vi.fn(),
        },
    },
}));

// Mock audit logging
vi.mock('@/lib/audit', () => ({
    logAuditEvent: vi.fn(),
    AuditEventType: {
        PRODUCT_CREATED: 'PRODUCT_CREATED',
        PRODUCT_UPDATED: 'PRODUCT_UPDATED',
        PRODUCT_DELETED: 'PRODUCT_DELETED',
    },
}));

// Mock input sanitization
vi.mock('@/lib/input-sanitization', () => ({
    sanitizeText: (text: string) => text?.trim() || '',
    sanitizeHtml: (html: string) => html?.replace(/<script[^>]*>.*?<\/script>/gi, '') || '',
    sanitizeNumber: (num: unknown, options?: unknown) => {
        const parsed = typeof num === 'string' ? parseFloat(num) : num;
        if (isNaN(parsed)) return null;
        if (options?.min !== undefined && parsed < options.min) return null;
        if (options?.max !== undefined && parsed > options.max) return null;
        return parsed;
    },
    sanitizeUrl: (url: string) => {
        if (!url || url.startsWith('javascript:')) return null;
        return url;
    },
}));

// Import after mocks
import { GET, POST } from '@/app/api/products/items/route';
import { prisma } from '@/lib/prisma';

describe('Products API - /api/products/items', () => {
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

    describe('GET /api/products/items', () => {
        it('should return paginated products with default params', async () => {
            const mockProducts = createMockProducts(2);

            (prisma.product.findMany as any).mockResolvedValue(mockProducts);
            (prisma.product.count as any).mockResolvedValue(2);

            const request = createMockRequest('GET', '/api/products/items');
            const response = await GET(request, mockContext);
            const data = await getResponseJson(response);

            expect(response.status).toBe(200);
            expect(data.data).toBeDefined();
            expect(data.meta.total).toBe(2);
        });

        it('should filter products by status', async () => {
            const request = createMockRequest('GET', '/api/products/items', {
                searchParams: { status: 'ACTIVE' },
            });

            (prisma.product.findMany as any).mockResolvedValue([]);
            (prisma.product.count as any).mockResolvedValue(0);

            await GET(request, mockContext);

            expect(prisma.product.findMany).toHaveBeenCalledWith(
                expect.objectContaining({
                    where: expect.objectContaining({
                        storeId: mockStoreId,
                        status: 'ACTIVE',
                    }),
                })
            );
        });

        it('should respect pagination params', async () => {
            const request = createMockRequest('GET', '/api/products/items', {
                searchParams: { limit: '10', offset: '20' },
            });

            (prisma.product.findMany as any).mockResolvedValue([]);
            (prisma.product.count as any).mockResolvedValue(0);

            await GET(request, mockContext);

            expect(prisma.product.findMany).toHaveBeenCalledWith(
                expect.objectContaining({
                    take: 10,
                    skip: 20,
                })
            );
        });

        it('should handle database errors gracefully', async () => {
            (prisma.product.findMany as any).mockRejectedValue(new Error('Database error'));

            const request = createMockRequest('GET', '/api/products/items');
            const response = await GET(request, mockContext);

            expect(response.status).toBe(500);
            const data = await getResponseJson(response);
            expect(data.error).toBeDefined();
        });
    });

    describe('POST /api/products/items', () => {
        it('should create a new product with valid data', async () => {
            const newProduct = createMockProduct({
                title: 'New Test Product',
                price: 2500,
            });

            (prisma.product.create as any).mockResolvedValue(newProduct);

            const request = createMockRequest('POST', '/api/products/items', {
                body: {
                    title: 'New Test Product',
                    description: 'A new product description',
                    price: 2500,
                    status: 'DRAFT',
                },
            });

            const response = await POST(request, mockContext);

            expect(response.status).toBe(200);
            expect(prisma.product.create).toHaveBeenCalled();
        });

        it('should validate required fields (title)', async () => {
            const request = createMockRequest('POST', '/api/products/items', {
                body: {
                    price: 1000,
                    // Missing title
                },
            });

            const response = await POST(request, mockContext);

            expect(response.status).toBe(400);
            const data = await getResponseJson(response);
            expect(data.error).toContain('title');
        });

        it('should validate required fields (price)', async () => {
            const request = createMockRequest('POST', '/api/products/items', {
                body: {
                    title: 'Test Product',
                    // Missing price
                },
            });

            const response = await POST(request, mockContext);

            expect(response.status).toBe(400);
            const data = await getResponseJson(response);
            expect(data.error).toContain('price');
        });

        it('should handle database errors during creation', async () => {
            (prisma.product.create as any).mockRejectedValue(new Error('Database error'));

            const request = createMockRequest('POST', '/api/products/items', {
                body: {
                    title: 'Test Product',
                    price: 1000,
                },
            });

            const response = await POST(request, mockContext);

            expect(response.status).toBe(500);
        });
    });
});
