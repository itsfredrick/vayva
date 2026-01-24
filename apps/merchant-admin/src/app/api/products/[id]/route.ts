import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { sanitizeHtml } from "@/lib/security/sanitize";
/**
 * Get a single product by ID
 *
 * @route GET /api/products/[id]
 * @access Private (requires authentication)
 *
 * @param {string} id - Product ID
 *
 * @returns {ProductResponse} Product details
 *
 * @throws {401} Unauthorized - Invalid or missing authentication
 * @throws {404} Not Found - Product not found or not owned by merchant
 * @throws {500} Internal Server Error - Database or server error
 */
export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.id) {
            const errorResponse = {
                error: "Unauthorized",
                message: "Authentication required",
            };
            return NextResponse.json(errorResponse, { status: 401 });
        }
        const { id } = await params;
        // Fetch product verifying store ownership
        const product = await prisma.product.findFirst({
            where: {
                id,
                storeId: session.user.storeId,
            },
            include: {
                productImages: true,
                productVariants: true,
                marketplaceListing: true,
            },
        });
        if (!product) {
            const errorResponse = {
                error: "Product not found",
                message: "Product does not exist or you don't have access to it",
            };
            return NextResponse.json(errorResponse, { status: 404 });
        }
        // Transform to API response format
        const response = {
            id: product.id,
            storeId: product.storeId,
            title: product.title,
            description: product.description,
            handle: product.handle,
            price: Number(product.price),
            compareAtPrice: product.compareAtPrice ? Number(product.compareAtPrice) : null,
            costPrice: product.costPrice ? Number(product.costPrice) : null,
            sku: product.sku,
            barcode: product.barcode,
            trackInventory: product.trackInventory,
            allowBackorder: product.allowBackorder,
            weight: product.weight,
            width: product.width,
            height: product.height,
            depth: product.depth,
            status: product.status,
            productType: product.productType,
            brand: product.brand,
            tags: product.tags,
            seoTitle: product.seoTitle,
            seoDescription: product.seoDescription,
            metadata: product.metadata,
            condition: product.condition,
            warrantyMonths: product.warrantyMonths,
            techSpecs: product.techSpecs,
            moq: product.moq,
            createdAt: product.createdAt.toISOString(),
            updatedAt: product.updatedAt.toISOString(),
        };
        return NextResponse.json(response);
    }
    catch (error: any) {
        console.error("Fetch Product Error:", error);
        const errorResponse = {
            error: "Internal Error",
            message: error instanceof Error ? error.message : "Unknown error",
        };
        return NextResponse.json(errorResponse, { status: 500 });
    }
}
export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }
        const { id } = await params;
        const body = await req.json();
        // Verify ownership first
        const existing = await prisma.product.findFirst({
            where: { id, storeId: session.user.storeId }
        });
        if (!existing) {
            return NextResponse.json({ error: "Product not found" }, { status: 404 });
        }
        const attributes = body.attributes || body.metadata || {};
        // Update Basic Fields
        await prisma.product.update({
            where: { id },
            data: {
                title: body.title || body.name,
                description: body.description ? sanitizeHtml(body.description) : undefined,
                price: body.price ? parseFloat(body.price.toString()) : undefined,
                compareAtPrice: body.compareAtPrice ? parseFloat(body.compareAtPrice.toString()) : null,
                costPrice: body.costPrice ? parseFloat(body.costPrice.toString()) : undefined,
                status: body.status,
                metadata: Object.keys(attributes).length > 0 ? attributes : undefined,
                ...(body.images && {
                    productImages: {
                        deleteMany: {},
                        create: body.images.map((img: any, idx: number) => ({
                            url: img.url,
                            altText: img.altText || img.alt,
                            position: idx,
                        }))
                    }
                }),
            }
        });
        // Handle Variants: Delete removed, Update existing, Create new
        if (body.variants && Array.isArray(body.variants)) {
            const incomingIds = body.variants.map((v: any) => v.id).filter(Boolean);
            await prisma.productVariant.deleteMany({
                where: {
                    productId: id,
                    id: { notIn: incomingIds }
                }
            });
            for (const [idx, v] of body.variants.entries()) {
                const variantData = {
                    title: v.title,
                    options: v.options || {},
                    sku: v.sku,
                    barcode: v.barcode,
                    price: v.price ? parseFloat(v.price.toString()) : 0,
                    compareAtPrice: v.compareAtPrice ? parseFloat(v.compareAtPrice.toString()) : null,
                    trackInventory: v.trackInventory ?? true,
                    position: idx,
                    imageId: v.imageId || null // Link to variant-specific image if provided
                };
                if (v.id) {
                    await prisma.productVariant.update({
                        where: { id: v.id },
                        data: variantData
                    });
                }
                else {
                    await prisma.productVariant.create({
                        data: {
                            ...variantData,
                            productId: id
                        }
                    });
                }
            }
        }
        const finalProduct = await prisma.product.findUnique({
            where: { id },
            include: {
                productImages: { orderBy: { position: 'asc' } },
                productVariants: { orderBy: { position: 'asc' } }
            }
        });
        return NextResponse.json(finalProduct);
    }
    catch (error: any) {
        console.error("Update Product Error:", error);
        return NextResponse.json({ error: "Update Failed" }, { status: 500 });
    }
}
