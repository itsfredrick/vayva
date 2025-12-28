
import { NextResponse } from 'next/server';
import { getSessionUser } from '@/lib/session';
import { authorizeAction, AppRole } from '@/lib/permissions';
import { getRecentSlowPaths } from '@/lib/performance';

export async function GET(request: Request) {
    try {
        const user = await getSessionUser();

        // Admin/Owner only
        const authError = await authorizeAction(user || undefined, AppRole.ADMIN);
        if (authError) return authError;

        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const slowPaths = getRecentSlowPaths(50);

        return NextResponse.json({
            success: true,
            data: {
                slowPaths,
                count: slowPaths.length
            }
        });

    } catch (error) {
        console.error("Slow Paths Error:", error);
        return NextResponse.json({ error: "Failed to fetch slow paths" }, { status: 500 });
    }
}
