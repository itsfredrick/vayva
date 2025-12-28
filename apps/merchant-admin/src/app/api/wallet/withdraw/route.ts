import { NextResponse } from 'next/server';

export async function POST() {
    return NextResponse.json(
        {
            code: 'feature_not_configured',
            feature: 'WITHDRAWALS',
            message: 'Withdrawals are not currently enabled'
        },
        { status: 503 }
    );
}
