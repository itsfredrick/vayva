
import { NextRequest, NextResponse } from 'next/server';
import { OpsAuthService } from '@/lib/ops-auth';
import { z } from 'zod';

const loginSchema = z.object({
    email: z.string().email(),
    password: z.string().min(1)
});

export async function POST(req: NextRequest) {
    const ip = req.headers.get('x-forwarded-for')?.split(',')[0] || 'unknown';

    // 1. Rate Limiting Check
    if (await OpsAuthService.isRateLimited(ip)) {
        await OpsAuthService.logEvent(null, 'OPS_LOGIN_BLOCKED', { ip, reason: 'Rate limit exceeded' });
        return NextResponse.json(
            { error: 'Too many attempts. Please try again in 15 minutes.' },
            { status: 429 }
        );
    }

    try {
        // Just-in-time bootstrap check
        await OpsAuthService.bootstrapOwner();

        const body = await req.json();
        const { email, password } = loginSchema.parse(body);

        try {
            const user = await OpsAuthService.login(email, password);

            if (!user) {
                // Audit Failed Login (Invalid Credentials)
                await OpsAuthService.logEvent(null, 'OPS_LOGIN_FAILED', { ip, email, reason: 'Invalid credentials' });
                return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
            }

            return NextResponse.json({ success: true, role: user.role });

        } catch (authError: any) {
            // Handle known auth errors (e.g. Disabled Account)
            if (authError.message === 'Account disabled') {
                await OpsAuthService.logEvent(null, 'OPS_LOGIN_FAILED', { ip, email, reason: 'Account disabled' });
                return NextResponse.json({ error: 'Account disabled' }, { status: 403 });
            }
            throw authError;
        }
    } catch (error: any) {
        return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
    }
}
