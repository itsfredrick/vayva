import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth/session";
import { format } from "date-fns";
import { Badge, Button, Icon } from "@vayva/ui";
import { Calendar, Clock, User, Plus } from "lucide-react";
import { BookingListActions } from "@/components/bookings/BookingListActions";
import { CreateBookingModal } from "@/components/bookings/CreateBookingModal";

export default async function BookingsPage() {
    const session = await requireAuth();
    const storeId = session.user.storeId;

    const bookings = await prisma.booking.findMany({
        where: { storeId },
        include: {
            service: { select: { id: true, title: true } },
            customer: { select: { id: true, firstName: true, lastName: true } },
        },
        orderBy: { startsAt: "asc" },
    });

    // For create modal
    const services = await prisma.product.findMany({
        where: { storeId, productType: 'SERVICE' },
        select: { id: true, title: true }
    });

    const customers = await prisma.customer.findMany({
        where: { storeId },
        select: { id: true, firstName: true, lastName: true }
    });

    const serviceOptions = services.map(s => ({ id: s.id, name: s.title }));
    const customerOptions = customers.map(c => ({ id: c.id, name: `${c.firstName} ${c.lastName}` }));

    return (
        <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-8">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-gray-900">Bookings & Appointments</h1>
                    <p className="text-gray-500">Manage your schedule and client visits</p>
                </div>
                <CreateBookingModal
                    services={serviceOptions}
                    customers={customerOptions}
                />
            </div>

            <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
                <div className="p-6 border-b border-gray-100 flex items-center justify-between">
                    <h2 className="font-bold text-gray-900">Upcoming Schedule</h2>
                    <div className="text-sm text-gray-500">{bookings.length} total bookings</div>
                </div>

                <div className="p-6">
                    {bookings.length === 0 ? (
                        <div className="text-center py-12">
                            <Calendar className="w-12 h-12 text-gray-200 mx-auto mb-4" />
                            <h3 className="font-bold text-gray-900">No bookings yet</h3>
                            <p className="text-gray-500 text-sm mt-1">New appointments will appear here.</p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {bookings.map((booking) => (
                                <div key={booking.id} className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
                                    <div className="flex items-start gap-4">
                                        <div className="w-12 h-12 rounded-lg bg-green-50 flex items-center justify-center text-green-600 font-bold text-lg shrink-0">
                                            {format(booking.startsAt, "d")}
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-gray-900">{booking.service.title}</h3>
                                            <div className="flex items-center gap-4 mt-1 text-sm text-gray-500">
                                                <span className="flex items-center gap-1">
                                                    <Clock size={14} />
                                                    {format(booking.startsAt, "h:mm a")} - {format(booking.endsAt, "h:mm a")}
                                                </span>
                                                {booking.customer && (
                                                    <span className="flex items-center gap-1">
                                                        <User size={14} />
                                                        {booking.customer.firstName} {booking.customer.lastName}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-3">
                                        <Badge variant={(booking.status as unknown) === 'CONFIRMED' ? 'success' : 'default'}>
                                            {booking.status}
                                        </Badge>
                                        <BookingListActions
                                            booking={booking}
                                            services={serviceOptions}
                                            customers={customerOptions}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
