import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/session";
import { prisma } from "@vayva/db";

export async function GET(req: any) {
    const user = await getSessionUser();
    if (!user?.storeId)
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    try {
        const [store, subscription] = await Promise.all([
            prisma.store.findUnique({
                where: { id: user.storeId },
                select: { plan: true },
            }),
            prisma.merchantAiSubscription.findUnique({
                where: { storeId: user.storeId },
                select: { planKey: true, status: true, periodEnd: true },
            }),
        ]);

        const planKey = subscription?.planKey || store?.plan || "FREE";
        const status = subscription?.status || "ACTIVE";
        const periodEnd = subscription?.periodEnd || null;

        return NextResponse.json({
            planKey: planKey.toLowerCase(),
            status: status.toLowerCase(),
            periodEnd,
            cancelAtPeriodEnd: false,
            invoices: [],
        });
    } catch (error: any) {
        console.error("[BILLING_STATUS_GET]", error);
        return NextResponse.json({ error: "Failed to fetch billing status" }, { status: 500 });
    }
}
