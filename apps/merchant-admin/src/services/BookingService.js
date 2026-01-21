import { db } from "@/lib/db";
import { Prisma } from "@vayva/db";
import { addMinutes } from "date-fns";
export const BookingService = {
    async createServiceProduct(storeId, data) {
        return await db.product.create({
            data: {
                storeId,
                title: data.name,
                handle: data.name.toLowerCase().replace(/[^a-z0-9]+/g, '-') + '-' + Date.now(),
                description: data.description,
                price: new Prisma.Decimal(data.price),
                status: "ACTIVE",
                trackInventory: false, // Services don't track stock quantity usually
                productType: "SERVICE", // Assuming we might want to differentiate, or just relying on metadata
                metadata: data.metadata,
            }
        });
    },
    async getBookings(storeId, startDate, endDate) {
        return await db.booking.findMany({
            where: {
                storeId,
                startsAt: {
                    gte: startDate,
                    lte: endDate
                }
            },
            include: {
                service: true,
                customer: true
            },
            orderBy: {
                startsAt: "asc"
            }
        });
    },
    async createBooking(storeId, data) {
        const service = await db.product.findUnique({ where: { id: data.serviceId } });
        if (!service)
            throw new Error("Service not found");
        let endsAt = data.endsAt;
        if (!endsAt) {
            const meta = service.metadata;
            const duration = meta?.durationMinutes || 60;
            endsAt = addMinutes(new Date(data.startsAt), duration);
        }
        // Simple collision detection
        const overlap = await db.booking.findFirst({
            where: {
                storeId,
                status: "CONFIRMED",
                OR: [
                    {
                        startsAt: { lte: data.startsAt },
                        endsAt: { gt: data.startsAt }
                    },
                    {
                        startsAt: { lt: endsAt },
                        endsAt: { gte: endsAt }
                    }
                ]
            }
        });
        if (overlap) {
            throw new Error("Time slot unavailable");
        }
        // Create Customer if not exists and info provided
        let customerId = data.customerId;
        if (!customerId && data.customerEmail) {
            const existing = await db.customer.findUnique({
                where: { storeId_email: { storeId, email: data.customerEmail } }
            });
            if (existing) {
                customerId = existing.id;
            }
            else {
                const newCustomer = await db.customer.create({
                    data: {
                        storeId,
                        email: data.customerEmail,
                        firstName: data.customerName?.split(" ")[0] || "Guest",
                        lastName: data.customerName?.split(" ").slice(1).join(" ") || "",
                    }
                });
                customerId = newCustomer.id;
            }
        }
        return await db.booking.create({
            data: {
                storeId,
                serviceId: data.serviceId,
                customerId,
                startsAt: data.startsAt,
                endsAt,
                status: "CONFIRMED",
                notes: data.notes
            }
        });
    },
    async updateBooking(storeId, bookingId, data) {
        // Ensure booking belongs to store
        const booking = await db.booking.findFirst({
            where: { id: bookingId, storeId }
        });
        if (!booking)
            throw new Error("Booking not found");
        // Logic to update fields
        // If service changes, might need to re-calculate endsAt or price? For now simpler logic.
        return await db.booking.update({
            where: { id: bookingId },
            data: {
                ...data,
                // If service changed, we should probably check existence, but assuming valid ID for now
            }
        });
    },
    async deleteBooking(storeId, bookingId) {
        // Ensure booking belongs to store
        const booking = await db.booking.findFirst({
            where: { id: bookingId, storeId }
        });
        if (!booking)
            throw new Error("Booking not found");
        return await db.booking.delete({
            where: { id: bookingId }
        });
    },
    async updateBookingStatus(bookingId, status) {
        return await db.booking.update({
            where: { id: bookingId },
            data: { status }
        });
    }
};
