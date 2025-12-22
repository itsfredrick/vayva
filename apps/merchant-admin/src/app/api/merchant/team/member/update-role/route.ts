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

    const { userId: targetUserId, role } = await req.json();

    const targetMembership = await prisma.membership.findUnique({
        where: { userId_storeId: { userId: targetUserId, storeId } },
        select: { role: true, id: true }
    });

    if (!targetMembership) return new NextResponse('Member not found', { status: 404 });

    // Cannot change OWNER role
    if (targetMembership.role === 'owner') {
        return new NextResponse('Cannot modify owner role', { status: 400 });
    }

    // Cannot assign OWNER role via this route (transfer ownership is separate flow)
    if (role === 'owner') {
        return new NextResponse('Cannot assign owner role directly', { status: 400 });
    }

    await prisma.membership.update({
        where: { userId_storeId: { userId: targetUserId, storeId } },
        data: { role }
    });

    const user = (session!.user as any);
    const actorLabel = `${user.firstName || ''} ${user.lastName || ''}`.trim() || user.email || 'System';
    await EventBus.publish({
        merchantId: storeId,
        type: 'team.role_updated',
        payload: { targetUserId, oldRole: targetMembership.role, newRole: role },
        ctx: {
            actorId: userId,
            actorType: 'merchant_user',
            actorLabel,
            correlationId: req.headers.get('x-correlation-id') || `req-${Date.now()}`
        }
    });

    return NextResponse.json({ ok: true });
}
