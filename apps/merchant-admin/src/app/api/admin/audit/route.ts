
import { NextResponse } from 'next/server';
import { getSessionUser } from '@/lib/session';
import { prisma } from '@vayva/db';
import { authorizeAction, AppRole } from '@/lib/permissions';

export async function GET(request: Request) {
    try {
        const user = await getSessionUser();

        // Strict: Only Admins/Owners can view audit logs
        const authError = await authorizeAction(user || undefined, AppRole.ADMIN);
        if (authError) return authError;

        if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const { searchParams } = new URL(request.url);
        const page = parseInt(searchParams.get('page') || '1');
        const limit = 25;
        const type = searchParams.get('type');

        const where: any = {
            merchantId: user.storeId
        };
        if (type && type !== 'ALL') {
            where.eventType = type;
        }

        const events = await prisma.auditEvent.findMany({
            where,
            orderBy: { createdAt: 'desc' },
            take: limit,
            skip: (page - 1) * limit
        });

        return NextResponse.json({ events });

    } catch (error) {
        console.error("Audit Fetch Error:", error);
        return NextResponse.json({ error: "Failed to fetch audit logs" }, { status: 500 });
    }
}
