import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

/**
 * GET /api/nightlife/events/[id]
 * Returns a single event with details
 */
export async function GET(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const storeId = session.user.storeId;
        if (!storeId) {
            return NextResponse.json({ error: "No store context" }, { status: 400 });
        }

        const { id } = await params;

        const event = await prisma.product.findFirst({
            where: { id, storeId, productType: "event" },
            include: {
                productImages: { orderBy: { position: "asc" } },
                productVariants: true,
            },
        });

        if (!event) {
            return NextResponse.json({ error: "Event not found" }, { status: 404 });
        }

        // Get ticket sales
        const ticketSales = await prisma.orderItem.groupBy({
            by: ["variantId"],
            where: {
                productId: id,
                order: { status: { in: ["DELIVERED", "PROCESSING"] as any } },
            },
            _sum: { quantity: true, price: true },
        });

        const salesByVariant = new Map(
            ticketSales.map((s) => [s.variantId, { sold: s._sum?.quantity || 0, revenue: Number(s._sum?.price || 0) * (s._sum?.quantity || 0) }])
        );

        const metadata = (event.metadata as any) || {};
        const totalSold = ticketSales.reduce((sum, s) => sum + (s._sum?.quantity || 0), 0);
        const totalRevenue = ticketSales.reduce((sum, s) => sum + (Number(s._sum?.price || 0) * (s._sum?.quantity || 0)), 0);

        return NextResponse.json({
            id: event.id,
            title: event.title,
            description: event.description,
            eventDate: metadata.eventDate,
            eventTime: metadata.eventTime,
            venue: metadata.venue,
            address: metadata.address,
            dressCode: metadata.dressCode,
            ageLimit: metadata.ageLimit,
            musicGenre: metadata.musicGenre,
            images: event.productImages.map((img) => img.url),
            ticketTypes: event.productVariants.map((v: any) => {
                const sales = salesByVariant.get(v.id) || { sold: 0, revenue: 0 };
                return {
                    id: v.id,
                    name: v.title,
                    price: Number(v.price),
                    quantity: v.inventoryQuantity || 0,
                    sold: sales.sold,
                    description: v.sku || "",
                };
            }),
            status: event.status,
            ticketsSold: totalSold,
            revenue: totalRevenue,
        });
    } catch (error: any) {
        console.error("GET /api/nightlife/events/[id] error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

/**
 * PATCH /api/nightlife/events/[id]
 * Updates an event
 */
export async function PATCH(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const storeId = session.user.storeId;
        if (!storeId) {
            return NextResponse.json({ error: "No store context" }, { status: 400 });
        }

        const { id } = await params;
        const body = await req.json();

        // Verify event belongs to store
        const existingEvent = await prisma.product.findFirst({
            where: { id, storeId, productType: "event" },
        });

        if (!existingEvent) {
            return NextResponse.json({ error: "Event not found" }, { status: 404 });
        }

        const {
            title,
            description,
            eventDate,
            eventTime,
            venue,
            address,
            dressCode,
            ageLimit,
            musicGenre,
            images,
            ticketTypes,
        } = body;

        // Update event
        await prisma.product.update({
            where: { id },
            data: {
                title: title || existingEvent.title,
                description: description || existingEvent.description,
                metadata: {
                    ...((existingEvent.metadata as any) || {}),
                    eventDate,
                    eventTime,
                    venue,
                    address,
                    dressCode,
                    ageLimit,
                    musicGenre,
                },
            },
        });

        // Update images if provided
        if (images?.length > 0) {
            // Delete existing images
            await prisma.productImage.deleteMany({ where: { productId: id } });
            // Create new images
            await prisma.productImage.createMany({
                data: images.map((url: string, i: number) => ({
                    productId: id,
                    url,
                    position: i,
                })),
            });
        }

        // Update ticket types (variants)
        if (ticketTypes?.length > 0) {
            for (const ticket of ticketTypes) {
                if (ticket.id) {
                    // Update existing variant
                    await prisma.productVariant.update({
                        where: { id: ticket.id },
                        data: {
                            title: ticket.name,
                            price: ticket.price,
                        },
                    });
                } else {
                    // Create new variant
                    await prisma.productVariant.create({
                        data: {
                            productId: id,
                            title: ticket.name || "Ticket",
                            price: ticket.price || 0,
                            sku: `${title?.substring(0, 3).toUpperCase() || "EVT"}-${ticket.name?.toUpperCase() || "NEW"}`,
                            options: [],
                        },
                    });
                }
            }
        }

        return NextResponse.json({ success: true });
    } catch (error: any) {
        console.error("PATCH /api/nightlife/events/[id] error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

/**
 * DELETE /api/nightlife/events/[id]
 * Deletes an event (only if no tickets sold)
 */
export async function DELETE(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const storeId = session.user.storeId;
        if (!storeId) {
            return NextResponse.json({ error: "No store context" }, { status: 400 });
        }

        const { id } = await params;

        // Verify event belongs to store
        const event = await prisma.product.findFirst({
            where: { id, storeId, productType: "event" },
        });

        if (!event) {
            return NextResponse.json({ error: "Event not found" }, { status: 404 });
        }

        // Check if any tickets sold
        const ticketsSold = await prisma.orderItem.count({
            where: { productId: id },
        });

        if (ticketsSold > 0) {
            return NextResponse.json(
                { error: "Cannot delete event with ticket sales. Archive it instead." },
                { status: 400 }
            );
        }

        // Delete variants first
        await prisma.productVariant.deleteMany({ where: { productId: id } });
        // Delete images
        await prisma.productImage.deleteMany({ where: { productId: id } });
        // Delete event
        await prisma.product.delete({ where: { id } });

        return NextResponse.json({ success: true });
    } catch (error: any) {
        console.error("DELETE /api/nightlife/events/[id] error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
