import { NextResponse } from 'next/server';
import { getSessionUser } from '@/lib/session';
import { prisma } from '@vayva/db';
import { authorizeAction, AppRole } from '@/lib/permissions';
import { logAuditEvent, AuditEventType } from '@/lib/audit';

export async function GET(request: Request) {
    try {
        const user = await getSessionUser();
        // Permission Check (Exports are sensitive, maybe Staff+)
        const authError = await authorizeAction(user || undefined, AppRole.STAFF);
        if (authError) return authError;

        if (!user) { // Redundant but safe for TS if authorizeAction changes
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { searchParams } = new URL(request.url);
        const ids = searchParams.get('ids')?.split(',').filter(Boolean);
        const status = searchParams.get('status');
        const q = searchParams.get('q');

        let where: any = {
            storeId: user.storeId,
        };

        let auditScope = 'filtered';
        let auditCount = 0;

        if (ids && ids.length > 0) {
            where.id = { in: ids };
            auditScope = 'selected';
        } else {
            // Apply filtering if no specific IDs selected
            if (status && status !== 'ALL') where.status = status;
            if (q) {
                where.OR = [
                    { orderNumber: { equals: parseInt(q) ? parseInt(q) : undefined } },
                    { refCode: { contains: q, mode: 'insensitive' } },
                    { customerEmail: { contains: q, mode: 'insensitive' } },
                ].filter(c => Object.values(c)[0] !== undefined);
            }
        }

        const orders = await prisma.order.findMany({
            where,
            orderBy: { createdAt: 'desc' },
            take: 1000,
        });

        auditCount = orders.length;

        // Generate CSV
        const header = ['Order ID', 'Date', 'Status', 'Total', 'Payment', 'Customer'];
        const rows = orders.map((o: any) => [
            o.refCode || o.id,
            new Date(o.createdAt).toISOString(),
            o.status,
            o.total,
            o.paymentMethod || 'N/A',
            o.customerEmail || 'Guest'
        ]);

        const csvContent = [
            header.join(','),
            ...rows.map(row => row.map((field: any) => `"${String(field).replace(/"/g, '""')}"`).join(','))
        ].join('\n');

        // Log Audit Event (Server-side only)
        await logAuditEvent(
            user.storeId,
            user.id,
            AuditEventType.ORDER_EXPORTED,
            { scope: auditScope, count: auditCount }
        );

        return new NextResponse(csvContent, {
            headers: {
                'Content-Type': 'text/csv; charset=utf-8',
                'Content-Disposition': `attachment; filename="orders_export_${new Date().toISOString().split('T')[0]}.csv"`,
            },
        });

    } catch (error) {
        console.error("Export Error:", error);
        return NextResponse.json({ error: "Failed to export orders" }, { status: 500 });
    }
}
