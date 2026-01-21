import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth/session";
import { prisma } from "@/lib/prisma";
export async function GET(req) {
    try {
        const session = await requireAuth();
        const storeId = session.user.storeId;
        const { searchParams } = new URL(req.url);
        const page = parseInt(searchParams.get("page") || "1");
        const limit = parseInt(searchParams.get("limit") || "20");
        const logs = await prisma.auditLog.findMany({
            where: { storeId },
            orderBy: { createdAt: "desc" },
            skip: (page - 1) * limit,
            take: limit,
        });
        const total = await prisma.auditLog.count({ where: { storeId } });
        return NextResponse.json({
            logs,
            pagination: {
                total,
                page,
                limit,
                pages: Math.ceil(total / limit),
            },
        });
    }
    catch (error) {
        console.error("Audit log fetch error:", error);
        return NextResponse.json({ error: "Failed to fetch audit logs" }, { status: 500 });
    }
}
