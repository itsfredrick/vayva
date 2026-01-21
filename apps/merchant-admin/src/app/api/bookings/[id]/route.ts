import { NextRequest, NextResponse } from "next/server";
import { withVayvaAPI, HandlerContext } from "@/lib/api-handler";
import { PERMISSIONS } from "@/lib/team/permissions";
import { BookingService } from "@/services/BookingService";
import { prisma } from "@/lib/prisma";

// GET Booking by ID
export const GET = withVayvaAPI(
    PERMISSIONS.ORDERS_VIEW,
    async (request: NextRequest, { storeId, params }: HandlerContext) => {
        try {
            const { id } = await params;
            const booking = await prisma.booking.findUnique({
                where: { id: id, storeId },
            });

            if (!booking) {
                return NextResponse.json({ error: "Booking not found" }, { status: 404 });
            }

            return NextResponse.json(booking);
        } catch (error: any) {
            return NextResponse.json({ error: error.message }, { status: 400 });
        }
    }
);

// PUT Update Booking
export const PUT = withVayvaAPI(
    PERMISSIONS.ORDERS_MANAGE,
    async (request: NextRequest, { storeId, params }: HandlerContext) => {
        try {
            const data = await request.json();
            const { id } = await params;

            // Format dates if present
            const updateData = {
                ...data,
                startsAt: data.startsAt ? new Date(data.startsAt) : undefined,
                endsAt: data.endsAt ? new Date(data.endsAt) : undefined,
            };

            const booking = await BookingService.updateBooking(storeId, id, updateData);
            return NextResponse.json(booking);
        } catch (error: any) {
            return NextResponse.json({ error: error.message }, { status: 400 });
        }
    }
);

// DELETE Booking
export const DELETE = withVayvaAPI(
    PERMISSIONS.ORDERS_MANAGE,
    async (request: NextRequest, { storeId, params }: HandlerContext) => {
        const { id } = await params;
        try {
            await prisma.booking.delete({
                where: { id: id, storeId }
            }); return NextResponse.json({ success: true });
        } catch (error: any) {
            return NextResponse.json({ error: error.message }, { status: 400 });
        }
    }
);
