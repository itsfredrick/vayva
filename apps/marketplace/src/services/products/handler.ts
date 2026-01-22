import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import {
    ApiResponse,
    ApiErrorCode,
    RouteContext,
    ProductResponseData
} from "@vayva/shared";

/**
 * handleGetProduct
 * 
 * Boundary-based handler for fetching a single product.
 * Separates query logic from the App Router props/params glue code.
 */
export async function handleGetProduct(
    _request: Request,
    context: RouteContext<{ id: string }>
): Promise<NextResponse<ApiResponse<ProductResponseData>>> {
    try {
        const { id } = await context.params;
        const product = await prisma.product.findUnique({
            where: { id },
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
        });

        if (!product) {
            return NextResponse.json(
                {
                    success: false,
                    error: { code: ApiErrorCode.NOT_FOUND, message: "Product not found" }
                },
                { status: 404 }
            );
        }

        return NextResponse.json({
            success: true,
            data: { product: product as unknown as Record<string, unknown> }
        });
    } catch (error: unknown) {
        console.error("[PRODUCT_GET]", error);
        return NextResponse.json(
            {
                success: false,
                error: {
                    code: ApiErrorCode.INTERNAL_SERVER_ERROR,
                    message: "Internal Server Error"
                }
            },
            { status: 500 }
        );
    }
}
