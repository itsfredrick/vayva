import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

/**
 * GET /api/quotes
 * List all B2B quotes for the store
 */
export async function GET(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.storeId) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { searchParams } = new URL(req.url);
        const status = searchParams.get("status");

        // Quotes are stored as bookings with type: "quote_request" in metadata
        const quotes = await prisma.booking.findMany({
            where: {
                storeId: session.user.storeId,
                metadata: {
                    path: ["type"],
                    equals: "quote_request",
                },
                ...(status && { status: status as any }),
            },
            orderBy: { createdAt: "desc" },
        });

        return NextResponse.json({
            quotes: quotes.map((q: any) => {
                const meta = q.metadata as any;
                return {
                    id: q.id,
                    quoteNumber: meta?.quoteNumber || q.id.slice(0, 8).toUpperCase(),
                    companyName: meta?.companyName || "Unknown",
                    contactName: meta?.contactName || "",
                    contactEmail: meta?.contactEmail || "",
                    contactPhone: meta?.contactPhone || "",
                    items: meta?.items || [],
                    total: meta?.total || 0,
                    status: q.status,
                    notes: q.notes,
                    validUntil: q.endsAt,
                    createdAt: q.createdAt,
                };
            }),
            total: quotes.length,
        });
    } catch (error: any) {
        console.error("GET /api/quotes error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

/**
 * POST /api/quotes
 * Create a new B2B quote
 */
export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.storeId) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const body = await req.json();
        const {
            companyName,
            contactName,
            contactEmail,
            contactPhone,
            items,
            notes,
            validDays,
        } = body;

        if (!companyName || !items?.length) {
            return NextResponse.json(
                { error: "Company name and items are required" },
                { status: 400 }
            );
        }

        // Calculate total from items
        let total = 0;
        const quoteItems = [];

        for (const item of items) {
            const product = await prisma.product.findFirst({
                where: { id: item.productId, storeId: session.user.storeId },
            });

            if (product) {
                // Check for tiered pricing
                const pricingTiers = await prisma.pricingTier.findMany({
                    where: { productId: product.id },
                    orderBy: { minQty: "asc" },
                });

                let unitPrice = Number(product.price);
                for (const tier of pricingTiers) {
                    if (item.quantity >= tier.minQty) {
                        unitPrice = Number(tier.unitPrice);
                    }
                }

                const lineTotal = unitPrice * item.quantity;
                total += lineTotal;

                quoteItems.push({
                    productId: product.id,
                    name: product.title,
                    quantity: item.quantity,
                    unitPrice,
                    lineTotal,
                });
            }
        }

        const quoteNumber = `QT-${Date.now().toString(36).toUpperCase()}`;
        const validUntil = new Date();
        validUntil.setDate(validUntil.getDate() + (validDays || 30));

        const quote = await prisma.booking.create({
            data: {
                storeId: session.user.storeId,
                serviceId: quoteItems[0]?.productId || "",
                startsAt: new Date(),
                endsAt: validUntil,
                status: "PENDING",
                notes: notes || "",
                metadata: {
                    type: "quote_request",
                    quoteNumber,
                    companyName,
                    contactName,
                    contactEmail,
                    contactPhone,
                    items: quoteItems,
                    total,
                    source: "dashboard",
                },
            },
        });

        return NextResponse.json({
            quote: {
                id: quote.id,
                quoteNumber,
                companyName,
                items: quoteItems,
                total,
                validUntil,
                status: quote.status,
            },
        }, { status: 201 });
    } catch (error: any) {
        console.error("POST /api/quotes error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
