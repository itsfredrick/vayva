
import { NextResponse } from 'next/server';
import { getSessionUser } from '@/lib/session';
import { authorizeAction, AppRole } from '@/lib/permissions';
import { getOpsMetrics } from '@/lib/ops-metrics';

export async function GET(request: Request) {
    try {
        const user = await getSessionUser();

        // Admin/Owner only
        const authError = await authorizeAction(user || undefined, AppRole.ADMIN);
        if (authError) return authError;

        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const metrics = await getOpsMetrics(user.storeId);

        return NextResponse.json({ success: true, data: metrics });

    } catch (error) {
        console.error("Ops Metrics Error:", error);
        return NextResponse.json({ error: "Failed to fetch metrics" }, { status: 500 });
    }
}
