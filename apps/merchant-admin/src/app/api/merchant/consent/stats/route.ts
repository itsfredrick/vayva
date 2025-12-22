import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { getConsentStats } from '@/lib/consent/analytics';

export async function GET(req: NextRequest) {
    const session = await getServerSession(authOptions);
    if (!(session?.user as any)?.storeId) {
        return new NextResponse('Unauthorized', { status: 401 });
    }

    const stats = await getConsentStats((session!.user as any).storeId);
    return NextResponse.json(stats);
}
