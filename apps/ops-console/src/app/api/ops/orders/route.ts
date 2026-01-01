import { NextRequest, NextResponse } from "next/server";
import { OpsAuthService } from "@/lib/ops-auth";
import { prisma } from "@vayva/db";


export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
    try {
        await OpsAuthService.requireSession();

        const searchParams = req.nextUrl.searchParams;
        const page = parseInt(searchParams.get("page") || "1");
        const limit = parseInt(searchParams.get("limit") || "20");
        const search = searchParams.get("q") || "";
        const status = searchParams.get("status") || "";
        const paymentStatus = searchParams.get("paymentStatus") || "";
        const storeId = searchParams.get("storeId") || "";

        const skip = (page - 1) * limit;

        const where: any = {
            AND: [
                status ? { status: status as any } : {},
                paymentStatus ? { paymentStatus: paymentStatus as any } : {},
                storeId ? { storeId } : {},
                search
                    ? {
                        OR: [
                            { id: { contains: search, mode: "insensitive" } },
                            { orderNumber: { contains: search, mode: "insensitive" } },
                            { customerEmail: { contains: search, mode: "insensitive" } },
                            { customerPhone: { contains: search, mode: "insensitive" } },
                        ],
                    }
                    : {},
            ],
        };

        const [orders, total] = await Promise.all([
            prisma.order.findMany({
                where,
                take: limit,
                skip,
                orderBy: { createdAt: "desc" },
                include: {
                    store: {
                        select: { name: true, slug: true },
                    },
                },
            }),
            prisma.order.count({ where }),
        ]);

        const data = orders.map((o: any) => ({
            id: o.id,
            orderNumber: o.orderNumber,
            status: o.status,
            paymentStatus: o.paymentStatus,
            fulfillmentStatus: o.fulfillmentStatus,
            total: o.total,
            currency: o.currency,
            customerEmail: o.customerEmail,
            createdAt: o.createdAt,
            storeName: o.store?.name || "Unknown Store",
            storeSlug: o.store?.slug,
            storeId: o.storeId,
        }));

        return NextResponse.json({
            data,
            meta: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit),
            },
        });
    } catch (error) {
        console.error("Orders list error:", error);
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
}
