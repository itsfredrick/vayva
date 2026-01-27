import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

/**
 * GET /api/nightlife/tickets
 * Returns ticket orders for nightlife events
 */
export async function GET(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const storeId = session.user.storeId;
        if (!storeId) {
            return NextResponse.json({ error: "No store context" }, { status: 400 });
        }

        const { searchParams } = new URL(req.url);
        const filter = searchParams.get("filter") || "all";

        // Get all event products
        const events = await prisma.product.findMany({
            where: { storeId, productType: "event" },
            select: { id: true, title: true, metadata: true },
        });

        const eventIds = events.map((e) => e.id);
        const eventMap = new Map(events.map((e) => [e.id, e]));

        if (eventIds.length === 0) {
            return NextResponse.json([]);
        }

        // Build order status filter
        let statusFilter: any = {};
        switch (filter) {
            case "paid":
                statusFilter = { status: { in: ["COMPLETED", "PROCESSING"] } };
                break;
            case "used":
                statusFilter = { metadata: { path: ["checkedIn"], equals: true } };
                break;
            case "refunded":
                statusFilter = { status: "REFUNDED" };
                break;
        }

        // Get order items for events
        const orderItems = await prisma.orderItem.findMany({
            where: {
                productId: { in: eventIds },
                order: {
                    storeId,
                    ...statusFilter,
                },
            },
            include: {
                order: {
                    include: {
                        customer: {
                            select: { firstName: true, lastName: true, email: true, phone: true },
                        },
                    },
                },
            },
            orderBy: { order: { createdAt: "desc" } },
        });

        const tickets = orderItems.map((item: any) => {
            const event = eventMap.get(item.productId || "");
            const eventMetadata = (event?.metadata as any) || {};
            const orderMetadata = (item.order.metadata as any) || {};

            // Determine ticket status
            let status = "PAID";
            if (item.order.status === "REFUNDED") status = "REFUNDED";
            else if (item.order.status === "PENDING") status = "PENDING";
            else if (orderMetadata.checkedIn) status = "USED";

            return {
                id: item.id,
                orderNumber: item.order.orderNumber,
                customerName: item.order.customer
                    ? `${item.order.customer.firstName || ""} ${item.order.customer.lastName || ""}`.trim()
                    : "Guest",
                customerEmail: item.order.customer?.email || item.order.customerEmail || "",
                customerPhone: item.order.customer?.phone || item.order.customerPhone || "",
                eventName: event?.title || "Unknown Event",
                eventDate: eventMetadata.eventDate || "",
                ticketType: item.variant?.title || "General",
                quantity: item.quantity,
                unitPrice: Number(item.unitPrice),
                totalAmount: Number(item.lineTotal),
                status,
                purchasedAt: item.createdAt.toISOString(),
                qrCode: `${item.order.orderNumber}-${item.id}`,
            };
        });

        return NextResponse.json(tickets);
    } catch (error: any) {
        console.error("GET /api/nightlife/tickets error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
