import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth'; // Adjust import if needed
import { computeMerchantReadiness } from '@/lib/ops/computeReadiness';
import { prisma } from '@vayva/db';
import { v4 as uuidv4 } from 'uuid';

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const merchantId = searchParams.get('merchant_id');

    if (!merchantId) return new NextResponse('Missing merchant_id', { status: 400 });

    try {
        const store = await prisma.store.findUnique({
            where: { id: merchantId },
            include: { merchantPolicies: true }
        });

        if (!store) return new NextResponse('Store not found', { status: 404 });

        const readiness = await computeMerchantReadiness(merchantId);
        const correlationId = uuidv4();

        const snapshot = {
            merchant: {
                id: merchantId,
                plan: 'growth',
                createdAt: store.createdAt
            },
            store: {
                name: store.name,
                slug: store.slug,
                readinessLevel: readiness.level
            },
            readiness,
            policies: {
                policiesPublished: store.merchantPolicies.filter((p: any) => p.isPublished).length,
                policiesTotal: store.merchantPolicies.length,
                types: store.merchantPolicies.map((p: any) => p.type)
            },
            meta: {
                correlationId,
                generatedAt: new Date().toISOString()
            }
        };

        return NextResponse.json(snapshot);

    } catch (e: any) {
        return new NextResponse(e.message, { status: 500 });
    }
}
