import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { ReportsService } from '@/lib/reports';

export async function GET(req: NextRequest, { params }: { params: { type: string } }) {
    const session = await getServerSession(authOptions);
    if (!session?.user) return new NextResponse('Unauthorized', { status: 401 });

    const { type } = params; // 'orders', 'payments', 'reconciliation'

    // Validate type
    if (!['reconciliation'].includes(type)) return new NextResponse('Invalid Type', { status: 400 });

    const csv = await ReportsService.generateCSV(
        (session!.user as any).storeId,
        type as any,
        { from: new Date(0), to: new Date() } // All time for V1 export? or parse query params
    );

    return new NextResponse(csv, {
        headers: {
            'Content-Type': 'text/csv',
            'Content-Disposition': `attachment; filename="${type}-${Date.now()}.csv"`
        }
    });
}
