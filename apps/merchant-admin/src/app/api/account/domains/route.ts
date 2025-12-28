
import { NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth/session';
import { prisma } from '@vayva/db';

export async function GET() {
    try {
        const session = await requireAuth();
        const storeId = session.user.storeId;

        // Fetch custom domains
        const domainMapping = await prisma.domainMapping.findFirst({
            where: { storeId },
        });

        // Fetch subdomain from store slug
        const store = await prisma.store.findUnique({
            where: { id: storeId },
            select: { slug: true }
        });

        return NextResponse.json({
            id: domainMapping?.id || null,
            subdomain: store?.slug ? `${store.slug}.vayva.ng` : null,
            customDomain: domainMapping?.domain || null,
            status: domainMapping?.status || 'none',
            verificationToken: domainMapping?.verificationToken || null,
            lastCheckedAt: (domainMapping?.provider as any)?.lastCheckedAt || null,
            lastError: (domainMapping?.provider as any)?.lastError || null,
            sslEnabled: domainMapping?.status === 'verified',
        });
    } catch (error: any) {
        console.error('Domains fetch error:', error);
        return NextResponse.json({ error: 'Failed to fetch domain details' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const { checkFeatureAccess } = await import('@/lib/auth/gating');
        const access = await checkFeatureAccess('custom_domain');
        if (!access.allowed) {
            return NextResponse.json({
                error: access.reason,
                requiredAction: access.requiredAction
            }, { status: 403 });
        }

        const session = await requireAuth();
        const storeId = session.user.storeId;
        const body = await request.json();
        const { domain } = body;

        if (!domain) return NextResponse.json({ error: 'Domain is required' }, { status: 400 });

        // Check if already mapped
        const existing = await prisma.domainMapping.findFirst({
            where: { domain }
        });

        if (existing) {
            return NextResponse.json({ error: 'Domain is already connected to another store.' }, { status: 409 });
        }

        // Create mapping
        const mapping = await prisma.domainMapping.create({
            data: {
                storeId,
                domain,
                status: 'pending',
                verificationToken: `vey_${Math.random().toString(36).substring(2, 15)}`, // Mock token generation
                provider: {
                    provider: 'manual', // or vercel
                    lastCheckedAt: null
                }
            }
        });

        return NextResponse.json(mapping);

    } catch (error: any) {
        console.error('Add domain error:', error);
        return NextResponse.json({ error: 'Failed to add domain' }, { status: 500 });
    }
}
