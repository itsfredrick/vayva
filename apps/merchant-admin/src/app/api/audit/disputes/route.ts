import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const status = searchParams.get("status");
        const disputes = await prisma.dispute.findMany({
            where: status ? { status: status as any } : undefined,
            include: {
                store: { select: { name: true } },
                order: { select: { id: true } },
            },
            orderBy: { createdAt: "desc" },
            take: 100,
        });
        const formattedDisputes = disputes.map((d: any) => ({
            id: d.id,
            merchant: (d as any).store.name,
            amount: d.amount,
            currency: d.currency,
            status: d.status,
            reason: d.reasonCode || "N/A",
            created: d.createdAt,
            deadline: d.evidenceDueAt,
            orderId: (d as any).order?.id,
        }));
        return NextResponse.json({ disputes: formattedDisputes });
    }
    catch (error: any) {
        console.error("Audit Disputes Error:", error);
        return NextResponse.json({ error: "Failed to fetch disputes" }, { status: 500 });
    }
}
