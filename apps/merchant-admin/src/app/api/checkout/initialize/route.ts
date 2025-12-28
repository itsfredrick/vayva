import { NextResponse } from 'next/server';

export async function POST() {
    return NextResponse.json(
        {
            code: 'feature_not_configured',
            feature: 'CHECKOUT',
            message: 'Checkout initialization is not currently enabled'
        },
        { status: 503 }
    );
}
