import { NextResponse } from "next/server";
import { OpsAuthService } from "@/lib/ops-auth";
import { prisma } from "@vayva/db";
export const dynamic = "force-dynamic";
export async function GET(req, { params } // Next 15 Pattern
) {
    try {
        await OpsAuthService.requireSession();
        const { id } = await params;
        const order = await prisma.order.findUnique({
            where: { id },
            include: {
                store: { select: { id: true, name: true, logoUrl: true } },
                customer: { select: { id: true, firstName: true, lastName: true, email: true, phone: true } },
                items: true,
                shipment: true,
                paymentTransactions: { orderBy: { createdAt: "desc" } },
                orderEvents: { orderBy: { createdAt: "desc" } }
            }
        });
        if (!order)
            return NextResponse.json({ error: "Order not found" }, { status: 404 });
        return NextResponse.json({ data: order });
    }
    catch (error) {
        if (error.message === "Unauthorized")
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        console.error("Order detail error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
