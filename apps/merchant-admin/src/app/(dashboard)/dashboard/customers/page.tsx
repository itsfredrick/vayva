import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth/session";
import { CustomerListContainer } from "@/components/customers/CustomerListContainer";
import { Customer, CustomerStatus } from "@vayva/shared";

export default async function CustomersPage() {
    const session = await requireAuth();
    const storeId = session.user.storeId;

    // Use the Customer model directly as it exists in the schema
    const dbCustomers = await prisma.customer.findMany({
        where: { storeId },
        include: {
            orders: {
                select: {
                    total: true, 
                    createdAt: true,
                }
            }
        },
        orderBy: { createdAt: 'desc' },
        take: 100 
    });

    // Map to Unified Customer Interface
    const customers: Customer[] = dbCustomers.map(c => {
        const totalOrders = c.orders.length;
        const totalSpend = c.orders.reduce((acc, o) => {
            const val = (o.total as unknown).toNumber ? (o.total as unknown).toNumber() : Number(o.total);
            return acc + val;
        }, 0);

        // Determine status
        let status = CustomerStatus.NEW;
        if (totalOrders > 5) status = CustomerStatus.VIP;
        else if (totalOrders > 1) status = CustomerStatus.RETURNING;

        // Latest order time as last seen
        const lastOrder = c.orders.length > 0 ? c.orders.reduce((latest, current) => {
            return current.createdAt > latest.createdAt ? current : latest;
        }) : null;

        return {
            id: c.id,
            name: (c.firstName && c.lastName) ? `${c.firstName} ${c.lastName}` : (c.firstName || "Guest"),
            email: c.email || "",
            phone: c.phone || "",
            totalOrders,
            totalSpend,
            status,
            lastSeenAt: lastOrder ? lastOrder.createdAt.toISOString() : c.createdAt.toISOString(),
            joinedAt: c.createdAt.toISOString(),
            merchantId: session.user.storeId,
            firstSeenAt: c.createdAt.toISOString(),
            avatarUrl: null
        };
    });

    return (
        <div className="p-6 md:p-8 max-w-7xl mx-auto">
            <CustomerListContainer customers={customers} />
        </div>
    );
}
