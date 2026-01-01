import { NextRequest, NextResponse } from "next/server";
import { OpsAuthService } from "@/lib/ops-auth";
import { prisma } from "@vayva/db";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
    try {
        await OpsAuthService.requireSession();

        const { searchParams } = new URL(req.url);
        const range = searchParams.get("range") || "24h";

        const now = new Date();
        const startDate = new Date();
        switch (range) {
            case "24h": startDate.setHours(now.getHours() - 24); break;
            case "7d": startDate.setDate(now.getDate() - 7); break;
            case "30d": startDate.setDate(now.getDate() - 30); break;
            default: startDate.setHours(now.getHours() - 24);
        }

        const [
            ordersCount,
            paymentsSuccess,
            paymentsFailed,
            shipmentsCount,
            shipmentsFailed,
            webhooksCount,
            webhooksFailed,
            topStores,
        ] = await Promise.all([
            prisma.order.count({ where: { createdAt: { gte: startDate } } }),
            prisma.charge.count({ where: { createdAt: { gte: startDate }, status: "SUCCESS" } }),
            prisma.charge.count({ where: { createdAt: { gte: startDate }, status: "FAILED" } }),
            prisma.shipment.count({ where: { createdAt: { gte: startDate } } }),
            prisma.dispatchJob.count({ where: { createdAt: { gte: startDate }, status: "FAILED" } }),
            prisma.webhookEvent.count({ where: { receivedAt: { gte: startDate } } }),
            prisma.webhookEvent.count({ where: { receivedAt: { gte: startDate }, status: "failed" } }),
            prisma.store.findMany({
                take: 5,
                select: { id: true, name: true }
            }),
        ]);

        const topMerchants = await Promise.all(topStores.map(async (s) => {
            const agg = await prisma.order.aggregate({
                where: {
                    storeId: s.id,
                    status: "PAID", 
                    createdAt: { gte: startDate }
                },
                _sum: { total: true }
            });
            return {
                id: s.id,
                name: s.name,
                gmv: Number(agg._sum.total || 0)
            };
        }));

        return NextResponse.json({
            health: {
                payments: "ok",
                webhooks: "ok",
                delivery: "ok",
                whatsapp: "ok"
            },
            counters: {
                ordersCreated: ordersCount,
                paymentsSuccess,
                paymentsFailed,
                deliveriesCreated: shipmentsCount,
                deliveriesFailed: shipmentsFailed,
                webhooksProcessed: webhooksCount,
                webhooksFailed
            },
            topMerchants,
            exceptions: []
        });
    } catch (error: any) {
        console.error("Metrics/Summary API Error:", error);
        return NextResponse.json({ error: "Internal Error" }, { status: 500 });
    }
}
