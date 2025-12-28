
import { NextResponse } from 'next/server';
import { prisma } from '@vayva/db';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { logAudit } from '@/lib/audit';
import { checkRateLimit } from '@/lib/rate-limit';

export async function GET() {
    try {
        const session = await getServerSession(authOptions);
        if (!session || !session.user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const storeId = (session.user as any).storeId;

        const jobs = await (prisma as any).exportJob.findMany({
            where: { storeId },
            orderBy: { createdAt: 'desc' },
            take: 10
        });

        return NextResponse.json({ jobs });
    } catch (error) {
        console.error('Export jobs fetch error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || !session.user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const storeId = (session.user as any).storeId;
        const userId = session.user.id;

        // Rate Limit: 3 per hour
        await checkRateLimit(userId, 'export_request', 3, 3600, storeId);

        const body = await req.json();
        const { type } = body;

        if (!type) {
            return NextResponse.json({ error: 'Missing export type' }, { status: 400 });
        }

        const job = await (prisma as any).exportJob.create({
            data: {
                storeId,
                type,
                status: 'PENDING',
                expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days
            }
        });

        await logAudit({
            storeId,
            actor: { type: 'USER', id: userId, label: session.user.email || 'Merchant' },
            action: 'EXPORT_GENERATED',
            entity: { type: 'ExportJob', id: job.id },
            after: { type }
        });

        return NextResponse.json({ job });
    } catch (error) {
        console.error('Export request error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
