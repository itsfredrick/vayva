import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

/**
 * GET /api/storefront/showcase
 * Returns the current showcase configuration and available products for selection
 */
export async function GET() {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }
        const storeId = session.user.storeId;
        if (!storeId) {
            return NextResponse.json({ error: "No store context" }, { status: 400 });
        }

        // Get current draft's section config
        const draft = await prisma.storefrontDraft.findUnique({
            where: { storeId },
            select: { sectionConfig: true },
        });

        const sectionConfig = (draft?.sectionConfig as any) || {};
        const showcaseConfig = sectionConfig.featured || {
            mode: "auto", // "auto" | "manual"
            autoStrategy: "newest", // "newest" | "bestselling" | "random" | "discounted"
            limit: 8,
            productIds: [], // For manual mode
        };

        // Get all active products for manual selection
        const products = await prisma.product.findMany({
            where: { storeId, status: "ACTIVE" },
            orderBy: { createdAt: "desc" },
            take: 100,
            select: {
                id: true,
                title: true,
                price: true,
                productImages: {
                    orderBy: { position: "asc" },
                    take: 1,
                    select: { url: true },
                },
            },
        });

        const formattedProducts = products.map((p) => ({
            id: p.id,
            name: p.title,
            price: Number(p.price),
            image: p.productImages?.[0]?.url || "",
        }));

        return NextResponse.json({
            config: showcaseConfig,
            availableProducts: formattedProducts,
        });
    } catch (error: any) {
        console.error("GET /api/storefront/showcase error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

/**
 * PATCH /api/storefront/showcase
 * Updates the showcase configuration
 */
export async function PATCH(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }
        const storeId = session.user.storeId;
        if (!storeId) {
            return NextResponse.json({ error: "No store context" }, { status: 400 });
        }

        const body = await req.json();
        const { mode, autoStrategy, limit, productIds } = body;

        // Get current draft
        const draft = await prisma.storefrontDraft.findUnique({
            where: { storeId },
            select: { sectionConfig: true },
        });

        const currentSectionConfig = (draft?.sectionConfig as any) || {};
        
        // Update featured section config
        const updatedSectionConfig = {
            ...currentSectionConfig,
            featured: {
                mode: mode || currentSectionConfig.featured?.mode || "auto",
                autoStrategy: autoStrategy || currentSectionConfig.featured?.autoStrategy || "newest",
                limit: limit ?? currentSectionConfig.featured?.limit ?? 8,
                productIds: productIds || currentSectionConfig.featured?.productIds || [],
            },
        };

        // Save to draft
        await prisma.storefrontDraft.update({
            where: { storeId },
            data: { sectionConfig: updatedSectionConfig },
        });

        return NextResponse.json({ success: true, config: updatedSectionConfig.featured });
    } catch (error: any) {
        console.error("PATCH /api/storefront/showcase error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
