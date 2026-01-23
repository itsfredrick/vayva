import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { withVayvaAPI } from "@/lib/api-handler";
import { PERMISSIONS } from "@/lib/team/permissions";
export const GET = withVayvaAPI(PERMISSIONS.COMMERCE_VIEW, async (request, { storeId }) => {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    if (!id)
        return NextResponse.json({ error: "Missing ID" }, { status: 400 });
    try {
        const customer = await prisma.customer.findUnique({
            where: { id, storeId },
            include: {
                orders: {
                    take: 5,
                    orderBy: { createdAt: "desc" },
                    select: {
                        id: true,
                        orderNumber: true,
                        total: true,
                        status: true,
                        createdAt: true
                    }
                }
            }
        });
        if (!customer) {
            return NextResponse.json({ error: "Customer not found" }, { status: 404 });
        }
        const history = customer.orders.map((o) => ({
            id: o.id,
            type: "order",
            amount: Number(o.total),
            status: o.status,
            date: o.createdAt.toISOString(),
            ref: o.orderNumber
        }));
        return NextResponse.json({
            id: customer.id,
            name: `${customer.firstName || ""} ${customer.lastName || ""}`.trim(),
            email: customer.email,
            phone: customer.phone,
            history,
            notes: customer.notes || "No notes.",
            stats: {
                totalSpend: 0,
                lastOrderDate: null
            }
        });
    }
    catch (error) {
        console.error("Customer Details Error:", error);
        return NextResponse.json({ error: "Failed to fetch customer details" }, { status: 500 });
    }
});
