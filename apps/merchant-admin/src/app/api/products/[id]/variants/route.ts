
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/prisma"; // Adjust path if necessary
import { InventoryService } from "@/services/inventory.service";
import { authOptions } from "@/lib/auth"; // Adjust if authOptions is elsewhere

export async function GET(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    // 1. Auth check
    const session = await getServerSession(authOptions);
    if (!session?.user?.storeId) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id: productId } = await params;

    try {
        const variants = await prisma.productVariant.findMany({
            where: {
                productId,
                product: { storeId: session.user.storeId } // Ensure ownership
            },
            include: {
                inventoryItems: true, // Include stock levels
                productImage: true // Include variant image
            },
            orderBy: {
                position: 'asc'
            }
        });

        // Normalize data for frontend
        const normalized = variants.map(v => ({
            id: v.id,
            title: v.title,
            sku: v.sku,
            price: v.price?.toString(),
            options: v.options, // Ensure JSON is handled
            inventory: v.inventoryItems.reduce((acc, item) => acc + item.onHand, 0), // Sum across locations?
            imageId: v.imageId,
            imageUrl: (v as unknown).productImages?.url
        }));

        return NextResponse.json(normalized);
    } catch (error) {
        console.error("Fetch Variants Error", error);
        return NextResponse.json({ error: "Internal Error" }, { status: 500 });
    }
}

export async function POST(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const session = await getServerSession(authOptions);
    if (!session?.user?.storeId) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id: productId } = await params;
    const storeId = session.user.storeId;

    try {
        const body = await req.json();
        const { title, options, price, sku, stock, imageId } = body;

        // Validation
        if (!title || !options) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        // Create Variant
        const variant = await prisma.productVariant.create({
            data: {
                productId,
                title,
                options, // JSON
                price: price ? parseFloat(price) : 0,
                sku,
                imageId: imageId || null // Link to productImages if provided
            },
            include: {
                productImage: true // Return image data
            }
        });

        // Initialize Inventory if stock provided
        if (stock !== undefined && stock !== null) {
            const qty = parseInt(stock);
            if (!isNaN(qty)) {
                await InventoryService.adjustStock(
                    storeId,
                    variant.id,
                    productId,
                    qty,
                    "Initial Stock",
                    session.user.id
                );
            }
        }

        return NextResponse.json({ success: true, variant });

    } catch (error) {
        console.error("Create Variant Error", error);
        return NextResponse.json({ error: "Internal Error" }, { status: 500 });
    }
}
