
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@vayva/db";

// GET /api/bookings/availability
// ?productId=UUID&start=ISO&end=ISO
export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const productId = searchParams.get("productId");
    const start = searchParams.get("start");
    const end = searchParams.get("end");

    if (!productId || !start || !end) {
        return NextResponse.json({ error: "Missing params" }, { status: 400 });
    }

    try {
        const startDate = new Date(start);
        const endDate = new Date(end);

        // 1. Get Room Details (Need Total Units)
        const room = await prisma.accommodationProduct.findUnique({
            where: { productId },
            select: { totalUnits: true }
        });

        if (!room) return NextResponse.json({ error: "Room type not found" }, { status: 404 });

        // 2. Count overlapping bookings
        // A booking overlaps if (BookStart < ReqEnd) AND (BookEnd > ReqStart)
        // Confirmed or Paid bookings only
        const bookedCount = await prisma.booking.count({
            where: {
                serviceId: productId,
                status: { in: ["CONFIRMED", "COMPLETED"] },
                startsAt: { lt: endDate },
                endsAt: { gt: startDate }
            }
        });

        const available = room.totalUnits - bookedCount;

        return NextResponse.json({
            productId,
            totalUnits: room.totalUnits,
            bookedCount,
            available: available > 0 ? available : 0,
            isAvailable: available > 0
        });

    } catch (e: any) {
        console.error("Availability Check Error:", e);
        return NextResponse.json({ error: "Internal Error" }, { status: 500 });
    }
}
