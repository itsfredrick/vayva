import { NextRequest, NextResponse } from "next/server";
import { getSessionUser } from "@/lib/session";
import { prisma } from "@/lib/prisma";
// PATCH /api/kitchen/orders/[id]/status
export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const sessionUser = await getSessionUser();
        if (!sessionUser)
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        const { id } = await params;
        const body = await request.json();
        const { status } = body;
        // Status should be PREPARING or READY_FOR_PICKUP or DELIVERED (Completed)
        if (!status)
            return NextResponse.json({ error: "Status required" }, { status: 400 });
        const order = await prisma.order.update({
            where: { id, storeId: sessionUser.storeId },
            data: {
                fulfillmentStatus: status
            }
        });
        return NextResponse.json({ success: true, order });
    }
    catch (e: any) {
        console.error("Update kitchen status error:", e);
        return NextResponse.json({ error: "Internal Error" }, { status: 500 });
    }
}
