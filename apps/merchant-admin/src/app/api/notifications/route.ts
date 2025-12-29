import { NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth/session';
import { prisma } from '@vayva/db';

export async function GET() {
    try {
        const session = await requireAuth();
        const storeId = session.user.storeId;

        const notifications = await prisma.notification.findMany({
            where: { storeId },
            orderBy: { createdAt: 'desc' },
            take: 20
        });

        // Map to UI format
        const formatted = notifications.map(n => ({
            id: n.id,
            type: n.type.toLowerCase(), // Ensure lowercase for UI mapping (ORDER -> order)
            title: n.title,
            time: new Date(n.createdAt).toLocaleDateString(), // Simplification
            unread: !n.readAt
        }));

        return NextResponse.json(formatted);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch notifications' }, { status: 500 });
    }
}
