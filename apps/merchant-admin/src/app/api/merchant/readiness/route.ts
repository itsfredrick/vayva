import { NextRequest, NextResponse } from 'next/server';
import { getSessionUser } from '@/lib/session';
import { computeMerchantReadiness } from '@/lib/ops/computeReadiness';

export async function GET(req: NextRequest) {
    const user = await getSessionUser();
    if (!user?.storeId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    try {
        const readiness = await computeMerchantReadiness(user.storeId);
        return NextResponse.json(readiness);
    } catch (e: any) {
        return new NextResponse(e.message, { status: 500 });
    }
}
