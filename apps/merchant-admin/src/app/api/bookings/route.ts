import { NextResponse } from "next/server";
import { withVayvaAPI, APIContext } from "@/lib/api-handler";
import { PERMISSIONS } from "@/lib/team/permissions";
import { BookingService } from "@/services/BookingService";
// GET Bookings (with date filter)
export const GET = withVayvaAPI(PERMISSIONS.ORDERS_VIEW, async (request, { storeId }: APIContext) => {
    try {
        const { searchParams } = new URL(request.url);
        const startParam = searchParams.get("start");
        const endParam = searchParams.get("end");
        const start = startParam ? new Date(startParam) : undefined;
        const end = endParam ? new Date(endParam) : undefined;
        const bookings = await BookingService.getBookings(storeId, start as any, end as any);
        return NextResponse.json(bookings);
    }
    catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
});
// POST Create Booking
export const POST = withVayvaAPI(PERMISSIONS.ORDERS_MANAGE, async (request, { storeId }: APIContext) => {
    try {
        const data = await request.json();
        const booking = await BookingService.createBooking(storeId, {
            ...data,
            startsAt: new Date(data.startsAt),
            endsAt: data.endsAt ? new Date(data.endsAt) : undefined
        });
        return NextResponse.json(booking);
    }
    catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 400 });
    }
});
