import { NextRequest, NextResponse } from 'next/server';

// DEV ONLY: This endpoint is temporarily disabled
// TODO: Update to match current Prisma schema
export async function POST(request: NextRequest) {
    return NextResponse.json({ error: 'Endpoint temporarily disabled' }, { status: 503 });
}
