import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@vayva/db';

export async function GET(req: NextRequest) {
    const session = await getServerSession(authOptions);
    if (!(session?.user as any)?.storeId) {
        return new NextResponse('Unauthorized', { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const status = searchParams.get('status') || 'unread'; // 'unread' | 'all'
    const limit = Math.min(parseInt(searchParams.get('limit') || '50'), 100);
    const cursor = searchParams.get('cursor');

    const where: any = {
        storeId: (session!.user as any).storeId
    };

    if (status === 'unread') {
        where.isRead = false;
    }

    const notifications = await prisma.notification.findMany({
        where,
        take: limit + 1, // Get one extra for next cursor
        cursor: cursor ? { id: cursor } : undefined,
        orderBy: [
            { createdAt: 'desc' },
            { id: 'desc' }
        ]
    });

    let nextCursor = null;
    if (notifications.length > limit) {
        const nextItem = notifications.pop();
        nextCursor = nextItem?.id;
    }

    const unreadCount = await prisma.notification.count({
        where: {
            storeId: (session!.user as any).storeId,
            isRead: false
        }
    });

    return NextResponse.json({
        items: notifications,
        next_cursor: nextCursor,
        unread_count: unreadCount
    });
}
