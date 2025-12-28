
import { NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth/session';
import { prisma } from '@vayva/db';

export async function GET() {
    try {
        const session = await requireAuth();
        const storeId = session.user.storeId;

        // In a real scenario, this would perform actual pings/checks
        // For now, we simulate connectivity checks
        const health = {
            whatsapp: { status: 'CONNECTED', lastCheck: new Date().toISOString(), latency: '120ms' },
            paystack: { status: 'CONNECTED', lastCheck: new Date().toISOString(), latency: '45ms' },
            email: { status: 'CONNECTED', lastCheck: new Date().toISOString(), latency: '80ms' },
            logistics: { status: 'DISCONNECTED', lastCheck: new Date().toISOString() }
        };

        return NextResponse.json(health);
    } catch (error: any) {
        console.error('Integrations check error:', error);
        return NextResponse.json({ error: 'Failed to check integrations' }, { status: 500 });
    }
}
