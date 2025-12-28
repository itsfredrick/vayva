
import { NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth/session';
import { prisma } from '@vayva/db';

export async function GET() {
    try {
        const session = await requireAuth();
        const storeId = session.user.storeId;
        const userId = session.user.id;

        // Fetch recent login logs for this user/store
        const loginLogs = await prisma.auditLog.findMany({
            where: {
                storeId,
                actorId: userId,
                action: { contains: 'LOGIN' }
            },
            take: 5,
            orderBy: { createdAt: 'desc' }
        });

        // Fetch 2FA status
        const securitySetting = await prisma.securitySetting.findUnique({
            where: { storeId }
        });

        const activeSessions = loginLogs.map(log => ({
            id: log.id,
            device: log.userAgent || 'Unknown Device',
            location: log.ipAddress || 'Unknown Location',
            lastActive: log.createdAt,
            isCurrent: false, // In a real system, we'd compare session IDs
        }));

        return NextResponse.json({
            mfaEnabled: securitySetting?.mfaRequired || false,
            sessions: activeSessions.length > 0 ? activeSessions : [
                {
                    id: 'current',
                    device: 'Current Browser',
                    location: 'Local',
                    lastActive: new Date(),
                    isCurrent: true
                }
            ]
        });
    } catch (error: any) {
        console.error('Security fetch error:', error);
        return NextResponse.json({ error: 'Failed to fetch security settings' }, { status: 500 });
    }
}
