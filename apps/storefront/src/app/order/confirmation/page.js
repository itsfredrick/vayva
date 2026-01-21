"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { StoreShell } from "@/components/StoreShell";
import { CheckCircle as CheckCircleIcon, Clock as ClockIcon, XCircle as XCircleIcon, ChevronRight as ChevronRightIcon, Package as PackageIcon, MapPin as MapPinIcon, Phone as PhoneIcon, } from "lucide-react";
const CheckCircle = CheckCircleIcon;
const Clock = ClockIcon;
const XCircle = XCircleIcon;
const ChevronRight = ChevronRightIcon;
const Package = PackageIcon;
const MapPin = MapPinIcon;
const Phone = PhoneIcon;
import NextLink from "next/link";
const Link = NextLink;
function OrderConfirmationContent() {
    const searchParams = useSearchParams();
    const reference = searchParams.get("reference");
    const orderId = searchParams.get("orderId"); // We might have orderId or reference
    const storeSlug = searchParams.get("store");
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    useEffect(() => {
        const fetchOrder = async () => {
            if (!reference && !orderId) {
                setLoading(false);
                return;
            }
            try {
                // If we have orderId but no reference, we might need a direct getOrder.
                // But for confirmation after Paystack, we usually have reference.
                // For now, let's assume we can lookup by a combination or just use the test-compliant getOrderStatus.
                // In a real app, we'd have a specific getOrderById for public use (guarded by session or token).
                // Let's use getOrderStatus but we need the phone number too for security.
                // However, right after checkout, we might just have the order data in state or session.
                // For this demo, let's allow lookup by ref if we're on the confirmation page.
                const apiBase = process.env.NEXT_PUBLIC_API_URL || "";
                if (!apiBase && process.env.NODE_ENV === "production") {
                    console.error("NEXT_PUBLIC_API_URL is missing in production");
                }
                const response = await fetch(`${apiBase}/public/orders/status?ref=${reference}`);
                if (response.ok) {
                    setOrder(await response.json());
                }
                else {
                    setError("Order not found");
                }
            }
            catch (err) {
                setError("Failed to load order details");
            }
            finally {
                setLoading(false);
            }
        };
        fetchOrder();
    }, [reference, orderId]);
    if (loading)
        return _jsx("div", { className: "py-20 text-center", children: "Verifying your payment..." });
    if (!order) {
        return (_jsx(StoreShell, { children: _jsxs("div", { className: "max-w-2xl mx-auto px-4 py-20 text-center", children: [_jsx(XCircle, { className: "w-16 h-16 text-red-500 mx-auto mb-6" }), _jsx("h1", { className: "text-3xl font-bold mb-4", children: "Order Not Found" }), _jsx("p", { className: "text-gray-500 mb-8", children: "We couldn't find the order you're looking for. If you just paid, it might take a moment to reflect." }), _jsx(Link, { href: `/?store=${storeSlug}`, className: "bg-black text-white px-8 py-4 rounded-lg font-bold", children: "Return Home" })] }) }));
    }
    const isPaid = order.paymentStatus === "SUCCESS" || order.status === "PAID";
    return (_jsx(StoreShell, { children: _jsxs("div", { className: "max-w-3xl mx-auto px-4 py-12 lg:py-20 font-sans", children: [_jsxs("div", { className: "mb-12", children: [_jsxs("div", { className: "flex items-center gap-2 text-xs text-gray-500 mb-6", children: [_jsx("span", { children: "Cart" }), " ", _jsx(ChevronRight, { size: 12 }), " ", _jsx("span", { children: "Information" }), " ", _jsx(ChevronRight, { size: 12 }), " ", _jsx("span", { className: "text-black font-bold", children: "Confirmation" })] }), _jsxs("div", { className: "flex items-start gap-4", children: [isPaid ? (_jsx("div", { className: "w-12 h-12 bg-green-50 text-green-600 rounded-full flex items-center justify-center flex-shrink-0", children: _jsx(CheckCircle, { size: 24 }) })) : (_jsx("div", { className: "w-12 h-12 bg-orange-50 text-orange-600 rounded-full flex items-center justify-center flex-shrink-0", children: _jsx(Clock, { size: 24 }) })), _jsxs("div", { children: [_jsxs("p", { className: "text-sm text-gray-500 uppercase tracking-widest font-bold mb-1", children: ["Order ", order.refCode] }), _jsx("h1", { className: "text-3xl font-bold tracking-tight", children: isPaid
                                                ? "Thank you for your purchase!"
                                                : "Order is pending payment" }), _jsx("p", { className: "text-gray-500 mt-2", children: isPaid
                                                ? `We've received your order and we're getting it ready for ${order.customer?.deliveryMethod === "PICKUP" ? "pickup" : "delivery"}.`
                                                : "Your payment is being processed. Refresh this page in a moment to see the updated status." })] })] })] }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-8", children: [_jsxs("div", { className: "space-y-8", children: [_jsxs("div", { className: "p-6 bg-gray-50 rounded-2xl border border-gray-100", children: [_jsxs("h2", { className: "font-bold mb-4 flex items-center gap-2", children: [_jsx(Package, { size: 18 }), "Order Details"] }), _jsxs("div", { className: "space-y-4", children: [order.items?.map((item, idx) => (_jsxs("div", { className: "flex justify-between text-sm", children: [_jsxs("span", { className: "text-gray-600", children: [item.title, " x ", item.quantity] }), _jsxs("span", { className: "font-medium text-black", children: ["\u20A6", Number(item.price).toLocaleString()] })] }, idx))), _jsxs("div", { className: "pt-4 border-t border-gray-200 space-y-2", children: [_jsxs("div", { className: "flex justify-between text-sm", children: [_jsx("span", { className: "text-gray-500", children: "Subtotal" }), _jsxs("span", { children: ["\u20A6", Number(order.subtotal).toLocaleString()] })] }), _jsxs("div", { className: "flex justify-between text-sm", children: [_jsx("span", { className: "text-gray-500", children: "Shipping" }), _jsxs("span", { children: ["\u20A6", Number(order.shippingTotal).toLocaleString()] })] }), _jsxs("div", { className: "flex justify-between text-lg font-bold pt-2", children: [_jsx("span", { children: "Total" }), _jsxs("span", { children: ["\u20A6", Number(order.total).toLocaleString()] })] })] })] })] }), _jsxs("div", { className: "p-6 bg-white rounded-2xl border border-gray-100 shadow-sm", children: [_jsxs("h2", { className: "font-bold mb-4 flex items-center gap-2", children: [_jsx(MapPin, { size: 18 }), order.customer?.deliveryMethod === "PICKUP"
                                                    ? "Pickup Location"
                                                    : "Shipping Address"] }), _jsxs("p", { className: "text-sm text-gray-600 leading-relaxed", children: [order.customer?.name, _jsx("br", {}), order.customer?.deliveryMethod === "PICKUP"
                                                    ? "Downtown Hub, Lagos"
                                                    : order.timeline?.[0]?.metadata?.address ||
                                                        "Address not listed"] })] })] }), _jsxs("div", { className: "space-y-8", children: [_jsxs("div", { className: "p-6 bg-black text-white rounded-3xl shadow-xl shadow-black/10", children: [_jsx("h2", { className: "font-bold text-lg mb-4", children: "What's next?" }), _jsxs("ul", { className: "space-y-4 text-sm opacity-90", children: [_jsxs("li", { className: "flex gap-3", children: [_jsx("div", { className: "w-5 h-5 bg-white/20 rounded-full flex items-center justify-center text-[10px] font-bold mt-0.5", children: "1" }), _jsx("span", { children: "You'll receive a confirmation email with your receipt shortly." })] }), _jsxs("li", { className: "flex gap-3", children: [_jsx("div", { className: "w-5 h-5 bg-white/20 rounded-full flex items-center justify-center text-[10px] font-bold mt-0.5", children: "2" }), _jsx("span", { children: order.customer?.deliveryMethod === "PICKUP"
                                                                ? "We will notify you when your order is ready for pickup."
                                                                : "Once shipped, we'll send you a tracking number via WhatsApp." })] })] }), _jsx("div", { className: "mt-8 pt-8 border-t border-white/10", children: _jsx(Link, { href: `/order/status?ref=${order.refCode}&phone=${order.customer?.phone || ""}&store=${storeSlug}`, className: "w-full bg-white text-black py-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-gray-100 transition-colors", children: "Track Your Order" }) })] }), _jsxs("div", { className: "p-6 border border-gray-100 rounded-2xl", children: [_jsxs("h2", { className: "font-bold mb-4 flex items-center gap-2", children: [_jsx(Phone, { size: 18 }), "Need help?"] }), _jsx("p", { className: "text-sm text-gray-500 mb-4", children: "If you have any questions about your order, feel free to reach out to us." }), _jsx("a", { href: `https://wa.me/2348001234567?text=Hi, I have a question about my order ${order.refCode}`, target: "_blank", className: "text-sm font-bold text-green-600 underline", children: "Chat with us on WhatsApp" })] })] })] })] }) }));
}
export default function OrderConfirmationPage() {
    return (_jsx(Suspense, { fallback: _jsx("div", { className: "p-20 text-center", children: "Loading confirmation..." }), children: _jsx(OrderConfirmationContent, {}) }));
}
