import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
export async function GET(req, { params }) {
    try {
        const { slug } = await params;
        const store = await prisma.store.findUnique({
            where: { slug },
            select: {
                id: true,
                name: true,
                slug: true,
                logoUrl: true,
                settings: true,
                category: true,
                plan: true,
                isLive: true,
                // agent: {
                //   select: {
                //     enabled: true,
                //     businessHours: true,
                //   },
                // },
                deliverySettings: {
                    select: {
                        isEnabled: true,
                        provider: true,
                        pickupAddressLine1: true,
                        pickupCity: true,
                        pickupState: true,
                        pickupPhone: true,
                    },
                },
            },
        });
        if (!store) {
            return NextResponse.json({ error: "Store not found" }, { status: 404 });
        }
        return NextResponse.json(store);
    }
    catch (error) {
        console.error("Error fetching store:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
