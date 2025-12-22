import { NextRequest, NextResponse } from 'next/server';
import { verifyPreferencesToken } from '@/lib/consent/token';
import { getConsent, applyConsentUpdate } from '@/lib/consent/consent';
import { ConsentChannel, ConsentSource } from '@vayva/db';

export async function GET(
    req: NextRequest,
    { params }: { params: { token: string } }
) {
    const payload = verifyPreferencesToken(params.token);
    if (!payload) {
        return new NextResponse('Invalid or expired token', { status: 404 });
    }

    const consent = await getConsent(payload.merchantId, payload.phoneE164);

    // Return safe public view
    return NextResponse.json({
        phoneMasked: maskPhone(payload.phoneE164),
        marketingOptIn: consent.marketingOptIn,
        transactionalAllowed: consent.transactionalAllowed,
        fullyBlocked: consent.fullyBlocked
    });
}

export async function POST(
    req: NextRequest,
    { params }: { params: { token: string } }
) {
    const payload = verifyPreferencesToken(params.token);
    if (!payload) {
        return new NextResponse('Invalid or expired token', { status: 401 });
    }

    const body = await req.json();

    await applyConsentUpdate(
        payload.merchantId,
        payload.phoneE164,
        {
            marketingOptIn: body.marketingOptIn,
            transactionalAllowed: body.transactionalAllowed,
            fullyBlocked: body.fullyBlocked
        },
        {
            channel: 'WEB' as any,
            source: ConsentSource.CUSTOMER_ACTION,
            reason: 'Customer updated preferences via link'
        }
    );

    return NextResponse.json({ ok: true });
}

function maskPhone(phone: string) {
    if (phone.length < 8) return '***';
    return phone.substring(0, 4) + '****' + phone.substring(phone.length - 2);
}
