import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@vayva/db';
import { hasPermission, PERMISSIONS } from '@/lib/auth/permissions';
import { EventBus } from '@/lib/events/eventBus';

export async function POST(req: NextRequest) {
    const session = await getServerSession(authOptions);
    if (!(session?.user as any)?.storeId) {
        return new NextResponse('Unauthorized', { status: 401 });
    }

    const { storeId, id: userId } = (session!.user as any);
    const hasPerm = await hasPermission(userId, storeId, PERMISSIONS.TEAM_MANAGE);
    if (!hasPerm) {
        return new NextResponse('Forbidden', { status: 403 });
    }

    const { userId: targetUserId } = await req.json();

    const targetMembership = await prisma.membership.findUnique({
        where: { userId_storeId: { userId: targetUserId, storeId } },
        select: { role: true }
    });

    if (!targetMembership) return new NextResponse('Member not found', { status: 404 });

    if (targetMembership.role === 'owner') {
        return new NextResponse('Cannot remove owner', { status: 400 });
    }

    await prisma.membership.delete({
        where: { userId_storeId: { userId: targetUserId, storeId } }
    });

    const user = (session!.user as any);
    const actorLabel = `${user.firstName || ''} ${user.lastName || ''}`.trim() || user.email || 'System';
    await EventBus.publish({
        merchantId: storeId,
        type: 'team.member_removed',
        payload: { targetUserId },
        ctx: {
            actorId: userId,
            actorType: 'merchant_user',
            actorLabel,
            correlationId: req.headers.get('x-correlation-id') || `req-${Date.now()}`
        }
    });

    return NextResponse.json({ ok: true });
}
