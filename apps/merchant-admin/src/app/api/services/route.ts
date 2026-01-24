import { NextResponse } from "next/server";
import { withVayvaAPI } from "@/lib/api-handler";
import { PERMISSIONS } from "@/lib/team/permissions";
import { BookingService } from "@/services/BookingService";
// Create new Service (Product)
export const POST = withVayvaAPI(PERMISSIONS.SETTINGS_EDIT, async (request, { storeId }) => {
    try {
        const data = await request.json();
        const product = await BookingService.createServiceProduct(storeId, data);
        return NextResponse.json(product);
    }
    catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 400 });
    }
});
