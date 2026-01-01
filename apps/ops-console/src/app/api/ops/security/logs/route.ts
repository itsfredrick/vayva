
import { NextRequest, NextResponse } from "next/server";
import { OpsAuthService } from "@/lib/ops-auth";
import { prisma } from "@vayva/db";

export async function GET(req: NextRequest) {
    try {
        const { user } = await OpsAuthService.requireSession();
        // Perms: Admin/Owner only (Sensitive data)
        if (!["OPS_OWNER", "OPS_ADMIN"].includes(user.role)) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
        }

        const { searchParams } = new URL(req.url);
        const limit = parseInt(searchParams.get("limit") || "50");
        const page = parseInt(searchParams.get("page") || "1");
        const type = searchParams.get("type"); // Filter by event type
        const userId = searchParams.get("userId");

        const skip = (page - 1) * limit;

        const where: any = {};
        if (type) where.eventType = type;
        if (userId) where.opsUserId = userId;

        const [events, total] = await Promise.all([
            prisma.opsAuditEvent.findMany({
                where,
                include: {
                    OpsUser: {
                        select: { name: true, email: true, role: true }
                    }
                },
                orderBy: { createdAt: "desc" },
                take: limit,
                skip
            }),
            prisma.opsAuditEvent.count({ where })
        ]);

        return NextResponse.json({
            data: events,
            meta: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit)
            }
        });

    } catch (error) {
        console.error("Fetch Security Logs Error:", error);
        return NextResponse.json({ error: "Failed to fetch logs" }, { status: 500 });
    }
}
