import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth/session";
import { format } from "date-fns";
import { Badge } from "@vayva/ui";
import { Calendar, Clock, User } from "lucide-react";
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
    return (_jsxs("div", { className: "p-6 md:p-8 max-w-7xl mx-auto space-y-8", children: [_jsxs("div", { className: "flex justify-between items-center", children: [_jsxs("div", { children: [_jsx("h1", { className: "text-2xl font-bold tracking-tight text-gray-900", children: "Bookings & Appointments" }), _jsx("p", { className: "text-gray-500", children: "Manage your schedule and client visits" })] }), _jsx(CreateBookingModal, { services: serviceOptions, customers: customerOptions })] }), _jsxs("div", { className: "bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm", children: [_jsxs("div", { className: "p-6 border-b border-gray-100 flex items-center justify-between", children: [_jsx("h2", { className: "font-bold text-gray-900", children: "Upcoming Schedule" }), _jsxs("div", { className: "text-sm text-gray-500", children: [bookings.length, " total bookings"] })] }), _jsx("div", { className: "p-6", children: bookings.length === 0 ? (_jsxs("div", { className: "text-center py-12", children: [_jsx(Calendar, { className: "w-12 h-12 text-gray-200 mx-auto mb-4" }), _jsx("h3", { className: "font-bold text-gray-900", children: "No bookings yet" }), _jsx("p", { className: "text-gray-500 text-sm mt-1", children: "New appointments will appear here." })] })) : (_jsx("div", { className: "space-y-4", children: bookings.map((booking) => (_jsxs("div", { className: "bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4", children: [_jsxs("div", { className: "flex items-start gap-4", children: [_jsx("div", { className: "w-12 h-12 rounded-lg bg-green-50 flex items-center justify-center text-green-600 font-bold text-lg shrink-0", children: format(booking.startsAt, "d") }), _jsxs("div", { children: [_jsx("h3", { className: "font-semibold text-gray-900", children: booking.service.title }), _jsxs("div", { className: "flex items-center gap-4 mt-1 text-sm text-gray-500", children: [_jsxs("span", { className: "flex items-center gap-1", children: [_jsx(Clock, { size: 14 }), format(booking.startsAt, "h:mm a"), " - ", format(booking.endsAt, "h:mm a")] }), booking.customer && (_jsxs("span", { className: "flex items-center gap-1", children: [_jsx(User, { size: 14 }), booking.customer.firstName, " ", booking.customer.lastName] }))] })] })] }), _jsxs("div", { className: "flex items-center gap-3", children: [_jsx(Badge, { variant: booking.status === 'CONFIRMED' ? 'success' : 'default', children: booking.status }), _jsx(BookingListActions, { booking: booking, services: serviceOptions, customers: customerOptions })] })] }, booking.id))) })) })] })] }));
}
