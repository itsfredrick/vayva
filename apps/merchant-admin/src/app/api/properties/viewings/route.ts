import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/session";
import { prisma } from "@/lib/prisma";
// GET /api/properties/viewings
export async function GET(request: any) {
    try {
        const sessionUser = await getSessionUser();
        if (!sessionUser)
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        // Fetch bookings that are identified as TOUR requests
        // We filter by metadata path using Prisma's JSON filtering if supported, or fetch and filter
        // Actually, Prisma supports JSON filtering: metadata: { path: ['type'], equals: 'TOUR' }
        const viewings = await prisma.booking.findMany({
            where: {
                storeId: sessionUser.storeId,
                metadata: {
                    path: ['type'],
                    equals: 'TOUR'
                }
            },
            include: {
                service: {
                    select: { title: true, id: true } // The Property
                },
                customer: {
                    select: { firstName: true, lastName: true, email: true, phone: true }
                }
            },
            orderBy: {
                startsAt: 'asc'
            }
        });
        return NextResponse.json({ viewings });
    }
    catch (e) {
        console.error("Fetch viewings error:", e);
        return NextResponse.json({ error: "Internal Error" }, { status: 500 });
    }
}
// POST /api/properties/viewings (For testing/manual creation)
export async function POST(request: any) {
    try {
        const sessionUser = await getSessionUser();
        if (!sessionUser)
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        const body = await request.json();
        const { propertyId, date, time, customerName, customerEmail } = body;
        if (!propertyId || !date || !time)
            return NextResponse.json({ error: "Missing fields" }, { status: 400 });
        const startsAt = new Date(`${date}T${time}:00`);
        const endsAt = new Date(startsAt.getTime() + 45 * 60 * 1000); // 45 min tour
        const booking = await prisma.booking.create({
            data: {
                storeId: sessionUser.storeId,
                serviceId: propertyId,
                startsAt,
                endsAt,
                status: "PENDING", // Initial status for requests
                metadata: {
                    type: "TOUR",
                    customerName,
                    customerEmail
                }
            }
        });
        return NextResponse.json({ booking });
    }
    catch (e) {
        console.error("Create viewing error:", e);
        return NextResponse.json({ error: "Internal Error" }, { status: 500 });
    }
}
