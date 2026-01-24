import { NextResponse } from "next/server";
import { withVayvaAPI } from "@/lib/api-handler";
import { PERMISSIONS } from "@/lib/team/permissions";
import { ProductCoreService } from "@/services/product-core.service";
export const POST = withVayvaAPI(PERMISSIONS.PRODUCTS_MANAGE, async (req, { storeId }) => {
    try {
        const body = await req.json();
        // Delegate to Core Service
        const product = await ProductCoreService.createProduct(storeId, body);
        return NextResponse.json(product);
    }
    catch (error: any) {
        console.error("[PRODUCT_CREATE]", error);
        // Basic error mapping
        const status = error.message.includes("limit") ? 403 : 400;
        return NextResponse.json({ error: error.message || "Failed to create product" }, { status: status > 499 ? 500 : status });
    }
});
