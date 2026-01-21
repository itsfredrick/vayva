import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/session";
import { prisma } from "@/lib/prisma";
// PATCH /api/properties/viewings/[id]/status
export async function PATCH(request, { params }) {
    try {
        const sessionUser = await getSessionUser();
        if (!sessionUser)
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        const { id } = await params;
        const body = await request.json();
        const { status } = body; // CONFIRMED, CANCELLED
        if (!status)
            return NextResponse.json({ error: "Status required" }, { status: 400 });
        const booking = await prisma.booking.update({
            where: { id, storeId: sessionUser.storeId },
            data: { status }
        });
        return NextResponse.json({ success: true, booking });
    }
    catch (e) {
        console.error("Update viewing status error:", e);
        return NextResponse.json({ error: "Internal Error" }, { status: 500 });
    }
}
