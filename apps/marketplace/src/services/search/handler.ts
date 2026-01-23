import { NextRequest, NextResponse } from "next/server";
import { prisma, Prisma } from "@vayva/db";
import {
    ApiResponse,
    ApiErrorCode,
    SearchResponseData,
    SearchResult
} from "@vayva/shared";

/**
 * handleSearch
 * 
 * Boundary-based handler for product search.
 * Decouples Prisma query logic and transformation from the App Router entrypoint.
 */
export async function handleSearch(
    request: NextRequest
): Promise<NextResponse<ApiResponse<SearchResponseData>>> {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get("q")?.toLowerCase();
    const category = searchParams.get("category");
    const mode = searchParams.get("mode");
    const chinaBulkOnly = searchParams.get("chinaBulk") === "true";

    try {
        // Build where clause with proper Prisma types
        const storeFilter: Prisma.StoreWhereInput = {
            isActive: true,
            ...(category && category !== "All" ? { category: category.toLowerCase() } : {}),
            ...(chinaBulkOnly ? { type: "CHINA_SUPPLIER" } : {})
        };

        const where: Prisma.ProductWhereInput = {
            status: "PUBLISHED",
            store: storeFilter,
        };

        // Text search
        if (query) {
            where.OR = [
                { title: { contains: query, mode: "insensitive" } },
                { description: { contains: query, mode: "insensitive" } },
            ];
        }

        // Fetch products with proper typing
        const products = await prisma.product.findMany({
            where,
            take: 20,
            orderBy: { createdAt: "desc" },
            include: {
                productImages: {
                    take: 1,
                    orderBy: { position: "asc" },
                },
                store: {
                    select: {
                        id: true,
                        name: true,
                        slug: true,
                        type: true,
                        verificationLevel: true,
                        category: true,
                    },
                },
                pricingTiers: {
                    orderBy: { minQty: "asc" },
                    take: 1,
                },
            },
        });

        // Transform to search result format
        const results: SearchResult[] = products.map((product) => {
            const basePrice = product.pricingTiers[0]?.unitPrice || product.price;
            const isChinaBulk = product.store.type === "CHINA_SUPPLIER";

            return {
                id: product.id,
                title: product.title,
                price: Number(basePrice),
                currency: "NGN",
                category: product.store.category || "General",
                location: isChinaBulk ? "China (Bulk Import)" : "Lagos, Nigeria",
                image: product.productImages[0]?.url || "/placeholder-product.png",
                mode: (isChinaBulk ? "CHECKOUT" : (mode || "CHECKOUT")) as SearchResult["mode"],
                merchant: {
                    name: product.store.name,
                    isVerified: product.store.verificationLevel !== "NONE",
                },
                isPromoted: false,
                isChinaBulk,
                moq: product.moq,
            };
        });

        return NextResponse.json({
            success: true,
            data: { results },
            meta: {
                total: results.length,
                page: 1,
                limit: 20,
                chinaBulkOnly,
            },
        });
    } catch (error) {
        console.error("Search error:", error);
        return NextResponse.json(
            {
                success: false,
                error: { code: ApiErrorCode.INTERNAL_SERVER_ERROR, message: "Search failed" }
            },
            { status: 500 }
        );
    }
}
