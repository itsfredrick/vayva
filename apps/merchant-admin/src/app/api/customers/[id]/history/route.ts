import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@vayva/db";
import { CustomerActivity } from "@vayva/shared";
import { withVayvaAPI, HandlerContext } from "@/lib/api-handler";
import { PERMISSIONS } from "@/lib/team/permissions";

export const GET = withVayvaAPI(
    PERMISSIONS.CUSTOMERS_VIEW,
    async (req: NextRequest, { params, storeId }: HandlerContext & { params: Promise<{ id: string }> }) => {
        try {
            const { id } = await params;

            const [orders, bookings] = await Promise.all([
                prisma.order.findMany({
                    where: { customerId: id, storeId },
                    select: {
                        id: true,
                        total: true,
                        status: true,
                        createdAt: true,
                        orderNumber: true
                    },
                    orderBy: { createdAt: "desc" },
                    take: 20
                }),
                prisma.booking.findMany({
                    where: { customerId: id, storeId },
                    include: { service: true },
                    orderBy: { createdAt: "desc" },
                    take: 20
                })
            ]);

            const history: CustomerActivity[] = [
                ...orders.map(o => ({
                    id: `ord_${o.id}`,
                    type: "order" as const,
                    status: o.status.toLowerCase(),
                    amount: (o.total as unknown).toNumber ? (o.total as unknown).toNumber() : Number(o.total),
                    date: o.createdAt.toISOString(),
                    description: `Order #${o.orderNumber}`,
                    metadata: { orderId: o.id }
                })),
                ...bookings.map(b => ({
                    id: `bk_${b.id}`,
                    type: "booking" as const,
                    status: b.status.toLowerCase(),
                    date: b.createdAt.toISOString(),
                    description: `Booking for ${b.service.title}`,
                    metadata: { bookingId: b.id }
                }))
            ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

            return NextResponse.json(history);
        } catch (error) {
            console.error("Fetch Customer History Error:", error);
            return NextResponse.json({ error: "Failed to fetch history" }, { status: 500 });
        }
    }
);
