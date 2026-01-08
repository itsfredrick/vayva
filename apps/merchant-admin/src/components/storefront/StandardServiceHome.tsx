"use client";

import React, { useState } from "react";
import {
    useStorefrontProducts,
    useStorefrontStore,
} from "@/hooks/storefront/useStorefront";
import { useStorefrontCart } from "@/hooks/storefront/useStorefrontCart";
import { CheckoutModal } from "./CheckoutModal";
import { BookingCalendar } from "./features/BookingCalendar";
import { Calendar, Clock, MapPin, Check, ShoppingBag, X, Plus, Minus, Loader2 } from "lucide-react";
import { toast } from "sonner"

export function StandardServiceHome({
    storeName: initialStoreName,
    storeSlug
}: {
    storeName?: string;
    storeSlug?: string
}) {
    const { store } = useStorefrontStore(storeSlug);
    const { products, isLoading } = useStorefrontProducts(storeSlug, { limit: 12 });
    const { cart, addToCart, removeFromCart, updateQuantity, total, isOpen: isCartOpen, setIsOpen: setIsCartOpen, clearCart } = useStorefrontCart(storeSlug || "");
    const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);

    // Booking State
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);
    const [selectedTime, setSelectedTime] = useState<string | null>(null);
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
        } catch (error) {
            console.error("Booking error", error);
            toast.error("Failed to prepare booking.");
        } finally {
            setIsBookingSubmitting(false);
        }
    };

    const handleCheckoutSuccess = async (customerData?: any) => {
        if (!storeSlug || !selectedDate || !selectedTime) {
            clearCart();
            return;
        }

        console.log("Checkout success. Creating bookings...");

        try {
            // In a real implementation:
            // 1. We would have the customer's email from the checkout process (customerData)
            // 2. We would POST to /api/storefront/[slug]/bookings 
            //    with { date, time, serviceIds: cart.map(i => i.id), customer: customerData }

            // For this implementation, we simulate success as the API endpoints exists 
            // and we want to allow the "Guest" flow to proceed visually.
            toast.success("Booking confirmed! Check your email.");
        } catch (e) {
            console.error(e);
            toast.error("Failed to create booking records.");
        }

        clearCart();
        setSelectedDate(null);
        setSelectedTime(null);
    };

    const handleBookingSubmit = async (formData: any) => {
        const dateStr = selectedDate?.toLocaleDateString('en-CA');

        // Create a booking for each service in the cart
        // NOTE: Ideally we batch this, but for now we loop
        const promises = cart.map(item =>
            fetch(`/api/storefront/${storeSlug}/bookings`, {
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
            })
        );

        await Promise.all(promises);
        // Errors caught by CheckoutModal
    };

    return (
        <div className="min-h-screen bg-[#F8FAFC] text-slate-800 font-sans">
            <CheckoutModal
                isOpen={isCheckoutOpen}
                onClose={() => setIsCheckoutOpen(false)}
                cart={cart}
                total={total}
                storeSlug={storeSlug || ""}
                onSuccess={handleCheckoutSuccess}
                requireAddress={false} // Services might not need shipping address if on-site
                submitFn={handleBookingSubmit}
            />

            {/* Navbar */}
            <nav className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between sticky top-0 z-50">
                <div className="font-bold text-xl tracking-tight text-slate-900">{displayName}</div>
                <button
                    onClick={() => setIsCartOpen(true)}
                    className="bg-slate-900 text-white px-5 py-2 rounded-lg font-medium text-sm hover:bg-slate-800 transition-colors flex items-center gap-2"
                >
                    <Calendar className="w-4 h-4" />
                    <span>My Bookings ({cart.length})</span>
                </button>
            </nav>

            <div className="max-w-7xl mx-auto px-4 py-12 grid grid-cols-1 lg:grid-cols-12 gap-12">
                {/* Left Column: Services */}
                <div className="lg:col-span-8 space-y-12">
                    {/* Hero Card */}
                    <div className="bg-white rounded-2xl p-8 md:p-12 shadow-sm border border-slate-200">
                        <h1 className="text-3xl md:text-5xl font-bold text-slate-900 mb-6 leading-tight">
                            Expert services,<br />simplified.
                        </h1>
                        <p className="text-lg text-slate-600 mb-8 max-w-lg">
                            Book your appointment online in seconds. Trusted professionals, guaranteed satisfaction.
                        </p>
                        <div className="flex flex-wrap gap-4 text-sm font-medium text-slate-500">
                            <div className="flex items-center gap-2 bg-slate-50 px-3 py-1 rounded-full"><Check className="w-4 h-4 text-green-500" /> Verified Pros</div>
                            <div className="flex items-center gap-2 bg-slate-50 px-3 py-1 rounded-full"><Clock className="w-4 h-4 text-blue-500" /> Instant Confirmation</div>
                        </div>
                    </div>

                    {/* Service List */}
                    <div>
                        <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                            <ShoppingBag className="w-5 h-5 text-slate-400" /> Available Services
                        </h2>
                        {isLoading ? (
                            <div className="space-y-4">
                                {[1, 2, 3].map(i => <div key={i} className="h-32 bg-slate-200 rounded-xl animate-pulse" />)}
                            </div>
                        ) : products.length === 0 ? (
                            <div className="p-8 bg-white border border-dashed border-slate-300 rounded-xl text-center text-slate-500">
                                No services available at the moment.
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {products.map(service => (
                                    <div key={service.id} className="bg-white p-6 rounded-xl border border-slate-200 hover:border-blue-500 transition-colors group flex flex-col md:flex-row gap-6 items-start md:items-center">
                                        <div className="w-full md:w-32 h-32 bg-slate-100 rounded-lg overflow-hidden flex-shrink-0">
                                            <img src={service.image || `https://via.placeholder.com/150?text=${service.name}`} className="w-full h-full object-cover" />
                                        </div>
                                        <div className="flex-1">
                                            <h3 className="text-lg font-bold text-slate-900">{service.name}</h3>
                                            <p className="text-slate-500 text-sm mt-1 line-clamp-2">{service.description}</p>
                                            <div className="flex items-center gap-4 mt-4 text-xs font-medium text-slate-400">
                                                <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> 60 Mins</span>
                                                <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> On-site</span>
                                            </div>
                                        </div>
                                        <div className="text-right flex flex-row md:flex-col items-center md:items-end justify-between w-full md:w-auto mt-4 md:mt-0 gap-4">
                                            <div className="text-lg font-bold text-slate-900">₦{service.price.toLocaleString()}</div>
                                            <button
                                                onClick={() => addToCart(service)}
                                                className="bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors shadow-lg shadow-blue-200"
                                            >
                                                Book
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Right Column: Calendar & Cart */}
                <div className="lg:col-span-4 space-y-8">
                    <div className="sticky top-24">
                        <div className="bg-slate-900 text-white p-6 rounded-2xl shadow-xl mb-8">
                            <h3 className="font-bold text-lg mb-4 flex items-center gap-2"><Calendar className="w-5 h-5" /> Select Date</h3>
                            <BookingCalendar
                                className="text-slate-900"
                                storeSlug={storeSlug}
                                onSelectDate={setSelectedDate}
                                onSelectTime={setSelectedTime}
                            />
                            {selectedDate && selectedTime && (
                                <div className="mt-4 p-3 bg-white/10 rounded-lg text-sm flex items-center gap-2 animate-in fade-in">
                                    <Check className="w-4 h-4 text-green-400" />
                                    <span>Selected: {selectedDate.toLocaleDateString()} at {selectedTime}</span>
                                </div>
                            )}
                        </div>

                        {cart.length > 0 && (
                            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
                                <h3 className="font-bold text-slate-900 mb-4 border-b border-slate-100 pb-4">Booking Summary</h3>
                                <div className="space-y-4 mb-6 max-h-60 overflow-y-auto">
                                    {cart.map(item => (
                                        <div key={item.id} className="flex justify-between items-start text-sm">
                                            <div>
                                                <div className="font-medium text-slate-900">{item.name}</div>
                                                <button onClick={() => removeFromCart(item.id)} className="text-xs text-red-500 hover:underline">Remove</button>
                                            </div>
                                            <div className="text-slate-500">x{item.quantity}</div>
                                        </div>
                                    ))}
                                </div>
                                <div className="flex justify-between font-bold text-lg text-slate-900 mb-6 pt-4 border-t border-slate-100">
                                    <span>Total</span>
                                    <span>₦{total.toLocaleString()}</span>
                                </div>
                                <button
                                    onClick={handleConfirmBooking}
                                    disabled={!selectedDate || !selectedTime || isBookingSubmitting}
                                    className="w-full bg-slate-900 text-white py-3 rounded-xl font-bold hover:bg-black transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center gap-2"
                                >
                                    {isBookingSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : null}
                                    Confirm Booking
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Cart Overlay (Reuse standard logic for mobile/consistency) */}
            {isCartOpen && cart.length > 0 && (
                <div className="fixed inset-0 z-[60] flex justify-end lg:hidden">
                    <div className="absolute inset-0 bg-black/50" onClick={() => setIsCartOpen(false)} />
                    <div className="relative w-full max-w-sm bg-white h-full p-6">
                        <h2 className="font-bold text-xl mb-4">Bookings</h2>
                        <button
                            onClick={handleConfirmBooking}
                            className="w-full bg-blue-600 text-white py-3 rounded-lg font-bold mt-4"
                        >
                            Checkout (₦{total.toLocaleString()})
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
