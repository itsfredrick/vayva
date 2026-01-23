import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/session";
import { authorizeAction, AppRole } from "@/lib/permissions";
import { logAuditEvent, AuditEventType } from "@/lib/audit";
import { OrderStateService } from "@/services/order-state.service";
export async function POST(request: any) {
    try {
        const user = await getSessionUser();
        if (!user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }
        // Permission Check
        const authError = await authorizeAction(user || undefined, AppRole.STAFF);
        if (authError)
            return authError;
        const body = await request.json();
        const { ids, status } = body;
        if (!ids || !Array.isArray(ids) || ids.length === 0 || !status) {
            return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
        }
        // Verify status validity
        if (!status)
            return NextResponse.json({ error: "Invalid status" }, { status: 400 });
        let successCount = 0;
        const errors = [];
        // Process each order individually to ensure state rules & notifications trigger
        await Promise.all(ids.map(async (id: any) => {
            try {
                await OrderStateService.transition(id, status, user.id, user.storeId);
                successCount++;
            }
            catch (error) {
                console.error(`Failed to update order ${id}`, error);
                errors.push({ id, error: error.message });
            }
        }));
        // Audit Log
        await logAuditEvent(user.storeId, user.id, AuditEventType.ORDER_BULK_STATUS_CHANGED, {
            targetType: "ORDER_BATCH",
            targetId: "bulk-update",
            meta: {
                requested: ids.length,
                success: successCount,
                toStatus: status,
                errors
            }
        });
        return NextResponse.json({ success: true, count: ids.length });
    }
    catch (error) {
        console.error("Bulk Update Error:", error);
        return NextResponse.json({ error: "Failed to update orders" }, { status: 500 });
    }
}
