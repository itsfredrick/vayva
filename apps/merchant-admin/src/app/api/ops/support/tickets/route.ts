import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
export async function GET(req: any) {
    try {
        const session = await getServerSession(authOptions);
        // In real app, check for ADMIN/OPS role here
        if (!session?.user?.id)
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        const tickets = await prisma.supportTicket.findMany({
            orderBy: { lastMessageAt: "desc" },
            include: {
                store: {
                    select: { name: true, category: true },
                },
                handoffEvents: {
                    take: 1,
                },
            },
        });
        return NextResponse.json(tickets);
    }
    catch (error) {
        return NextResponse.json({ error: "Internal Error" }, { status: 500 });
    }
}
