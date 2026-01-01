import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@vayva/db";
import { OpsAuthService } from "@/lib/ops-auth";

export async function GET(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        await OpsAuthService.requireSession();
        const { id } = await params;

        const incident = await prisma.rescueIncident.findUnique({
            where: { id },
            include: {
                FixActions: { orderBy: { createdAt: "desc" } },
                AuditLogs: { orderBy: { createdAt: "desc" } },
            },
        });

        if (!incident) return NextResponse.json({ error: "Not found" }, { status: 404 });

        return NextResponse.json(incident);
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 401 });
    }
}
