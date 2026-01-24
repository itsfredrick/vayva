import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
export async function GET(req: any, { params }: any) {
    const { id } = await params;
    try {
        const ticket = await prisma.supportTicket.findUnique({
            where: { id: id },
            include: {
                ticketMessages: {
                    orderBy: { createdAt: "asc" },
                },
            },
        });
        if (!ticket) {
            return NextResponse.json({ error: "Ticket not found" }, { status: 404 });
        }
        return NextResponse.json(ticket);
    }
    catch (error: any) {
        console.error("Fetch Ticket Detail Error:", error);
        return NextResponse.json({ error: "Failed to fetch ticket" }, { status: 500 });
    }
}
