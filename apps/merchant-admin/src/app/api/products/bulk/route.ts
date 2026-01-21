import { NextResponse } from "next/server";
import { prisma } from "@vayva/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { logActivity } from "@/lib/activity-logger";

export async function PATCH(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.id || !session?.user?.storeId) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const body = await req.json();
        const { items } = body as { items: { id: string; data: any }[] };

        if (!Array.isArray(items) || items.length === 0) {
            return new NextResponse("No items to update", { status: 400 });
        }

        // 1. Fetch current state for logging
        const ids = items.map(i => i.id);
        const currentProducts = await prisma.product.findMany({
            where: { id: { in: ids }, storeId: session.user.storeId }
        });
        const productMap = new Map(currentProducts.map(p => [p.id, p]));

        // Use transaction for atomic updates
        const updates = await prisma.$transaction(
            items.map((item) => {
                const current = productMap.get(item.id);
                // Prepare update
                return prisma.product.update({
                    where: { id: item.id },
                    data: {
                        title: item.data.name,
                        price: item.data.price ? Number(item.data.price) : undefined,
                        status: item.data.status,
                    },
                });
            })
        );

        // 2. Async Logging (don't block response)
        // We log each change individually for clarity
        items.forEach(item => {
            const older = productMap.get(item.id);
            const newer = updates.find(u => u.id === item.id);

            if (older && newer) {
                logActivity({
                    storeId: session.user.storeId!,
                    actorUserId: session.user.id,
                    action: "PRODUCT_BULK_UPDATE",
                    targetType: "PRODUCT",
                    targetId: item.id,
                    before: { title: older.title, price: Number(older.price), status: older.status },
                    after: { title: newer.title, price: Number(newer.price), status: newer.status }
                });
            }
        });

        return NextResponse.json({
            success: true,
            updatedCount: updates.length,
            message: `Successfully updated ${updates.length} products`
        });
    } catch (error) {
        console.error("Bulk update failed:", error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}
