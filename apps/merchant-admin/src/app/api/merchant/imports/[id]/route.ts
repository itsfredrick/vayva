import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@vayva/db';

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
    const session = await getServerSession(authOptions);
    if (!session?.user) return new NextResponse('Unauthorized', { status: 401 });

    const { id } = params;

    const job = await prisma.importJob.findUnique({ where: { id } });
    if (!job || job.merchantId !== (session!.user as any).storeId) return new NextResponse('Forbidden', { status: 403 });

    return NextResponse.json(job);
}
