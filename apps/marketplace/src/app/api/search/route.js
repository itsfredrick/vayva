import { NextResponse } from "next/server";
import { prisma } from "@vayva/db";
export async function GET(request) {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get("q")?.toLowerCase();
    const category = searchParams.get("category");
    const mode = searchParams.get("mode");
    const chinaBulkOnly = searchParams.get("chinaBulk") === "true";
    try {
        // Build where clause
        const where = {
            status: "PUBLISHED",
            store: {
                isActive: true,
            },
        };
        // Text search
        if (query) {
            where.OR = [
                { title: { contains: query, mode: "insensitive" } },
                { description: { contains: query, mode: "insensitive" } },
            ];
        }
        // Category filter (using Store category as proxy)
        if (category && category !== "All") {
            where.store = {
                ...where.store,
                category: category.toLowerCase(),
            };
        }
        // China Bulk filter
        if (chinaBulkOnly) {
            where.store = {
                ...where.store,
                type: "CHINA_SUPPLIER",
            };
        }
        // Fetch products
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
        }); // Cast to any to bypass complex inclusion inference issues
        // Transform to search result format
        const results = products.map((product) => {
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
                mode: isChinaBulk ? "CHECKOUT" : (mode || "CHECKOUT"),
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
            results,
            metadata: {
                total: results.length,
                page: 1,
                limit: 20,
                chinaBulkOnly,
            },
        });
    }
    catch (error) {
        console.error("Search error:", error);
        return NextResponse.json({ results: [], metadata: { total: 0, page: 1, limit: 20 } }, { status: 500 });
    }
}
