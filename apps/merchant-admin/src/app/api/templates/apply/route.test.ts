
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { POST } from './route';
import { getServerSession } from 'next-auth';
import { prisma } from '@vayva/db';
import { NextResponse } from 'next/server';

// Mocks
vi.mock('next-auth');
vi.mock('@vayva/db', () => ({
    prisma: {
        store: {
            findUnique: vi.fn(),
            update: vi.fn(),
        },
    },
}));
vi.mock('@/lib/auth', () => ({ authOptions: {} }));

const createRequest = (body: any) =>
    new Request('http://localhost:3000/api/templates/apply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
    });

describe('POST /api/templates/apply (Standardized)', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('returns 401 if not authenticated', async () => {
        (getServerSession as any).mockResolvedValue(null);

        const req = createRequest({ templateId: 'vayva-standard' });
        const res = await POST(req);

        expect(res.status).toBe(401);
    });

    it('returns 403 if Free user tries to apply Growth template', async () => {
        (getServerSession as any).mockResolvedValue({ user: { id: 'u1', storeId: 's1', role: 'OWNER' } });
        (prisma.store.findUnique as any).mockResolvedValue({
            id: 's1',
            plan: 'free',
            billingProfile: null,
            settings: {}
        });

        // Bookly is Growth now
        const req = createRequest({ templateId: 'vayva-bookly-pro' });
        const res = await POST(req);

        expect(res.status).toBe(403);
        const json = await res.json();
        expect(json.error).toBe('TEMPLATE_LOCKED');
        expect(json.requiredPlan).toBe('growth');
        expect(json.currentPlan).toBe('free');
    });

    it('returns 403 if Growth user tries to apply Pro template', async () => {
        (getServerSession as any).mockResolvedValue({ user: { id: 'u2', storeId: 's2', role: 'OWNER' } });
        (prisma.store.findUnique as any).mockResolvedValue({
            id: 's2',
            plan: 'growth',
            billingProfile: { plan: 'growth' },
            settings: {}
        });

        // BulkTrade is Pro
        const req = createRequest({ templateId: 'vayva-bulktrade' });
        const res = await POST(req);

        expect(res.status).toBe(403);
        const json = await res.json();
        expect(json.requiredPlan).toBe('pro');
        expect(json.currentPlan).toBe('growth');
    });

    it('returns 200 if Growth user applies Growth template', async () => {
        (getServerSession as any).mockResolvedValue({ user: { id: 'u3', storeId: 's3', role: 'OWNER' } });
        (prisma.store.findUnique as any).mockResolvedValue({
            id: 's3',
            plan: 'growth',
            billingProfile: { plan: 'growth' },
            settings: {}
        });

        const req = createRequest({ templateId: 'vayva-bookly-pro' });
        const res = await POST(req);

        expect(res.status).toBe(200);
        expect(prisma.store.update).toHaveBeenCalled();
    });

    it('returns 200 if Pro user applies Pro template', async () => {
        (getServerSession as any).mockResolvedValue({ user: { id: 'u4', storeId: 's4', role: 'OWNER' } });
        // Old 'enterprise' maps to 'pro'
        (prisma.store.findUnique as any).mockResolvedValue({
            id: 's4',
            plan: 'enterprise',
            billingProfile: { plan: 'enterprise' },
            settings: {}
        });

        const req = createRequest({ templateId: 'vayva-markethub' }); // Pro
        const res = await POST(req);

        expect(res.status).toBe(200);
    });
});
