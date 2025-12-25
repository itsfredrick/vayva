import { NextRequest, NextResponse } from 'next/server';
import { checkAdminAccess } from '@/lib/admin/auth';
import { prisma } from '@vayva/db';

export async function GET(req: NextRequest) {
    try {
        await checkAdminAccess();

        const { searchParams } = new URL(req.url);
        const q = searchParams.get('q') || '';

        const merchants = await prisma.store.findMany({
            where: {
                OR: [
                    { name: { contains: q, mode: 'insensitive' } },
                    { slug: { contains: q, mode: 'insensitive' } },
                    // { user: { email: { contains: q } } } // If relation clear
                ]
            },
            take: 20,
            include: {
                merchantSubscription: true
            },
            orderBy: { createdAt: 'desc' }
        });

        return NextResponse.json({ merchants });
    } catch (e: any) {
        return new NextResponse(e.message, { status: e.message.includes('Unauthorized') ? 403 : 500 });
    }
}
