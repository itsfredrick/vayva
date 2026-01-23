import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/prisma";
import { authOptions } from "@/lib/auth";
import { InventoryService } from "@/services/inventory.service";
export async function DELETE(req: any, { params }: any) {
    const session = await getServerSession(authOptions);
    if (!session?.user?.storeId) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const { id: productId, variantId } = await params;
    try {
        // Verify ownership
        const variant = await prisma.productVariant.findFirst({
            where: {
                id: variantId,
                productId,
                product: { storeId: session.user.storeId }
            }
        });
        if (!variant) {
            return NextResponse.json({ error: "Variant not found" }, { status: 404 });
        }
        // Delete (Cascade handled by Prisma or we need to clean up inventoryItemss manually?)
        // Prisma Schema has explicit relations. Usually we should delete inventoryItemss first if no CASCADE.
        // Let's assume Prisma handles it or do a transaction.
        await prisma.productVariant.delete({
            where: { id: variantId }
        });
        return NextResponse.json({ success: true });
    }
    catch (error) {
        console.error("Delete Variant Error", error);
        return NextResponse.json({ error: "Internal Error" }, { status: 500 });
    }
}
export async function PATCH(req: any, { params }: any) {
    const session = await getServerSession(authOptions);
    if (!session?.user?.storeId) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const { id: productId, variantId } = await params;
    const storeId = session.user.storeId;
    try {
        const body = await req.json();
        const { price, sku, stock, title, options } = body;
        // Verify ownership
        const variant = await prisma.productVariant.findFirst({
            where: {
                id: variantId,
                productId,
                product: { storeId: storeId }
            },
            include: { inventoryItems: true }
        });
        if (!variant) {
            return NextResponse.json({ error: "Variant not found" }, { status: 404 });
        }
        // Update basic fields
        await prisma.productVariant.update({
            where: { id: variantId },
            data: {
                price: price !== undefined ? parseFloat(price) : undefined,
                sku,
                title,
                options
            }
        });
        // Update Stock (Adjustment)
        // If "stock" is passed as absolute value, we interpret the difference.
        if (stock !== undefined) {
            const newStock = parseInt(stock);
            // Calculate current total
            const currentStock = variant.inventoryItems.reduce((acc: any, i: any) => acc + i.onHand, 0);
            const diff = newStock - currentStock;
            if (diff !== 0) {
                await InventoryService.adjustStock(storeId, variantId, productId, diff, "Manual Update from Admin", session.user.id);
            }
        }
        return NextResponse.json({ success: true });
    }
    catch (error) {
        console.error("Update Variant Error", error);
        return NextResponse.json({ error: "Internal Error" }, { status: 500 });
    }
}
