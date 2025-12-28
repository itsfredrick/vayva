
import { NextResponse, NextRequest } from 'next/server';
import { prisma } from '@vayva/db';
import { OpsAuthService } from '@/lib/ops-auth';
import { z } from 'zod';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';

const patchSchema = z.object({
    action: z.enum(['DISABLE', 'ENABLE', 'RESET_PASSWORD'])
});

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const session = await OpsAuthService.getSession();

    if (!session || session.user.role !== 'OPS_OWNER') {
        const ip = req.headers.get('x-forwarded-for')?.split(',')[0] || 'unknown';
        await OpsAuthService.logEvent(session?.user?.id || null, 'OPS_UNAUTHORIZED_ACCESS', {
            ip, path: req.nextUrl.pathname, method: 'PATCH', reason: 'Not Owner'
        });
        return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const { id } = await params;

    if (id === session.user.id) {
        return NextResponse.json({ error: 'Cannot modify self' }, { status: 400 });
    }

    try {
        const body = await req.json();
        const { action } = patchSchema.parse(body);

        if (action === 'DISABLE' || action === 'ENABLE') {
            const isActive = action === 'ENABLE';
            const user = await prisma.opsUser.update({
                where: { id },
                data: { isActive },
                select: { id: true, email: true, isActive: true }
            });
            await OpsAuthService.logEvent(session.user.id, isActive ? 'OPS_USER_ENABLED' : 'OPS_USER_DISABLED', { targetId: id });
            return NextResponse.json({ success: true, user });
        }

        if (action === 'RESET_PASSWORD') {
            const tempPassword = crypto.randomBytes(8).toString('hex');
            const hash = await bcrypt.hash(tempPassword, 10);
            await prisma.opsUser.update({
                where: { id },
                data: { password: hash }
            });
            await OpsAuthService.logEvent(session.user.id, 'OPS_PASSWORD_RESET', { targetId: id });
            return NextResponse.json({ success: true, tempPassword });
        }

        return NextResponse.json({ error: 'Invalid action' }, { status: 400 });

    } catch (e: any) {
        return NextResponse.json({ error: e.message }, { status: 400 });
    }
}
