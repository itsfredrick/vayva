import { NextRequest, NextResponse } from "next/server";
import { OpsAuthService } from "@/lib/ops-auth";
import { prisma } from "@vayva/db";

export const dynamic = "force-dynamic";

export async function GET(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        await OpsAuthService.requireSession();
        const { id } = await params;

        const shipment = await prisma.shipment.findUnique({
            where: { id },
            include: {
                store: { select: { id: true, name: true } },
                Order: { select: { id: true, orderNumber: true, status: true } },
                DispatchJob: { orderBy: { createdAt: "desc" } }
            }
        });

        if (!shipment) return NextResponse.json({ error: "Shipment not found" }, { status: 404 });

        return NextResponse.json({ data: shipment });
    } catch (error: any) {
        if (error.message === "Unauthorized") return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        console.error("Delivery detail error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
