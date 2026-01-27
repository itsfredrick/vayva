import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

/**
 * GET /api/nightlife/events
 * Returns all nightlife events for the store
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

        // Get events (stored as products with productType = 'event')
        const events = await prisma.product.findMany({
            where: { storeId, productType: "event" },
            include: {
                productImages: {
                    orderBy: { position: "asc" },
                    take: 1,
                },
                productVariants: true, // Ticket types stored as variants
            },
            orderBy: { createdAt: "desc" },
        });

        // Get ticket sales for each event
        const eventIds = events.map((e) => e.id);
        const ticketSales = await prisma.orderItem.groupBy({
            by: ["productId"],
            where: {
                productId: { in: eventIds },
                order: { status: { in: ["DELIVERED", "PROCESSING"] as any } },
            },
            _sum: { quantity: true },
        });

        const salesMap = new Map(ticketSales.map((s) => [s.productId, s._sum?.quantity || 0]));

        const formattedEvents = events.map((event: any) => {
            const metadata = event.metadata || {};
            const eventDate = new Date(metadata.eventDate || event.createdAt);
            const now = new Date();
            
            let status = event.status;
            if (eventDate < now) status = "PAST";

            return {
                id: event.id,
                title: event.title,
                description: event.description,
                eventDate: metadata.eventDate || event.createdAt,
                eventTime: metadata.eventTime || "22:00",
                venue: metadata.venue || "TBD",
                image: event.productImages?.[0]?.url || null,
                ticketsSold: salesMap.get(event.id) || 0,
                ticketTypes: event.productVariants.map((v: any) => ({
                    name: v.title,
                    price: Number(v.price),
                    available: v.inventoryQuantity || 0,
                })),
                status,
            };
        });

        return NextResponse.json(formattedEvents);
    } catch (error: any) {
        console.error("GET /api/nightlife/events error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

/**
 * POST /api/nightlife/events
 * Creates a new nightlife event
 */
export async function POST(req: Request) {
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

        if (!title || !eventDate || !eventTime || !venue) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        // Create event as a product
        const event = await prisma.product.create({
            data: {
                storeId,
                title,
                description: description || "",
                handle: `${title.toLowerCase().replace(/\s+/g, "-")}-${Date.now()}`,
                productType: "event",
                status: "ACTIVE",
                price: ticketTypes?.[0]?.price || 0,
                metadata: {
                    eventDate,
                    eventTime,
                    venue,
                    address,
                    dressCode,
                    ageLimit,
                    musicGenre,
                },
                productImages: images?.length > 0 ? {
                    create: images.map((url: string, i: number) => ({
                        url,
                        position: i,
                    })),
                } : undefined,
                productVariants: ticketTypes?.length > 0 ? {
                    create: ticketTypes.map((t: any, i: number) => ({
                        title: t.name || `Ticket ${i + 1}`,
                        price: t.price || 0,
                        sku: `${title.substring(0, 3).toUpperCase()}-${t.name?.toUpperCase() || i}`,
                        inventoryQuantity: t.quantity || 100,
                    })),
                } : undefined,
            },
        });

        return NextResponse.json({ success: true, id: event.id });
    } catch (error: any) {
        console.error("POST /api/nightlife/events error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
