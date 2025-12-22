import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@vayva/db';

export async function POST(req: NextRequest) {
    const session = await getServerSession(authOptions);
    if (!(session?.user as any)?.storeId) return new NextResponse('Unauthorized', { status: 401 });

    try {
        await prisma.merchantSubscription.update({
            where: { storeId: (session!.user as any).storeId },
            data: { cancelAtPeriodEnd: true }
        });

        // Log Audit
        // ...

        return NextResponse.json({ ok: true });
    } catch (e: any) {
        return new NextResponse(e.message, { status: 500 });
    }
}
