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
        const provider = searchParams.get("provider") || "";

        const skip = (page - 1) * limit;

        const where = {
            AND: [
                status ? { status: { equals: status, mode: "insensitive" as const } } : {},
                provider ? { provider: { equals: provider, mode: "insensitive" as const } } : {},
                search
                    ? {
                        OR: [
                            { trackingCode: { contains: search, mode: "insensitive" as const } },
                            { recipientName: { contains: search, mode: "insensitive" as const } },
                            { Order: { orderNumber: { contains: search, mode: "insensitive" as const } } },
                        ],
                    }
                    : {},
            ],
        };

        const shipmentsQuery = prisma.shipment.findMany({
            where,
            take: limit,
            skip,
            orderBy: { createdAt: "desc" },
            include: {
                store: {
                    select: { name: true, slug: true },
                },
                Order: {
                    select: { orderNumber: true },
                },
            },
        });

        const countQuery = prisma.shipment.count({ where });

        const [shipments, total] = await Promise.all([shipmentsQuery, countQuery]);

        const data = shipments.map((s: any) => ({
            id: s.id,
            orderNumber: s.Order?.orderNumber || "Unknown",
            status: s.status,
            provider: s.provider,
            trackingCode: s.trackingCode,
            recipientName: s.recipientName,
            createdAt: s.createdAt,
            cost: s.cost,
            deliveryFee: s.deliveryFee,
            storeName: s.store?.name || "Unknown Store",
            storeId: s.storeId,
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
        console.error("Deliveries list error:", error);
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
}
