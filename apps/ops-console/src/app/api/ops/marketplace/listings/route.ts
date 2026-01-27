import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@vayva/db";
import { OpsAuthService } from "@/lib/ops-auth";

export async function GET(req: NextRequest) {
    await OpsAuthService.requireSession();

    try {
        const { searchParams } = new URL(req.url);
        const status = searchParams.get("status") || "PENDING_REVIEW";

        const listings = await prisma.marketplaceListing.findMany({
            where: {
                status: status as any,
            },
            include: {
                product: {
                    select: {
                        id: true,
                        title: true,
                        description: true,
                        price: true,
                        store: {
                            select: {
                                id: true,
                                name: true,
                                slug: true,
                            }
                        },
                        productImages: {
                            take: 1,
                            select: { url: true }
                        }
                    }
                },
            },
            orderBy: { createdAt: "desc" },
            take: 100,
        });

        // Transform to match frontend interface
        const transformedListings = listings.map((listing) => ({
            id: listing.id,
            title: listing.product?.title || "Untitled",
            description: listing.product?.description || "",
            price: Number(listing.product?.price || 0),
            category: listing.category || "General",
            status: listing.status,
            createdAt: listing.createdAt.toISOString(),
            product: {
                id: listing.product?.id || "",
                title: listing.product?.title || "Untitled",
                images: listing.product?.productImages || []
            },
            store: {
                id: listing.product?.store?.id || "",
                name: listing.product?.store?.name || "Unknown",
                slug: listing.product?.store?.slug || "",
            }
        }));

        return NextResponse.json({
            listings: transformedListings,
            total: transformedListings.length
        });
    } catch (error: any) {
        console.error("Marketplace listings error:", error);
        return NextResponse.json({ error: "Failed to fetch listings" }, { status: 500 });
    }
}
