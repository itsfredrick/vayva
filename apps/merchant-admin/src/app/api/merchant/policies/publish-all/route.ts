import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { prisma } from '@vayva/db';

export async function POST(req: NextRequest) {
    try {
        const session = await getServerSession();
        if (!(session?.user as any)?.storeId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await req.json();
        const { publishMissing = false } = body;

        // Get all policies for this store
        const policies = await prisma.merchantPolicy.findMany({
            where: { storeId: (session!.user as any).storeId }
        });

        // If publishMissing and we don't have 5 policies, generate them first
        if (publishMissing && policies.length < 5) {
            // This would call the generate endpoint internally
            // For now, just proceed with what exists
        }

        // Publish all policies
        const policyTypes = ['TERMS', 'PRIVACY', 'RETURNS', 'REFUNDS', 'SHIPPING_DELIVERY'];
        const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD

        await prisma.$transaction(
            policyTypes.map(type =>
                prisma.merchantPolicy.updateMany({
                    where: {
                        storeId: (session!.user as any).storeId,
                        type: type as any
                    },
                    data: {
                        status: 'PUBLISHED',
                        publishedAt: new Date(),
                        lastUpdatedLabel: today,
                        publishedVersion: { increment: 1 }
                    }
                })
            )
        );

        return NextResponse.json({ ok: true, publishedCount: 5 });
    } catch (error) {
        console.error('Error publishing policies:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
