import { NextRequest, NextResponse } from "next/server";
import { withVayvaAPI, HandlerContext } from "@/lib/api-handler";
import { PERMISSIONS } from "@/lib/team/permissions";
import { BookingService } from "@/services/BookingService";

// GET Bookings (with date filter)
export const GET = withVayvaAPI(
    PERMISSIONS.ORDERS_VIEW,
    async (request: NextRequest, { storeId }: HandlerContext) => {
        try {
            const { searchParams } = new URL(request.url);
            const start = searchParams.get("start") ? new Date(searchParams.get("start")!) : undefined;
            const end = searchParams.get("end") ? new Date(searchParams.get("end")!) : undefined;

            const bookings = await BookingService.getBookings(storeId, start, end);
            return NextResponse.json(bookings);
        } catch (error: unknown) {
            return NextResponse.json({ error: error.message }, { status: 500 });
        }
    }
);

// POST Create Booking
export const POST = withVayvaAPI(
    PERMISSIONS.ORDERS_MANAGE,
    async (request: NextRequest, { storeId }: HandlerContext) => {
        try {
            const data = await request.json();
            const booking = await BookingService.createBooking(storeId, {
                ...data,
                startsAt: new Date(data.startsAt),
                endsAt: data.endsAt ? new Date(data.endsAt) : undefined
            });
            return NextResponse.json(booking);
        } catch (error: unknown) {
            return NextResponse.json({ error: error.message }, { status: 400 });
        }
    }
);
