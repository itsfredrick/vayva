import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { withVayvaAPI, APIContext } from "@/lib/api-handler";
import { PERMISSIONS } from "@/lib/team/permissions";
export const GET = withVayvaAPI(PERMISSIONS.METRICS_VIEW, async (request: NextRequest, { storeId }: APIContext) => {
    try {
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
    }
    catch (error: any) {
        return NextResponse.json({ error: "Failed to fetch activation metrics" }, { status: 500 });
    }
});
