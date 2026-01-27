import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@vayva/db";
import { OpsAuthService } from "@/lib/ops-auth";

export async function GET(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    await OpsAuthService.requireSession();

    try {
        const { id: storeId } = await params;

        // Get audit logs for this merchant from store's order events as proxy
        const orderEvents = await prisma.orderEvent.findMany({
            where: { storeId },
            orderBy: { createdAt: "desc" },
            take: 50,
        });

        const logs = orderEvents.map((event: any) => ({
            id: event.id,
            action: event.type || "ORDER_EVENT",
            actor: "system",
            actorName: "System",
            metadata: event.data || {},
            createdAt: event.createdAt.toISOString(),
            ipAddress: null,
        }));

        return NextResponse.json({ logs });
    } catch (error: any) {
        console.error("Merchant audit error:", error);
        return NextResponse.json({ error: "Failed to fetch audit logs" }, { status: 500 });
    }
}
