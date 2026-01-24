import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
export async function GET(req: any, { params }: any) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.storeId) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }
        const { id: productId } = await params;
        // Fetch movements linked to variants of this product
        // InventoryMovement has 'variantId'.
        // We need to find all variants of this product first.
        const variants = await prisma.productVariant.findMany({
            where: { productId },
            select: { id: true, title: true }
        });
        const variantIds = variants.map(v => v.id);
        const movements = await prisma.inventoryMovement.findMany({
            where: {
                storeId: session.user.storeId,
                variantId: { in: variantIds }
            },
            orderBy: { createdAt: 'desc' },
            take: 50,
            include: {
                inventoryLocation: true,
                // We might want performedBy user info, but schema has string?
            }
        });
        // Enhance with variant names
        const enriched = movements.map(m => ({
            ...m,
            variantName: variants.find(v => v.id === m.variantId)?.title || "Unknown Variant"
        }));
        return NextResponse.json(enriched);
    }
    catch (error: any) {
        console.error("Inventory History Error:", error);
        return NextResponse.json({ error: "Internal Error" }, { status: 500 });
    }
}
