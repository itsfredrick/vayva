
import { NextResponse } from 'next/server';
import { getSessionUser } from '@/lib/session';
import { prisma } from '@vayva/db';
import { authorizeAction, AppRole } from '@/lib/permissions';
import { logAuditEvent, AuditEventType } from '@/lib/audit';


export async function POST(request: Request) {
    try {
        const user = await getSessionUser();
        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // Permission Check
        const authError = await authorizeAction(user || undefined, AppRole.STAFF);
        if (authError) return authError;

        const body = await request.json();
        const { ids, status } = body;

        if (!ids || !Array.isArray(ids) || ids.length === 0 || !status) {
            return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });
        }

        // Verify status validity (optional but good practice)
        // For simplicity, assuming status is valid enum key string

        await prisma.order.updateMany({
            where: {
                id: { in: ids },
                storeId: user.storeId
            },
            data: {
                status: status
            }
        });

        // Audit Log
        await logAuditEvent(
            user.storeId,
            user.id,
            AuditEventType.ORDER_BULK_STATUS_CHANGED,
            { count: ids.length, toStatus: status }
        );

        return NextResponse.json({ success: true, count: ids.length });

    } catch (error) {
        console.error("Bulk Update Error:", error);
        return NextResponse.json({ error: "Failed to update orders" }, { status: 500 });
    }
}
