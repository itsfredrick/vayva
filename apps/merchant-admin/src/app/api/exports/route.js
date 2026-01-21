import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { logAuditEvent as logAudit, AuditEventType } from "@/lib/audit";
import { checkRateLimit } from "@/lib/rate-limit";
export async function GET() {
    try {
        const session = await getServerSession(authOptions);
        if (!session || !session.user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }
        const storeId = session.user.storeId;
        const jobs = await prisma.exportJob.findMany({
            where: { storeId },
            orderBy: { createdAt: "desc" },
            take: 10,
        });
        return NextResponse.json({ jobs });
    }
    catch (error) {
        console.error("Export jobs fetch error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
export async function POST(req) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || !session.user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }
        const storeId = session.user.storeId;
        const userId = session.user.id;
        // Rate Limit: 3 per hour
        await checkRateLimit(userId, "export_request", 3, 3600, storeId);
        const body = await req.json();
        const { type } = body;
        if (!type) {
            return NextResponse.json({ error: "Missing export type" }, { status: 400 });
        }
        const job = await prisma.exportJob.create({
            data: {
                storeId,
                type,
                status: "PENDING",
                expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
            },
        });
        await logAudit(storeId, userId, AuditEventType.EXPORT_CREATED, {
            targetType: "ExportJob",
            targetId: job.id,
            after: { type },
            meta: { actor: { type: "USER", label: session.user.email || "Merchant" } }
        });
        return NextResponse.json({ job });
    }
    catch (error) {
        console.error("Export request error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
