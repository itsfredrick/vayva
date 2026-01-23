import { NextResponse } from "next/server";
import { withVayvaAPI } from "@/lib/api-handler";
import { PERMISSIONS } from "@/lib/team/permissions";
import { ProductCoreService } from "@/services/product-core.service";
const ALLOWED_TYPES = [
    "service",
    "campaign",
    "listing",
    "course",
    "post",
    "stay",
    "event",
    "digital_asset",
    "menu_item",
    "project",
    "vehicle",
    "lead",
];
export const POST = withVayvaAPI(PERMISSIONS.PRODUCTS_MANAGE, async (req, { storeId }) => {
    try {
        const body = await req.json();
        const { primaryObject, data } = body;
        if (!primaryObject || !ALLOWED_TYPES.includes(primaryObject)) {
            return NextResponse.json({ error: "Invalid resource type" }, { status: 400 });
        }
        // Map Generic Resource Payload to Product Service Payload
        // We pass 'primaryObject' as 'productType'
        const payload = {
            ...data,
            productType: primaryObject,
            // Defaulting title/name mapping if needed, but Service checks for title/name
        };
        const product = await ProductCoreService.createProduct(storeId, payload);
        return NextResponse.json({ success: true, id: product.id });
    }
    catch (error) {
        console.error("[RESOURCE_CREATE]", error);
        const status = error.message.includes("limit") ? 403 : 400;
        return NextResponse.json({ error: error.message || "Internal Server Error" }, { status: status > 499 ? 500 : status });
    }
});
