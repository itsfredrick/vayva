
import { NextResponse } from 'next/server';
import { getSessionUser } from '@/lib/session';
import { prisma } from '@vayva/db';
import { MERCHANT_VISIBLE_EVENTS } from '@/lib/merchant-activity';

export async function GET(request: Request) {
    try {
        const user = await getSessionUser();

        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { searchParams } = new URL(request.url);
        const page = parseInt(searchParams.get('page') || '1');
        const limit = parseInt(searchParams.get('limit') || '50');
        const actionFilter = searchParams.get('action');
        const startDate = searchParams.get('startDate');
        const endDate = searchParams.get('endDate');

        const skip = (page - 1) * limit;

        const where: any = {
            storeId: user.storeId,
            action: { in: MERCHANT_VISIBLE_EVENTS }
        };

        if (actionFilter && actionFilter !== 'ALL') {
            where.action = actionFilter;
        }

        if (startDate) {
            where.createdAt = { ...where.createdAt, gte: new Date(startDate) };
        }

        if (endDate) {
            where.createdAt = { ...where.createdAt, lte: new Date(endDate) };
        }

        const [events, total] = await Promise.all([
            prisma.auditLog.findMany({
                where,
                orderBy: { createdAt: 'desc' },
                skip,
                take: limit,
                select: {
                    id: true,
                    action: true,
                    afterState: true,
                    createdAt: true,
                    actorId: true,
                    actorLabel: true
                }
            }),
            prisma.auditLog.count({ where })
        ]);

        // Format events for merchant display
        const formattedEvents = events.map(event => ({
            id: event.id,
            action: event.action,
            metadata: event.afterState || {},
            createdAt: event.createdAt,
            actorRole: event.actorLabel || 'System'
        }));

        return NextResponse.json({
            success: true,
            data: {
                events: formattedEvents,
                pagination: {
                    page,
                    limit,
                    total,
                    totalPages: Math.ceil(total / limit)
                }
            }
        });

    } catch (error) {
        console.error("Activity Log Error:", error);
        return NextResponse.json({ error: "Failed to fetch activity log" }, { status: 500 });
    }
}
