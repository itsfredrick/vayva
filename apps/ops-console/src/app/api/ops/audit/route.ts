import { NextRequest, NextResponse } from 'next/server';
import { OpsAuthService } from "@/lib/ops-auth";
import { prisma } from "@vayva/db";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
    try {
        await OpsAuthService.requireSession();

        const searchParams = req.nextUrl.searchParams;
        const page = parseInt(searchParams.get("page") || "1");
        const limit = parseInt(searchParams.get("limit") || "20");

        const skip = (page - 1) * limit;

        const [events, total] = await Promise.all([
            prisma.opsAuditEvent.findMany({
                take: limit,
                skip,
                orderBy: { createdAt: "desc" },
                include: {
                    opsUser: {
                        select: { name: true, email: true, role: true },
                    },
                },
            }),
            prisma.opsAuditEvent.count(),
        ]);

        const data = events.map((e: any) => ({
            id: (e as any).id,
            eventType: (e as any).eventType,
            metadata: (e as any).metadata,
            createdAt: (e as any).createdAt,
            actor: (e as any).opsUser
                ? {
                    name: (e as any).opsUser.name,
                    email: (e as any).opsUser.email,
                    role: (e as any).opsUser.role,
                }
                : { name: "System", email: "system", role: "SYSTEM" },
        }));

        return NextResponse.json({
            data,
            meta: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit),
            },
        });
    } catch (error: any) {
        console.error("Audit Logs error:", error);
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
}
