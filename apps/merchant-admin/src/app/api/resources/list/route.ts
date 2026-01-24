import { NextResponse } from "next/server";
import { prisma } from "@vayva/db";
import { withVayvaAPI } from "@/lib/api-handler";
import { PERMISSIONS } from "@/lib/team/permissions";
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
export const GET = withVayvaAPI(PERMISSIONS.PRODUCTS_VIEW, async (req, { storeId }) => {
    try {
        const { searchParams } = new URL(req.url);
        const type = searchParams.get("type");
        if (!type || !ALLOWED_TYPES.includes(type)) {
            return NextResponse.json({ error: "Invalid or missing resource type" }, { status: 400 });
        }
        const resources = await prisma.product.findMany({
            where: {
                storeId,
                productType: type
            },
            include: {
                productImages: {
                    orderBy: { position: 'asc' },
                    take: 1
                }
            },
            orderBy: { updatedAt: 'desc' }
        });
        const mapped = resources.map((r: any) => ({
            id: r.id,
            name: r.title, // ResourceListPage expects 'name'
            title: r.title,
            price: Number(r.price),
            image: r.productImages?.[0]?.url || null,
            status: r.status // DRAFT/ACTIVE
        }));
        return NextResponse.json(mapped);
    }
    catch (error: any) {
        console.error("[RESOURCE_LIST]", error);
        return NextResponse.json({ error: "Internal Error" }, { status: 500 });
    }
});
