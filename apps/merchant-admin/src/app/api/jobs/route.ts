
import { NextResponse } from 'next/server';
import { prisma } from '@vayva/db';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function GET(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || !session.user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const storeId = (session.user as any).storeId;
        const { searchParams } = new URL(req.url);
        const query = searchParams.get('q') || '';

        const where: any = { storeId };
        if (query) {
            where.OR = [
                { jobName: { contains: query, mode: 'insensitive' } },
                { errorType: { contains: query, mode: 'insensitive' } }
            ];
        }

        const jobs = await (prisma as any).jobRun.findMany({
            where,
            orderBy: { startedAt: 'desc' },
            take: 20
        });

        return NextResponse.json({ jobs });
    } catch (error) {
        console.error('Job runs fetch error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
