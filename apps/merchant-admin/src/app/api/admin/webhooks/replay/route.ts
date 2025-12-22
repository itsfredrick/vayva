import { NextRequest, NextResponse } from 'next/server';
import { checkAdminAccess } from '@/lib/admin/auth';
import { prisma } from '@vayva/db';

export async function POST(req: NextRequest) {
    try {
        const admin = await checkAdminAccess('admin.webhook.replay');
        const body = await req.json();
        const { event_id } = body;

        // 1. Fetch original event
        const event = await prisma.webhookEvent.findUnique({
            where: { eventId: event_id }
        });

        if (!event) return new NextResponse('Event not found', { status: 404 });

        // 2. Re-trigger Handler Logic
        // In a real app, this might invoke a background job or call the handler directly.
        // Or we just mark it 'received' so the worker picks it up again.
        // For V1, let's assume we reset status to 'received' and clear error.

        await prisma.webhookEvent.update({
            where: { id: event.id },
            data: {
                status: 'received',
                error: null,
                processedAt: null // Will be updated when processed again
            }
        });

        // Audit Log
        await prisma.auditLog.create({
            data: {
                action: 'admin.webhook.replay',
                actorType: 'platform_admin',
                actorId: (admin.user as any).id || 'admin',
                entityType: 'webhook_event',
                entityId: event.id,
                afterState: { original_event_id: event_id } as any,
                correlationId: `replay_${Date.now()}`,
                actorLabel: (admin.user as any).email || 'Admin'
            }
        });

        return NextResponse.json({ success: true });

    } catch (e: any) {
        return new NextResponse(e.message, { status: 500 });
    }
}
