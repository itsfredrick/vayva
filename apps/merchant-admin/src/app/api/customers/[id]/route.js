import { NextResponse } from "next/server";
import { prisma } from "@vayva/db";
import { CustomerStatus } from "@vayva/shared";
import { withVayvaAPI } from "@/lib/api-handler";
import { PERMISSIONS } from "@/lib/team/permissions";
export const GET = withVayvaAPI(PERMISSIONS.CUSTOMERS_VIEW, async (req, { params, storeId }) => {
    const { id } = await params;
    const customer = await prisma.customer.findUnique({
        where: { id, storeId },
        include: {
            orders: {
                select: {
                    id: true,
                    total: true,
                    createdAt: true,
                    status: true
                },
                orderBy: { createdAt: "desc" }
            }
        }
    });
    if (!customer) {
        return NextResponse.json({ error: "Customer not found" }, { status: 404 });
    }
    // Calculate stats
    const totalOrders = customer.orders.length;
    const totalSpend = customer.orders.reduce((acc, order) => {
        const val = order.total.toNumber ? order.total.toNumber() : Number(order.total);
        return acc + val;
    }, 0);
    const aov = totalOrders > 0 ? totalSpend / totalOrders : 0;
    // Determine status
    let status = CustomerStatus.NEW;
    if (totalOrders > 5)
        status = CustomerStatus.VIP;
    else if (totalOrders > 1)
        status = CustomerStatus.RETURNING;
    const mappedProfile = {
        id: customer.id,
        merchantId: storeId,
        name: (customer.firstName && customer.lastName) ? `${customer.firstName} ${customer.lastName}` : (customer.firstName || "Guest"),
        email: customer.email || "",
        phone: customer.phone || "",
        firstSeenAt: customer.createdAt.toISOString(),
        lastSeenAt: customer.orders.length > 0 ? customer.orders[0].createdAt.toISOString() : customer.createdAt.toISOString(),
        totalOrders,
        totalSpend,
        status,
        preferredChannel: "whatsapp" // Default for now, maybe infer from contact source
    };
    // Generate Insights (Dynamic)
    const insights = [];
    if (totalSpend > 50000) {
        insights.push({
            id: "ins_val",
            type: "spending",
            title: "High Value",
            description: "Top spender on your store.",
            icon: "TrendingUp",
            variant: "positive"
        });
    }
    if (totalOrders === 1 && Date.now() - new Date(customer.createdAt).getTime() < 1000 * 60 * 60 * 24 * 7) {
        insights.push({
            id: "ins_new",
            type: "preference",
            title: "New Customer",
            description: "Joined this week.",
            icon: "Star",
            variant: "neutral"
        });
    }
    return NextResponse.json({
        profile: mappedProfile,
        insights: insights,
        stats: {
            aov,
            refunds: 0, // Not tracked yet
            cancelRate: "0%"
        }
    });
});
export const PUT = withVayvaAPI(PERMISSIONS.CUSTOMERS_MANAGE, async (req, { params, storeId }) => {
    const { id } = await params;
    const body = await req.json();
    // Basic validation
    if (!body.firstName && !body.lastName) {
        return NextResponse.json({ error: "Name is required" }, { status: 400 });
    }
    const updated = await prisma.customer.update({
        where: { id, storeId },
        data: {
            firstName: body.firstName,
            lastName: body.lastName,
            email: body.email,
            phone: body.phone,
            notes: body.notes
        }
    });
    return NextResponse.json(updated);
});
export const DELETE = withVayvaAPI(PERMISSIONS.CUSTOMERS_MANAGE, async (req, { params, storeId }) => {
    const { id } = await params;
    // Check for orders
    const orderCount = await prisma.order.count({
        where: { customerId: id, storeId }
    });
    if (orderCount > 0) {
        return NextResponse.json({ error: "Cannot delete customer with existing orders. Archive or block instead." }, { status: 400 });
    }
    await prisma.customer.delete({
        where: { id, storeId }
    });
    return NextResponse.json({ success: true });
});
