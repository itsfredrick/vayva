import { NextResponse } from 'next/server';
import { prisma } from '@vayva/db';
import { OpsAuthService } from '@/lib/ops-auth';
import { NotificationManager } from '@vayva/shared';

export async function POST(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await OpsAuthService.requireSession();
        const { id: logId } = await params;
        const body = await req.json();
        const { storeId } = body;

        const log = await (prisma as any).notificationLog.findUnique({
            where: { id: logId }
        });

        if (!log) {
            return NextResponse.json({ error: 'Notification log not found' }, { status: 404 });
        }

        // Trigger resend
        await NotificationManager.trigger(storeId, log.type as any, log.metadata?.variables || {});

        // Log audit event
        await prisma.auditLog.create({
            data: {
                storeId,
                actorType: 'OPS',
                actorLabel: 'OPS_CONSOLE',
                action: 'NOTIFICATION_RESENT',
                entityType: 'NotificationLog',
                entityId: logId,
                correlationId: `resend-${Date.now()}`
            }
        });

        return NextResponse.json({ success: true });
    } catch (error: any) {
        console.error('Notification resend error:', error);
        return NextResponse.json({ error: 'Failed to resend notification' }, { status: 500 });
    }
}
