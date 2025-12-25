
import { NextResponse } from 'next/server';
import { prisma } from '@vayva/db';

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        // In real app, extracting merchantId/storeId from session is critical
        // For now, assuming storeId is passed or we fetch first store for demo
        const storeId = searchParams.get('storeId') || 'store-123';

        const tickets = await prisma.supportTicket.findMany({
            where: { storeId },
            orderBy: { updatedAt: 'desc' },
            include: {
                ticketMessages: {
                    orderBy: { createdAt: 'desc' },
                    take: 1
                }
            }
        });

        return NextResponse.json({ tickets });
    } catch (error) {
        console.error("Fetch Tickets Error:", error);
        return NextResponse.json({ error: "Failed to fetch tickets" }, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { storeId, type, subject, description, priority, metadata } = body;

        // @ts-ignore
        // @ts-ignore
        const ticket = await prisma.supportTicket.create({
            data: {
                storeId: storeId || 'store-123', // Fallback for dev
                type,
                subject,
                description,
                priority: priority || 'medium',
                metadata: metadata || {},
                status: 'open',
                // Add initial message if description exists? 
                // Alternatively, separate message creation.
                // Let's create an initial message if description is provided to act as the "body"
                ticketMessages: description ? {
                    create: {
                        sender: 'merchant',
                        message: description
                    }
                } : undefined
            }
        });

        return NextResponse.json(ticket);
    } catch (error) {
        console.error("Create Ticket Error:", error);
        return NextResponse.json({ error: "Failed to create ticket" }, { status: 500 });
    }
}
