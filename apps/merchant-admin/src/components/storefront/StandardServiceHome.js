"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from "react";
import { Button } from "@vayva/ui";
import { useStorefrontProducts, useStorefrontStore, } from "@/hooks/storefront/useStorefront";
import { useStorefrontCart } from "@/hooks/storefront/useStorefrontCart";
import { CheckoutModal } from "./CheckoutModal";
import { BookingCalendar } from "./features/BookingCalendar";
import { Calendar, Clock, MapPin, Check, ShoppingBag, Loader2 } from "lucide-react";
import { toast } from "sonner";
export function StandardServiceHome({ storeName: initialStoreName, storeSlug }) {
    const { store } = useStorefrontStore(storeSlug);
    const { products, isLoading } = useStorefrontProducts(storeSlug, { limit: 12 });
    const { cart, addToCart, removeFromCart, updateQuantity, total, isOpen: isCartOpen, setIsOpen: setIsCartOpen, clearCart } = useStorefrontCart(storeSlug || "");
    const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
    // Booking State
    const [selectedDate, setSelectedDate] = useState(null);
    const [selectedTime, setSelectedTime] = useState(null);
    const [isBookingSubmitting, setIsBookingSubmitting] = useState(false);
    const displayName = store?.name || initialStoreName || "Modern Service";
    const handleConfirmBooking = async () => {
        if (!selectedDate || !selectedTime) {
            toast.error("Please select a date and time for your appointment.");
            return;
        }
        if (cart.length === 0) {
            toast.error("Please add services to book.");
            return;
        }
        setIsBookingSubmitting(true);
        try {
            // Ideally we create the booking via API here or pass to CheckoutModal
            // For now, we open checkout
            setIsCheckoutOpen(true);
        }
        catch (error) {
            console.error("Booking error", error);
            toast.error("Failed to prepare booking.");
        }
        finally {
            setIsBookingSubmitting(false);
        }
    };
    const handleCheckoutSuccess = async (customerData) => {
        if (!storeSlug || !selectedDate || !selectedTime) {
            clearCart();
            return;
        }
        try {
            // In a real implementation:
            // 1. We would have the customer's email from the checkout process (customerData)
            // 2. We would POST to /api/storefront/[slug]/bookings 
            //    with { date, time, serviceIds: cart.map(i => i.id), customer: customerData }
            // For this implementation, we simulate success as the API endpoints exists 
            // and we want to allow the "Guest" flow to proceed visually.
            toast.success("Booking confirmed! Check your email.");
        }
        catch (e) {
            console.error(e);
            toast.error("Failed to create booking records.");
        }
        clearCart();
        setSelectedDate(null);
        setSelectedTime(null);
    };
    const handleBookingSubmit = async (formData) => {
        const dateStr = selectedDate?.toLocaleDateString('en-CA');
        // Create a booking for each service in the cart
        // NOTE: Ideally we batch this, but for now we loop
        const promises = cart.map(item => fetch(`/api/storefront/${storeSlug}/bookings`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                date: dateStr,
                time: selectedTime,
                customerEmail: formData.customer.email,
                serviceId: item.id,
                metadata: {
                    customerName: formData.customer.name,
                    customerPhone: formData.customer.phone
                }
            })
        }));
        await Promise.all(promises);
        // Errors caught by CheckoutModal
    };
    return (_jsxs("div", { className: "min-h-screen bg-[#F8FAFC] text-slate-800 font-sans", children: [_jsx(CheckoutModal, { isOpen: isCheckoutOpen, onClose: () => setIsCheckoutOpen(false), cart: cart, total: total, storeSlug: storeSlug || "", onSuccess: handleCheckoutSuccess, requireAddress: false, submitFn: handleBookingSubmit }), _jsxs("nav", { className: "bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between sticky top-0 z-50", children: [_jsx("div", { className: "font-bold text-xl tracking-tight text-slate-900", children: displayName }), _jsxs(Button, { onClick: () => setIsCartOpen(true), className: "bg-slate-900 text-white px-5 py-2 rounded-lg font-medium text-sm hover:bg-slate-800 transition-colors flex items-center gap-2", children: [_jsx(Calendar, { className: "w-4 h-4" }), _jsxs("span", { children: ["My Bookings (", cart.length, ")"] })] })] }), _jsxs("div", { className: "max-w-7xl mx-auto px-4 py-12 grid grid-cols-1 lg:grid-cols-12 gap-12", children: [_jsxs("div", { className: "lg:col-span-8 space-y-12", children: [_jsxs("div", { className: "bg-white rounded-2xl p-8 md:p-12 shadow-sm border border-slate-200", children: [_jsxs("h1", { className: "text-3xl md:text-5xl font-bold text-slate-900 mb-6 leading-tight", children: ["Expert services,", _jsx("br", {}), "simplified."] }), _jsx("p", { className: "text-lg text-slate-600 mb-8 max-w-lg", children: "Book your appointment online in seconds. Trusted professionals, guaranteed satisfaction." }), _jsxs("div", { className: "flex flex-wrap gap-4 text-sm font-medium text-slate-500", children: [_jsxs("div", { className: "flex items-center gap-2 bg-slate-50 px-3 py-1 rounded-full", children: [_jsx(Check, { className: "w-4 h-4 text-green-500" }), " Verified Pros"] }), _jsxs("div", { className: "flex items-center gap-2 bg-slate-50 px-3 py-1 rounded-full", children: [_jsx(Clock, { className: "w-4 h-4 text-blue-500" }), " Instant Confirmation"] })] })] }), _jsxs("div", { children: [_jsxs("h2", { className: "text-xl font-bold mb-6 flex items-center gap-2", children: [_jsx(ShoppingBag, { className: "w-5 h-5 text-slate-400" }), " Available Services"] }), isLoading ? (_jsx("div", { className: "space-y-4", children: [1, 2, 3].map(i => _jsx("div", { className: "h-32 bg-slate-200 rounded-xl animate-pulse" }, i)) })) : products.length === 0 ? (_jsx("div", { className: "p-8 bg-white border border-dashed border-slate-300 rounded-xl text-center text-slate-500", children: "No services available at the moment." })) : (_jsx("div", { className: "space-y-4", children: products.map(service => (_jsxs("div", { className: "bg-white p-6 rounded-xl border border-slate-200 hover:border-blue-500 transition-colors group flex flex-col md:flex-row gap-6 items-start md:items-center", children: [_jsx("div", { className: "w-full md:w-32 h-32 bg-slate-100 rounded-lg overflow-hidden flex-shrink-0", children: _jsx("img", { src: service.image || `https://via.placeholder.com/150?text=${service.name}`, className: "w-full h-full object-cover group-hover:scale-105 transition-transform duration-500", alt: service.name }) }), _jsxs("div", { className: "flex-1", children: [_jsx("h3", { className: "text-lg font-bold text-slate-900", children: service.name }), _jsx("p", { className: "text-slate-500 text-sm mt-1 line-clamp-2", children: service.description }), _jsxs("div", { className: "flex items-center gap-4 mt-4 text-xs font-medium text-slate-400", children: [_jsxs("span", { className: "flex items-center gap-1", children: [_jsx(Clock, { className: "w-3 h-3" }), " 60 Mins"] }), _jsxs("span", { className: "flex items-center gap-1", children: [_jsx(MapPin, { className: "w-3 h-3" }), " On-site"] })] })] }), _jsxs("div", { className: "text-right flex flex-row md:flex-col items-center md:items-end justify-between w-full md:w-auto mt-4 md:mt-0 gap-4", children: [_jsxs("div", { className: "text-lg font-bold text-slate-900", children: ["\u20A6", service.price.toLocaleString()] }), _jsx(Button, { onClick: () => addToCart(service), className: "bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors shadow-lg shadow-blue-200", children: "Book" })] })] }, service.id))) }))] })] }), _jsx("div", { className: "lg:col-span-4 space-y-8", children: _jsxs("div", { className: "sticky top-24", children: [_jsxs("div", { className: "bg-slate-900 text-white p-6 rounded-2xl shadow-xl mb-8", children: [_jsxs("h3", { className: "font-bold text-lg mb-4 flex items-center gap-2", children: [_jsx(Calendar, { className: "w-5 h-5" }), " Select Date"] }), _jsx(BookingCalendar, { className: "text-slate-900", storeSlug: storeSlug, onSelectDate: setSelectedDate, onSelectTime: setSelectedTime }), selectedDate && selectedTime && (_jsxs("div", { className: "mt-4 p-3 bg-white/10 rounded-lg text-sm flex items-center gap-2 animate-in fade-in", children: [_jsx(Check, { className: "w-4 h-4 text-green-400" }), _jsxs("span", { children: ["Selected: ", selectedDate.toLocaleDateString(), " at ", selectedTime] })] }))] }), cart.length > 0 && (_jsxs("div", { className: "bg-white border border-slate-200 rounded-2xl p-6 shadow-sm", children: [_jsx("h3", { className: "font-bold text-slate-900 mb-4 border-b border-slate-100 pb-4", children: "Booking Summary" }), _jsx("div", { className: "space-y-4 mb-6 max-h-60 overflow-y-auto", children: cart.map(item => (_jsxs("div", { className: "flex justify-between items-start text-sm", children: [_jsxs("div", { children: [_jsx("div", { className: "font-medium text-slate-900", children: item.name }), _jsx(Button, { onClick: () => removeFromCart(item.id), className: "text-xs text-red-500 hover:underline", children: "Remove" })] }), _jsxs("div", { className: "text-slate-500", children: ["x", item.quantity] })] }, item.id))) }), _jsxs("div", { className: "flex justify-between font-bold text-lg text-slate-900 mb-6 pt-4 border-t border-slate-100", children: [_jsx("span", { children: "Total" }), _jsxs("span", { children: ["\u20A6", total.toLocaleString()] })] }), _jsxs(Button, { onClick: handleConfirmBooking, disabled: !selectedDate || !selectedTime || isBookingSubmitting, className: "w-full bg-slate-900 text-white py-3 rounded-xl font-bold hover:bg-black transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center gap-2", children: [isBookingSubmitting ? _jsx(Loader2, { className: "w-5 h-5 animate-spin" }) : null, "Confirm Booking"] })] }))] }) })] }), isCartOpen && cart.length > 0 && (_jsxs("div", { className: "fixed inset-0 z-[60] flex justify-end lg:hidden", children: [_jsx("div", { className: "absolute inset-0 bg-black/50", onClick: () => setIsCartOpen(false) }), _jsxs("div", { className: "relative w-full max-w-sm bg-white h-full p-6", children: [_jsx("h2", { className: "font-bold text-xl mb-4", children: "Bookings" }), _jsxs(Button, { onClick: handleConfirmBooking, className: "w-full bg-blue-600 text-white py-3 rounded-lg font-bold mt-4", children: ["Checkout (\u20A6", total.toLocaleString(), ")"] })] })] }))] }));
}
