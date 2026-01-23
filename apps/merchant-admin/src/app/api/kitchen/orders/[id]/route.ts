import { NextResponse } from "next/server";
import { withVayvaAPI } from "@/lib/api-handler";
import { PERMISSIONS } from "@/lib/team/permissions";
import { KitchenService } from "@/services/KitchenService";
export const PUT = withVayvaAPI(PERMISSIONS.ORDERS_MANAGE, async (request, { storeId, params }) => {
    try {
        const { id } = await params;
        const { status } = await request.json();
        const updatedOrder = await KitchenService.updateStatus(id, status);
        return NextResponse.json(updatedOrder);
    }
    catch (error) {
        return NextResponse.json({ error: error.message }, { status: 400 });
    }
});
