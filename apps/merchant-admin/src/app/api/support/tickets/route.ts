import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
export async function GET(req: any) {
    try {
        const session = await getServerSession(authOptions);
        const user = session?.user;
        if (!user?.id || !user.storeId) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }
        const storeId = user.storeId;
        const tickets = await prisma.supportTicket.findMany({
            where: { storeId },
            orderBy: { updatedAt: "desc" },
            include: {
                ticketMessages: {
                    orderBy: { createdAt: "desc" },
                    take: 1,
                },
            },
        });
        return NextResponse.json({ tickets });
    }
    catch (error: any) {
        console.error("Fetch Tickets Error:", error);
        return NextResponse.json({ error: "Failed to fetch tickets" }, { status: 500 });
    }
}
export async function POST(req: any) {
    try {
        const session = await getServerSession(authOptions);
        const user = session?.user;
        if (!user?.id || !user.storeId) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }
        const storeId = user.storeId;
        const body = await req.json();
        const { type, subject, description, priority, metadata } = body;
        const ticket = await prisma.supportTicket.create({
            data: {
                storeId,
                type,
                subject,
                description,
                priority: priority || "medium",
                metadata: metadata || {},
                status: "open",
                // Add initial message if description exists
                ticketMessages: description
                    ? {
                        create: {
                            sender: "merchant",
                            authorType: "MERCHANT",
                            authorName: user.name || "Merchant",
                            message: description,
                        },
                    }
                    : undefined,
            },
        });
        return NextResponse.json(ticket);
    }
    catch (error: any) {
        console.error("Create Ticket Error:", error);
        return NextResponse.json({ error: "Failed to create ticket" }, { status: 500 });
    }
}
