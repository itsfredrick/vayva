import { NextResponse } from "next/server";
import { prisma } from "@vayva/db";
import { withRBAC } from "@/lib/team/rbac";
import { PERMISSIONS } from "@/lib/team/permissions";

export const GET = withRBAC(PERMISSIONS.METRICS_VIEW, async (session: any) => {
    try {
        const storeId = session.user.storeId;

        const [firstOrder, firstPayment, activeCustomers] = await Promise.all([
            prisma.order.findFirst({ where: { storeId } }),
            prisma.paymentTransaction.findFirst({ where: { storeId } }),
            prisma.customer.count({ where: { storeId } }),
        ]);

        const status = {
            isActivated: !!firstOrder || !!firstPayment,
            firstOrderCreated: !!firstOrder,
            firstPaymentRecorded: !!firstPayment,
            firstOrderCompleted: !!firstOrder && (firstOrder.status === 'DELIVERED'),
        };

        return NextResponse.json(status);
    } catch (error) {
        return NextResponse.json(
            { error: "Failed to fetch activation metrics" },
            { status: 500 }
        );
    }
});
