import { NextResponse } from "next/server";
import { prisma } from "@vayva/db";
import { OpsAuthService } from "@/lib/ops-auth";

export async function GET(request: Request) {
    const { user } = await OpsAuthService.requireSession();
    if (!["OPS_OWNER", "OPS_ADMIN", "OPS_SUPPORT"].includes(user.role)) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");
    const status = searchParams.get("status") || "open";
    const q = searchParams.get("q") || "";
    const priority = searchParams.get("priority") || "";

    const skip = (page - 1) * limit;

    const where: any = {};
    if (status !== "all") where.status = status;
    if (priority) where.priority = priority;
    if (q) {
        where.OR = [
            { subject: { contains: q, mode: 'insensitive' } },
            { id: { contains: q, mode: 'insensitive' } },
            { store: { name: { contains: q, mode: 'insensitive' } } }
        ];
    }

    const [tickets, total] = await Promise.all([
        prisma.supportTicket.findMany({
            where,
            include: {
                store: {
                    select: { id: true, name: true, slug: true }
                }
            },
            orderBy: [
                { priority: 'desc' }, // Logic might be needed for actual priority sorting if it's enum-like
                { createdAt: 'desc' }
            ],
            skip,
            take: limit,
        }),
        prisma.supportTicket.count({ where })
    ]);

    const totalPages = Math.ceil(total / limit);

    return NextResponse.json({
        data: tickets.map(t => ({
            ...t,
            storeName: t.store.name,
            lastMessageAt: t.lastMessageAt.toISOString(),
            createdAt: t.createdAt.toISOString(),
            // Mock messageCount for now
            messageCount: 1
        })),
        meta: {
            total,
            page,
            limit,
            totalPages
        }
    });
}
