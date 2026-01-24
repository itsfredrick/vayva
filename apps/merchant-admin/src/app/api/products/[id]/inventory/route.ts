import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/prisma";
import { authOptions } from "@/lib/auth";
export async function GET(req: any, { params }: any) {
    const session = await getServerSession(authOptions);
    if (!session?.user?.storeId) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const { id: productId } = await params;
    // Optional: filter by variantId if query param exists
    const url = new URL(req.url);
    const variantId = url.searchParams.get("variantId");
    try {
        const movements = await prisma.inventoryMovement.findMany({
            where: {
                storeId: session.user.storeId,
            },
            include: {
                inventoryLocation: true,
                // We need to fetch Variant title too.
                // But Movement is linked to Variant via foreign key, not Relation name?
            },
            orderBy: { createdAt: "desc" },
            take: 50 // Limit history
        });
        // Wait, schema check.
        // InventoryMovement: storeId, locationId, variantId.
        // To filter by Product, we must find all variants for product, then find movements for those variants.
        let targetVariantIds = [];
        if (variantId) {
            targetVariantIds = [variantId];
        }
        else {
            const variants = await prisma.productVariant.findMany({
                where: { productId },
                select: { id: true }
            });
            targetVariantIds = variants.map(v => v.id);
        }
        const history = await prisma.inventoryMovement.findMany({
            where: {
                storeId: session.user.storeId,
                variantId: { in: targetVariantIds }
            },
            include: {
                inventoryLocation: true,
                // We might want variant details (title)
            },
            orderBy: { createdAt: "desc" },
            take: 50
        });
        // Enrich with variant names manually or via another include if Variant relation exists
        // Schema: InventoryMovement does not seem to have 'productVariants' relation defined in `schema.prisma` snippet I read earlier?
        // Let's assume we can fetch variant info separately or if relation exists.
        // I'll fetch variant map.
        const variantMap = await prisma.productVariant.findMany({
            where: { id: { in: targetVariantIds } },
            select: { id: true, title: true }
        });
        const vMap = Object.fromEntries(variantMap.map(v => [v.id, v.title]));
        const enriched = history.map(h => ({
            ...h,
            variantTitle: vMap[h.variantId] || "Unknown Variant"
        }));
        return NextResponse.json(enriched);
    }
    catch (error: any) {
        console.error("Fetch Inventory History Error", error);
        return NextResponse.json({ error: "Internal Error" }, { status: 500 });
    }
}
