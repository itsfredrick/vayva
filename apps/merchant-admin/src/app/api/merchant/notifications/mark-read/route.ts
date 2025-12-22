import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@vayva/db';

export async function POST(req: NextRequest) {
    const session = await getServerSession(authOptions);
    if (!(session?.user as any)?.storeId) {
        return new NextResponse('Unauthorized', { status: 401 });
    }

    const body = await req.json();
    const { ids, mark_all } = body;

    if (mark_all) {
        await prisma.notification.updateMany({
            where: {
                storeId: (session!.user as any).storeId,
                isRead: false
            },
            data: {
                isRead: true,
                readAt: new Date()
            }
        });
    } else if (ids && Array.isArray(ids) && ids.length > 0) {
        await prisma.notification.updateMany({
            where: {
                storeId: (session!.user as any).storeId,
                id: { in: ids },
                isRead: false
            },
            data: {
                isRead: true,
                readAt: new Date()
            }
        });
    }

    const unreadCount = await prisma.notification.count({
        where: {
            storeId: (session!.user as any).storeId,
            isRead: false
        }
    });

    return NextResponse.json({ ok: true, unread_count: unreadCount });
}
