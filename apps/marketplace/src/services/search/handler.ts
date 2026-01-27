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
    const locationFilter = searchParams.get("location"); // Location filter from user

    const page = Math.max(1, Number(searchParams.get("page") || 1) || 1);
    const limit = Math.min(
        48,
        Math.max(8, Number(searchParams.get("limit") || 24) || 24),
    );
    const sort = (searchParams.get("sort") || "new") as
        | "new"
        | "price_asc"
        | "price_desc";

    const minPriceRaw = searchParams.get("minPrice");
    const maxPriceRaw = searchParams.get("maxPrice");
    const minMoqRaw = searchParams.get("minMoq");
    const verifiedOnly = searchParams.get("verified") === "true";

    const minPrice = minPriceRaw ? Number(minPriceRaw) : undefined;
    const maxPrice = maxPriceRaw ? Number(maxPriceRaw) : undefined;
    const minMoq = minMoqRaw ? Number(minMoqRaw) : undefined;

    try {
        // Build where clause with proper Prisma types
        const storeFilter: Prisma.StoreWhereInput = {
            isActive: true,
            isLive: true,
            ...(category && category !== "All" ? { category: category.toLowerCase() } : {}),
            ...(chinaBulkOnly ? { type: "CHINA_SUPPLIER" } : {})
        };

        storeFilter.subscription = {
            status: { in: ["TRIALING", "ACTIVE"] },
        };

        if (verifiedOnly) {
            storeFilter.verificationLevel = { not: "NONE" };
        }

        const where: Prisma.ProductWhereInput = {
            status: "PUBLISHED",
            store: storeFilter,
        };

        if (Number.isFinite(minPrice) || Number.isFinite(maxPrice)) {
            where.price = {
                ...(Number.isFinite(minPrice) ? { gte: minPrice } : {}),
                ...(Number.isFinite(maxPrice) ? { lte: maxPrice } : {}),
            };
        }

        if (Number.isFinite(minMoq)) {
            where.moq = { gte: minMoq };
        }

        // Text search
        if (query) {
            where.OR = [
                { title: { contains: query, mode: "insensitive" } },
                { description: { contains: query, mode: "insensitive" } },
            ];
        }

        const orderBy: Prisma.ProductOrderByWithRelationInput =
            sort === "price_asc"
                ? { price: "asc" }
                : sort === "price_desc"
                    ? { price: "desc" }
                    : { createdAt: "desc" };

        const skip = (page - 1) * limit;

        // Fetch products with proper typing - include store profile for location
        const products = await prisma.product.findMany({
            where,
            skip,
            take: limit + 1,
            orderBy,
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

        // Fetch store profiles for location data (state/city from onboarding)
        const storeIds = [...new Set(products.map(p => p.storeId))];
        const storeProfiles = await prisma.storeProfile.findMany({
            where: { storeId: { in: storeIds } },
            select: { storeId: true, state: true, city: true },
        });
        const profileMap = new Map(storeProfiles.map(p => [p.storeId, p]));

        const hasMore = products.length > limit;
        const slice = hasMore ? products.slice(0, limit) : products;

        const total = await prisma.product.count({ where });

        // Transform to search result format
        // Filter by location if specified (and not "All Nigeria")
        let filteredSlice = slice;
        if (locationFilter && locationFilter !== "All Nigeria") {
            filteredSlice = slice.filter((product) => {
                const profile = profileMap.get(product.storeId);
                // Match by state name
                return profile?.state?.toLowerCase() === locationFilter.toLowerCase();
            });
        }

        const results: SearchResult[] = filteredSlice.map((product) => {
            const basePrice = product.pricingTiers[0]?.unitPrice || product.price;
            const isChinaBulk = product.store.type === "CHINA_SUPPLIER";
            const profile = profileMap.get(product.storeId);
            
            // Build location string from merchant's onboarding data
            let locationStr = "Nigeria";
            if (isChinaBulk) {
                locationStr = "China (Bulk Import)";
            } else if (profile?.city && profile?.state) {
                locationStr = `${profile.city}, ${profile.state}`;
            } else if (profile?.state) {
                locationStr = profile.state;
            } else if (profile?.city) {
                locationStr = profile.city;
            }

            return {
                id: product.id,
                title: product.title,
                price: Number(basePrice),
                currency: "NGN",
                category: product.store.category || "General",
                location: locationStr,
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
                total,
                page,
                limit,
                hasMore,
                sort,
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
