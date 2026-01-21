import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(
    request: Request,
    context: { params: Promise<{ id: string }> }
) {
    try {
        const params = await context.params;
        const product = await prisma.product.findUnique({
            where: { id: params.id },
            include: {
                productImages: {
                    orderBy: { position: "asc" }
                },
                productVariants: {
                    include: {
                        productImage: true
                    },
                    orderBy: { position: "asc" }
                },
                pricingTiers: {
                    orderBy: { minQty: "asc" }
                },
                store: {
                    include: {
                        deliverySettings: true
                    }
                }
            }
        }) as any;

        if (!product) {
            return NextResponse.json({ error: "Product not found" }, { status: 404 });
        }

        return NextResponse.json(product);
    } catch (error) {
        console.error("[PRODUCT_GET]", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
