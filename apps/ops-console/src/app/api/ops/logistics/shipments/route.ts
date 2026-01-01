
import { NextRequest, NextResponse } from "next/server";
import { OpsAuthService } from "@/lib/ops-auth";
import { prisma } from "@vayva/db";

export async function PATCH(req: NextRequest) {
    try {
        const { user } = await OpsAuthService.requireSession();
        // Perms: Owners/Admins
        if (!["OPS_OWNER", "OPS_ADMIN"].includes(user.role)) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
        }

        const body = await req.json();
        const { shipmentId, status, note } = body;

        if (!shipmentId || !status) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        // Validate Status
        const ALLOWED_STATUSES = ["DELIVERED", "FAILED", "CANCELED", "IN_TRANSIT", "PICKED_UP"];
        if (!ALLOWED_STATUSES.includes(status)) {
            return NextResponse.json({ error: "Invalid status" }, { status: 400 });
        }

        const shipment = await prisma.shipment.update({
            where: { id: shipmentId },
            data: { status }
        });

        await OpsAuthService.logEvent(user.id, "SHIPMENT_FORCE_UPDATE", {
            shipmentId,
            status,
            note
        });

        return NextResponse.json({ success: true, shipment });

    } catch (error) {
        console.error("Update Shipment Error:", error);
        return NextResponse.json({ error: "Failed to update shipment" }, { status: 500 });
    }
}
