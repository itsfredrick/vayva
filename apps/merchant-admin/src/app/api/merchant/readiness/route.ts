import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { computeMerchantReadiness } from '@/lib/ops/computeReadiness';

export async function GET(req: NextRequest) {
    const session = await getServerSession(authOptions);
    if (!(session?.user as any)?.storeId) return new NextResponse('Unauthorized', { status: 401 });

    try {
        const readiness = await computeMerchantReadiness((session!.user as any).storeId);
        return NextResponse.json(readiness);
    } catch (e: any) {
        return new NextResponse(e.message, { status: 500 });
    }
}
