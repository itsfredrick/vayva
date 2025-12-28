
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { prisma } from '@vayva/db';

export async function GET() {
    const cookieStore = await cookies();
    const consentCookie = cookieStore.get('vayva_consent');

    if (consentCookie) {
        try {
            const value = JSON.parse(consentCookie.value);
            return NextResponse.json(value);
        } catch (e) {
            // Invalid cookie
        }
    }

    // Default state: Essential only
    return NextResponse.json({
        essential: true,
        analytics: false,
        marketing: false,
        updatedAt: null // Never set
    });
}

export async function POST(request: Request) {
    let body;
    try {
        body = await request.json();
    } catch (e) {
        return NextResponse.json({ code: "bad_request", message: "Invalid JSON" }, { status: 400 });
    }

    const { analytics, marketing } = body;

    // Validate input strictly
    if (typeof analytics !== 'boolean' || typeof marketing !== 'boolean') {
        return NextResponse.json({ code: "validation_error", message: "Invalid boolean values" }, { status: 400 });
    }

    const cookieStore = await cookies();

    // Generate or retrieve stable consent ID
    let consentId = cookieStore.get('vayva_consent_id')?.value;
    if (!consentId) {
        consentId = crypto.randomUUID();
    }

    const timestamp = new Date().toISOString();

    // Persist to DB using TelemetryEvent (allows null merchantId for anonymous)
    try {
        await prisma.telemetryEvent.create({
            data: {
                id: crypto.randomUUID(),
                merchantId: null, // Hard Rule: No fake identity
                eventName: 'COOKIE_CONSENT_UPDATE',
                properties: {
                    consentId,
                    analytics,
                    marketing,
                    updatedAt: timestamp, // FIXED: Correct field name
                    ip: request.headers.get('x-forwarded-for') || 'unknown',
                    userAgent: request.headers.get('user-agent'),
                    version: '1.0'
                }
            }
        });
    } catch (error) {
        // Hard Rule: Return 503 if DB write fails
        return NextResponse.json(
            { code: "service_unavailable", message: "Failed to persist consent settings" },
            { status: 503 }
        );
    }

    const newState = {
        essential: true,
        analytics: Boolean(analytics),
        marketing: Boolean(marketing),
        updatedAt: timestamp,
        consentId
    };

    const response = NextResponse.json({ success: true, ...newState });

    response.cookies.set('vayva_consent', JSON.stringify(newState), {
        httpOnly: false,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 60 * 60 * 24 * 365,
        path: '/'
    });

    response.cookies.set('vayva_consent_id', consentId, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 60 * 60 * 24 * 365 * 5,
        path: '/'
    });

    return response;
}
