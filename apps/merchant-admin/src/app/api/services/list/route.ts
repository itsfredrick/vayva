import { NextResponse } from "next/server";
import { withVayvaAPI } from "@/lib/api-handler";
import { PERMISSIONS } from "@/lib/team/permissions";
import { prisma } from "@/lib/prisma";
// GET Services List (Simple dropdown list)
export const GET = withVayvaAPI(PERMISSIONS.ORDERS_MANAGE, async (request, { storeId }) => {
    try {
        const services = await prisma.product.findMany({
            where: {
                storeId,
                status: "ACTIVE",
                // Optimally we'd filter for services only
            },
            select: { id: true, title: true, price: true }
        });
        return NextResponse.json(services.map(s => ({
            id: s.id,
            name: s.title,
            price: s.price
        })));
    }
    catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
});
