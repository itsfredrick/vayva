import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { withVayvaAPI } from "@/lib/api-handler";
import { PERMISSIONS } from "@/lib/team/permissions";
export const GET = withVayvaAPI(PERMISSIONS.COMMERCE_VIEW, async (request, { storeId }) => {
    try {
        const orders = await prisma.order.findMany({
            where: { storeId },
            take: 5,
            orderBy: { createdAt: "desc" },
            include: { customer: true }
        });
        // Fetch recent Payouts
        const payouts = await prisma.payout.findMany({
            where: { storeId },
            take: 3,
            orderBy: { createdAt: "desc" }
        });
        // Fetch recent Tickets
        const tickets = await prisma.supportTicket.findMany({
            where: { storeId },
            take: 3,
            orderBy: { createdAt: "desc" }
        });
        // Map Orders
        const orderActivities = orders.map(order => ({
            id: order.id,
            type: "ORDER",
            message: `New order ${order.orderNumber} for ₦${Number(order.total).toLocaleString()}`,
            user: order.customer
                ? [order.customer.firstName, order.customer.lastName].filter(Boolean).join(" ").trim() ||
                    order.customer.email ||
                    "Guest"
                : "Guest",
            date: order.createdAt,
            time: getTimeAgo(order.createdAt),
        }));
        // Map Payouts
        const payoutActivities = payouts.map(payout => ({
            id: payout.id,
            type: "PAYOUT",
            message: `Payout of ₦${(Number(payout.amount) / 100).toLocaleString()} ${payout.status.toLowerCase()}`,
            user: "System",
            date: payout.createdAt,
            time: getTimeAgo(payout.createdAt)
        }));
        // Map Tickets
        const ticketActivities = tickets.map(ticket => ({
            id: ticket.id,
            type: "TICKET",
            message: `Ticket "${ticket.subject}" updated (${ticket.status})`,
            user: "Support",
            date: ticket.updatedAt,
            time: getTimeAgo(ticket.updatedAt)
        }));
        // Merge and Sort
        const activity = [...orderActivities, ...payoutActivities, ...ticketActivities]
            .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
            .slice(0, 10); // Keep top 10
        return NextResponse.json(activity);
    }
    catch (error) {
        console.error("Activity API Error:", error);
        return NextResponse.json({ error: "Failed to fetch activity" }, { status: 500 });
    }
});
function getTimeAgo(date) {
    const seconds = Math.floor((new Date().getTime() - new Date(date).getTime()) / 1000);
    let interval = seconds / 31536000;
    if (interval > 1)
        return Math.floor(interval) + "y ago";
    interval = seconds / 2592000;
    if (interval > 1)
        return Math.floor(interval) + "mo ago";
    interval = seconds / 86400;
    if (interval > 1)
        return Math.floor(interval) + "d ago";
    interval = seconds / 3600;
    if (interval > 1)
        return Math.floor(interval) + "h ago";
    interval = seconds / 60;
    if (interval > 1)
        return Math.floor(interval) + "m ago";
    return "just now";
}
