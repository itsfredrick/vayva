
import { NextResponse } from 'next/server';
import { prisma } from '@vayva/db';
import { OpsAuthService } from '@/lib/ops-auth';

export async function GET(request: Request) {
    const session = await OpsAuthService.getSession();
    if (!session) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const query = searchParams.get('query') || '';
    const status = searchParams.get('status');

    try {
        const merchants = await prisma.store.findMany({
            where: {
                OR: [
                    { name: { contains: query, mode: 'insensitive' } },
                    { slug: { contains: query, mode: 'insensitive' } },
                ],
                // Add status filter if needed
            },
            include: {
                kycRecord: true,
                merchantSubscription: true
            },
            orderBy: { createdAt: 'desc' },
            take: 50
        });

        const formatted = merchants.map((m: any) => ({
            id: m.id,
            name: m.name,
            slug: m.slug,
            ownerEmail: 'Unknown', // Placeholder, field missing in Store model
            plan: m.merchantSubscription?.plan || 'FREE',
            kycStatus: m.kycRecord?.status || 'PENDING',
            createdAt: m.createdAt,
            lastActive: m.updatedAt // Placeholder
        }));

        return NextResponse.json(formatted);
    } catch (err) {
        console.error(err);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
