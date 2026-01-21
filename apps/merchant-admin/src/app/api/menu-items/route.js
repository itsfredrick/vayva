import { NextResponse } from "next/server";
import { withVayvaAPI } from "@/lib/api-handler";
import { PERMISSIONS } from "@/lib/team/permissions";
import { MenuService } from "@/services/MenuService";
export const POST = withVayvaAPI(PERMISSIONS.SETTINGS_EDIT, async (request, { storeId }) => {
    try {
        const data = await request.json();
        const product = await MenuService.createMenuItem(storeId, data);
        return NextResponse.json(product);
    }
    catch (error) {
        return NextResponse.json({ error: error.message }, { status: 400 });
    }
});
