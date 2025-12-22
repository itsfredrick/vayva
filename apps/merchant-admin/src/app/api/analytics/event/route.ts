
import { NextRequest, NextResponse } from 'next/server';
import { AnalyticsService } from '@/lib/analytics/analyticsService';
import { VisitorService } from '@/lib/analytics/visitor';

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { eventName, merchantId, storeId, properties, path } = body;

        if (!eventName || !merchantId) {
            return new NextResponse('Missing required fields', { status: 400 });
        }

        // Visitor Management
        const { id: visitorId, isNew } = VisitorService.getVisitorId(req);

        // Track
        await AnalyticsService.trackEvent({
            merchantId,
            storeId,
            eventName,
            visitorId, // Storing raw UUID for V1, hash if strict privacy needed
            path,
            properties
        });

        const res = new NextResponse('Recorded', { status: 204 });

        // Set Cookie if new
        if (isNew) {
            res.cookies.set(VisitorService.COOKIE_NAME, visitorId, {
                httpOnly: true, // actually strict httpOnly might block frontend JS access if we need it there? 
                // Analytics usually script access. But if server-side tracking, HttpOnly is safer.
                // Let's assume HttpOnly is fine as we track via API.
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'lax',
                maxAge: 60 * 60 * 24 * 180 // 180 days
            });
        }

        return res;

    } catch (e) {
        console.error(e);
        return new NextResponse('Error', { status: 500 });
    }
}

// OPTIONS for CORS if needed (next.js app router might handle or we add it)
export async function OPTIONS() {
    return new NextResponse(null, {
        status: 200,
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'POST, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type, Cookie'
        }
    });
}
