import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

/**
 * POST /api/nightlife/tickets/[id]/check-in
 * Marks a ticket as checked in
 */
export async function POST(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const storeId = session.user.storeId;
        if (!storeId) {
            return NextResponse.json({ error: "No store context" }, { status: 400 });
        }

        const { id } = await params;

        // Get order item and verify it belongs to store
        const orderItem = await prisma.orderItem.findFirst({
            where: { id },
            include: {
                order: true,
            },
        });

        if (!orderItem || orderItem.order.storeId !== storeId) {
            return NextResponse.json({ error: "Ticket not found" }, { status: 404 });
        }

        // Update order metadata to mark as checked in
        const currentMetadata = (orderItem.order.metadata as any) || {};
        
        await prisma.order.update({
            where: { id: orderItem.orderId },
            data: {
                metadata: {
                    ...currentMetadata,
                    checkedIn: true,
                    checkedInAt: new Date().toISOString(),
                    checkedInBy: session.user.id,
                },
            },
        });

        return NextResponse.json({ success: true });
    } catch (error: any) {
        console.error("POST /api/nightlife/tickets/[id]/check-in error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
