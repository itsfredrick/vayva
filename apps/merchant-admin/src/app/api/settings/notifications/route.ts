
import { NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth/session';
import { prisma } from '@vayva/db';

export async function GET() {
    try {
        const session = await requireAuth();
        const storeId = session.user.storeId;

        const preference = await prisma.notificationPreference.findUnique({
            where: { storeId }
        });

        const categories = (preference?.categories as Record<string, boolean>) || {
            orders: true,
            system: true,
            account: true,
            payments: true
        };

        return NextResponse.json(categories);
    } catch (error: any) {
        console.error('Notification preferences fetch error:', error);
        return NextResponse.json({ error: 'Failed to fetch preferences' }, { status: 500 });
    }
}

export async function PATCH(req: Request) {
    try {
        const session = await requireAuth();
        const storeId = session.user.storeId;
        const body = await req.json();

        // Update the categories JSON field
        await prisma.notificationPreference.upsert({
            where: { storeId },
            create: {
                storeId,
                categories: body,
                channels: { email: true, banner: true, in_app: true, whatsapp: false }
            },
            update: {
                categories: body
            }
        });

        // Log audit event
        await prisma.auditLog.create({
            data: {
                storeId,
                actorType: 'USER',
                actorId: session.user.id,
                actorLabel: session.user.email || 'Merchant',
                action: 'NOTIFICATION_PREFS_UPDATED',
                entityType: 'NotificationPreference',
                correlationId: `notify-${Date.now()}`
            }
        });

        return NextResponse.json({ success: true });
    } catch (error: any) {
        console.error('Notification update error:', error);
        return NextResponse.json({ error: 'Failed to update preferences' }, { status: 500 });
    }
}
