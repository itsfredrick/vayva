import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { getReachableAudience } from '@/lib/consent/analytics';

enum MessageIntent {
    MARKETING = 'MARKETING',
    TRANSACTIONAL = 'TRANSACTIONAL'
}

export async function GET(req: NextRequest) {
    const session = await getServerSession(authOptions);
    if (!(session?.user as any)?.storeId) {
        return new NextResponse('Unauthorized', { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const type = searchParams.get('type');

    if (type !== 'marketing' && type !== 'transactional') {
        return new NextResponse('Invalid type', { status: 400 });
    }

    const intent = type === 'marketing' ? MessageIntent.MARKETING : MessageIntent.TRANSACTIONAL;
    const audience = await getReachableAudience((session!.user as any).storeId, intent as any);

    return NextResponse.json(audience);
}
