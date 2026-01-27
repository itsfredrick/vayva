import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

/**
 * POST /api/products/[id]/publish
 * Publish a product to the Vayva Marketplace
 * TEMPORARILY DISABLED - Marketplace coming soon
 */
export async function POST(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    return NextResponse.json(
        { 
            error: "Marketplace Coming Soon",
            message: "The Vayva Marketplace is currently being enhanced. Please check back soon for the new and improved marketplace experience!"
        },
        { status: 503 }
    );
}

/**
 * DELETE /api/products/[id]/publish
 * Unpublish a product from the marketplace
 */
export async function DELETE(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const session = await getServerSession(authOptions);
        if (!session?.user?.storeId) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const storeId = session.user.storeId;

        // Verify product ownership first
        const product = await prisma.product.findFirst({
            where: {
                id,
                storeId,
            },
        });

        if (!product) {
            return NextResponse.json({ error: "Product not found" }, { status: 404 });
        }

        // Find and delete the listing
        const listing = await prisma.marketplaceListing.findFirst({
            where: { productId: id },
        });

        if (!listing) {
            return NextResponse.json({ error: "Listing not found" }, { status: 404 });
        }

        await prisma.marketplaceListing.delete({
            where: { id: listing.id },
        });

        // Update product metadata
        const meta = (product.metadata as any) || {};
        delete meta.marketplaceListingId;
        delete meta.publishedToMarketplace;
        delete meta.publishedAt;

        await prisma.product.update({
            where: { id },
            data: { metadata: meta },
        });

        return NextResponse.json({ success: true });
    } catch (error: any) {
        console.error("DELETE /api/products/[id]/publish error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
