import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { withVayvaAPI, APIContext } from "@/lib/api-handler";
import { PERMISSIONS } from "@/lib/team/permissions";
import { logAuditEvent, AuditEventType } from "@/lib/audit";
import { sanitizeText, sanitizeHtml, sanitizeNumber, sanitizeUrl } from "@/lib/input-sanitization";
export const GET = withVayvaAPI(PERMISSIONS.COMMERCE_VIEW, async (request: NextRequest, { storeId }: APIContext) => {
    try {
        const { searchParams } = new URL(request.url);
        // Parse query parameters with ProductListRequest type
        const status = searchParams.get("status");
        const limit = parseInt(searchParams.get("limit") || "50");
        const offset = parseInt(searchParams.get("offset") || "0");
        // Build where clause with proper typing
        const where: any= { storeId };
        if (status && status !== 'ALL') {
            where.status = status;
        }
        const [products, total] = await Promise.all([
            prisma.product.findMany({
                where,
                orderBy: { createdAt: "desc" },
                take: limit,
                skip: offset,
                include: {
                    inventoryItems: true
                }
            }),
            prisma.product.count({ where })
        ]);
        const formattedProducts = products.map((product: any) => {
            const totalQuantity = product.inventoryItems?.reduce((sum: number, item: any) => sum + item.available, 0) || 0;
            return {
                id: product.id,
                merchantId: product.storeId,
                type: "RETAIL",
                name: product.title,
                description: product.description || "",
                price: Number(product.price),
                currency: "NGN",
                status: product.status,
                inventory: {
                    enabled: product.trackInventory,
                    quantity: totalQuantity,
                },
                itemsSold: 0,
                createdAt: product.createdAt.toISOString(),
            };
        });
        return NextResponse.json({
            data: formattedProducts,
            meta: {
                total,
                limit,
                offset
            }
        });
    }
    catch (error: any) {
        console.error("Fetch Products Error:", error);
        return NextResponse.json({ error: "Failed to fetch products" }, { status: 500 });
    }
});
export const POST = withVayvaAPI(PERMISSIONS.COMMERCE_MANAGE, async (request: NextRequest, { storeId, user }: APIContext) => {
    try {
        const userId = user.id;
        const body = await request.json();
        // Comprehensive input sanitization
        const sanitizedTitle = sanitizeText(body.title || '');
        const sanitizedDescription = sanitizeHtml(body.description || "");
        const sanitizedPrice = sanitizeNumber(body.price || 0, { min: 0, max: 100000000, decimals: 2 });
        const sanitizedSku = body.sku ? sanitizeText(body.sku) : undefined;
        // Validate required fields
        if (!sanitizedTitle || !sanitizedPrice) {
            return NextResponse.json({ error: "Product title and price are required" }, { status: 400 });
        }
        // Sanitize images if provided
        const sanitizedImages = (body.metadata as any)?.images?.map((img: any) => ({
            url: sanitizeUrl(img.url) || "",
            position: sanitizeNumber(img.position, { min: 0, max: 100 }) || 0
        })).filter((img: any) => img.url) || [];
        const product = await prisma.product.create({
            data: {
                storeId,
                title: sanitizedTitle,
                description: sanitizedDescription,
                handle: body.handle ? sanitizeText(body.handle) :
                    (sanitizedTitle.toLowerCase().replace(/[^a-z0-9]+/g, "-") +
                        "-" +
                        Math.random().toString(36).substring(2, 7)),
                price: sanitizedPrice,
                status: body.status === "ACTIVE" || body.status === "DRAFT" ? body.status : "DRAFT",
                productType: body.productType ? sanitizeText(body.productType) : undefined,
                sku: sanitizedSku,
                trackInventory: body.trackInventory ?? true,
                productImages: sanitizedImages.length > 0 ? {
                    create: sanitizedImages
                } : undefined,
            },
            include: {
                productImages: true,
            }
        });
        // Audit Log
        await logAuditEvent(storeId, userId, AuditEventType.PRODUCT_CREATED, {
            targetType: "PRODUCT",
            targetId: product.id,
            meta: {
                name: product.title,
                price: Number(product.price),
            }
        });
        return NextResponse.json(product);
    }
    catch (error: any) {
        console.error("Create Product Error:", error);
        return NextResponse.json({ error: "Failed to create product" }, { status: 500 });
    }
});
