
import { NextResponse } from 'next/server';

export async function POST() {
    return NextResponse.json(
        {
            code: 'feature_not_configured',
            feature: 'DEV_TOOLS',
            message: 'Development tools are disabled in this environment'
        },
        { status: 503 }
    );
}
