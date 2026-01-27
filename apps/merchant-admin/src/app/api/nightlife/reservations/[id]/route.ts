import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

/**
 * PATCH /api/nightlife/reservations/[id]
 * Updates a reservation status
 */
export async function PATCH(
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
        const body = await req.json();
        const { status } = body;

        if (!status) {
            return NextResponse.json({ error: "Status required" }, { status: 400 });
        }

        // Verify booking belongs to store
        const booking = await prisma.booking.findFirst({
            where: { id, storeId },
        });

        if (!booking) {
            return NextResponse.json({ error: "Reservation not found" }, { status: 404 });
        }

        // Update status
        const updated = await prisma.booking.update({
            where: { id },
            data: { status },
        });

        return NextResponse.json({ success: true, booking: updated });
    } catch (error: any) {
        console.error("PATCH /api/nightlife/reservations/[id] error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
