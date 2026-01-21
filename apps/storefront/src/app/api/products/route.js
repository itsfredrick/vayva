import { NextResponse } from "next/server";
import { prisma } from "@vayva/db";
export async function GET(request) {
    const { searchParams } = new URL(request.url);
    const storeId = searchParams.get("storeId");
    if (!storeId) {
        return NextResponse.json({ error: "Store ID is required" }, { status: 400 });
    }
    try {
        const products = await prisma.product.findMany({
            where: { storeId: storeId },
            include: {
                productImages: true,
            },
        });
        // Transform to PublicProduct format with explicit typing
        const publicProducts = products.map((p) => ({
            id: p.id,
            storeId: p.storeId,
            name: p.title,
            description: p.description || "",
            price: Number(p.price),
            compareAtPrice: p.compareAtPrice ? Number(p.compareAtPrice) : undefined,
            // Explicitly cast the image map to avoid implicit any errors on 'a', 'b', 'img'
            images: p.productImages?.sort((a, b) => a.position - b.position).map((img) => img.url) || [],
            variants: [],
            inStock: true,
            handle: p.handle,
            type: "physical",
        }));
        return NextResponse.json(publicProducts);
    }
    catch (error) {
        console.error("Failed to fetch products:", error);
        return NextResponse.json({ error: "Failed to fetch products" }, { status: 500 });
    }
}
