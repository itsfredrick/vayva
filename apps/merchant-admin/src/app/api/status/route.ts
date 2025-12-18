import { NextResponse } from 'next/server';
import { prisma } from '@vayva/db';

export const dynamic = 'force-dynamic';

export async function GET() {
    // Public endpoint
    const incidents = await prisma.statusIncident.findMany({
        where: {
            // Only show unresolved OR resolved in last 24h
            OR: [
                { resolvedAt: null },
                { resolvedAt: { gte: new Date(Date.now() - 24 * 60 * 60 * 1000) } }
            ]
        },
        orderBy: { startDate: 'desc' }
    });

    const isOperational = incidents.length === 0;

    return NextResponse.json({
        indicator: isOperational ? 'none' : incidents[0]?.impact || 'minor',
        description: isOperational ? 'All Systems Operational' : 'Active Incident',
        incidents
    });
}
