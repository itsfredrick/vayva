
import { NextResponse } from 'next/server';
import { getSessionUser } from '@/lib/session';
import { prisma } from '@vayva/db';
import { authorizeAction, AppRole } from '@/lib/permissions';
import { logAuditEvent, AuditEventType } from '@/lib/audit';

export async function GET(request: Request) {
    try {
        const user = await getSessionUser();
        // Permission Check (Exports are sensitive, ADMIN only for Withdrawals)
        const authError = await authorizeAction(user || undefined, AppRole.ADMIN);
        if (authError) return authError;

        if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const { searchParams } = new URL(request.url);
        const status = searchParams.get('status');
        const startDate = searchParams.get('startDate');
        const endDate = searchParams.get('endDate');

        const where: any = {
            storeId: user.storeId
        };
        if (status && status !== 'ALL') where.status = status;
        if (startDate && endDate) {
            where.createdAt = {
                gte: new Date(startDate),
                lte: new Date(new Date(endDate).setHours(23, 59, 59))
            };
        }

        const withdrawals = await prisma.withdrawal.findMany({
            where,
            orderBy: { createdAt: 'desc' },
            take: 2000 // Limit export size
        });

        // Generate CSV - REMOVED Bank Account for Privacy (P8.1)
        const header = ['Date', 'Reference', 'Status', 'Gross (NGN)', 'Fee (NGN)', 'Net (NGN)'];
        const rows = withdrawals.map(w => [
            new Date(w.createdAt).toISOString(),
            w.referenceCode,
            w.status,
            (Number(w.amountKobo) / 100).toFixed(2),
            (Number(w.feeKobo) / 100).toFixed(2),
            (Number(w.amountNetKobo) / 100).toFixed(2)
        ]);

        const csvContent = [
            header.join(','),
            ...rows.map(row => row.map(field => `"${String(field).replace(/"/g, '""')}"`).join(','))
        ].join('\n');

        // Audit Log (P8.1 Requirement)
        await logAuditEvent(
            user.storeId,
            user.id,
            AuditEventType.WITHDRAWAL_EXPORTED,
            { count: withdrawals.length, statusFilter: status || 'ALL' }
        );

        // Telemetry
        const { telemetry } = await import('@/lib/telemetry');
        telemetry.track('withdrawal_export_csv', { count: withdrawals.length });

        return new NextResponse(csvContent, {
            headers: {
                'Content-Type': 'text/csv; charset=utf-8',
                'Content-Disposition': `attachment; filename="withdrawals_${new Date().toISOString().split('T')[0]}.csv"`,
            },
        });

    } catch (error) {
        console.error("Export Error:", error);
        return NextResponse.json({ error: "Failed to export data" }, { status: 500 });
    }
}
