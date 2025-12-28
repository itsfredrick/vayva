
import { NextResponse } from 'next/server';
import { checkPermission } from '@/lib/team/rbac';
import { PERMISSIONS } from '@/lib/team/permissions';
import { TeamService } from '@/lib/team/teamService';

export async function POST(req: Request) {
    try {
        const session = await checkPermission(PERMISSIONS.TEAM_MANAGE);
        const storeId = (session.user as any).storeId;
        const userId = session.user.id;

        const body = await req.json();
        const { email, role } = body;

        if (!email || !role) {
            return NextResponse.json({ error: 'Missing email or role' }, { status: 400 });
        }

        await TeamService.inviteMember(storeId, userId, { email, role });

        return NextResponse.json({ success: true, message: 'Invite sent' });
    } catch (error: any) {
        console.error('Team invite error:', error);
        if (error.message.includes('Forbidden') || error.message.includes('Unauthorized')) {
            return NextResponse.json({ error: error.message }, { status: error.message.includes('Forbidden') ? 403 : 401 });
        }
        return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
    }
}
