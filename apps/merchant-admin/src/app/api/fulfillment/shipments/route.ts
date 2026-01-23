import { NextResponse } from "next/server";
import { prisma } from "@vayva/db";
import { withVayvaAPI } from "@/lib/api-handler";
import { PERMISSIONS } from "@/lib/team/permissions";
export const GET = withVayvaAPI(PERMISSIONS.FULFILLMENT_VIEW, async (req, { storeId }) => {
    try {
        const { searchParams } = new URL(req.url);
        const statusFilter = searchParams.get("status");
        const isIssue = searchParams.get("issue") === "true";
        const where = { storeId };
        if (isIssue) {
            where.status = { in: ["FAILED", "EXCEPTION", "RETURNED", "RETURN_REQUESTED"] };
        }
        else if (statusFilter && statusFilter !== "ALL") {
            where.status = statusFilter;
        }
        const shipments = await prisma.shipment.findMany({
            where,
            include: {
                order: {
                    select: { orderNumber: true, customerId: true }
                }
            },
            orderBy: { updatedAt: "desc" },
            take: 50
        });
        const formatted = shipments.map((shipment) => ({
            id: shipment.id,
            orderId: shipment.orderId,
            orderNumber: shipment.order?.orderNumber || "Unknown",
            status: shipment.status,
            provider: shipment.provider,
            trackingCode: shipment.trackingCode,
            trackingUrl: shipment.trackingUrl,
            courierName: shipment.courierName,
            recipientName: shipment.recipientName,
            updatedAt: shipment.updatedAt,
        }));
        return NextResponse.json({ success: true, data: formatted });
    }
    catch (error) {
        console.error("Shipments API Error:", error);
        return NextResponse.json({ error: "Failed to fetch shipments" }, { status: 500 });
    }
});
