"use client";
import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import React, { useState, Suspense } from "react";
import { Button } from "@vayva/ui";
import { useSearchParams, useRouter } from "next/navigation";
import { StorefrontService } from "@/services/storefront.service";
import { StoreShell } from "@/components/StoreShell";
import { Search as SearchIcon, Package as PackageIcon, Clock as ClockIcon, CheckCircle as CheckCircleIcon, Truck as TruckIcon, AlertCircle as AlertCircleIcon, ChevronRight as ChevronRightIcon, Phone as PhoneIcon, } from "lucide-react";
const Search = SearchIcon;
const Package = PackageIcon;
const Clock = ClockIcon;
const CheckCircle = CheckCircleIcon;
const Truck = TruckIcon;
const AlertCircle = AlertCircleIcon;
const ChevronRight = ChevronRightIcon;
const Phone = PhoneIcon;
function OrderStatusContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const [ref, setRef] = useState(searchParams.get("ref") || "");
    const [phone, setPhone] = useState(searchParams.get("phone") || "");
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const handleLookup = async (e) => {
        if (e)
            e.preventDefault();
        if (!ref || !phone)
            return;
        setLoading(true);
        setError(null);
        setOrder(null);
        try {
            const data = await StorefrontService.getOrderStatus(ref, phone);
            if (data) {
                setOrder(data);
            }
            else {
                setError("No order found with these details. Please check and try again.");
            }
        }
        catch (err) {
            setError("An error occurred during lookup.");
        }
        finally {
            setLoading(false);
        }
    };
    // Auto-lookup if params exist
    React.useEffect(() => {
        if (searchParams.get("ref") && searchParams.get("phone")) {
            handleLookup();
        }
    }, []);
    const getStatusIcon = (status) => {
        switch (status) {
            case "PAID":
                return _jsx(CheckCircle, { className: "text-green-500" });
            case "PENDING_PAYMENT":
                return _jsx(Clock, { className: "text-orange-500" });
            case "SHIPPED":
                return _jsx(Truck, { className: "text-blue-500" });
            default:
                return _jsx(Package, { className: "text-gray-400" });
        }
    };
    return (_jsx(StoreShell, { children: _jsxs("div", { className: "max-w-2xl mx-auto px-4 py-12 lg:py-20 font-sans", children: [_jsxs("div", { className: "text-center mb-12", children: [_jsx("h1", { className: "text-3xl font-bold tracking-tight mb-4", children: "Track Your Order" }), _jsx("p", { className: "text-gray-500", children: "Enter your order reference and phone number to see the current status." })] }), _jsxs("div", { className: "bg-white p-8 rounded-3xl border border-gray-100 shadow-xl shadow-gray-200/50 mb-12", children: [_jsxs("form", { onSubmit: handleLookup, className: "space-y-6", children: [_jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: [_jsxs("div", { className: "space-y-2", children: [_jsx("label", { htmlFor: "order-ref", className: "text-xs font-bold text-gray-400 uppercase tracking-widest pl-1", children: "Order Reference" }), _jsx("input", { id: "order-ref", value: ref, onChange: (e) => setRef(e.target.value.toUpperCase()), className: "w-full p-4 bg-gray-50 border border-gray-100 rounded-xl focus:ring-1 focus:ring-black outline-none transition-all", placeholder: "VVA-XXXXX", required: true })] }), _jsxs("div", { className: "space-y-2", children: [_jsx("label", { htmlFor: "order-phone", className: "text-xs font-bold text-gray-400 uppercase tracking-widest pl-1", children: "Phone Number" }), _jsx("input", { id: "order-phone", value: phone, onChange: (e) => setPhone(e.target.value), className: "w-full p-4 bg-gray-50 border border-gray-100 rounded-xl focus:ring-1 focus:ring-black outline-none transition-all", placeholder: "080XXXXXXXX", required: true })] })] }), _jsx(Button, { type: "submit", disabled: loading, className: "w-full bg-black text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-gray-900 transition-all disabled:opacity-50", children: loading ? ("Searching...") : (_jsxs(_Fragment, { children: [_jsx(Search, { size: 18 }), " Track Order"] })) })] }), error && (_jsxs("div", { className: "mt-6 p-4 bg-red-50 text-red-600 rounded-xl flex items-center gap-3 text-sm animate-in fade-in slide-in-from-top-2", children: [_jsx(AlertCircle, { size: 18 }), error] }))] }), order && (_jsxs("div", { className: "space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500", children: [_jsxs("div", { className: "p-8 bg-black text-white rounded-3xl overflow-hidden relative", children: [_jsx("div", { className: "absolute top-0 right-0 p-8 opacity-10", children: _jsx(Package, { size: 120 }) }), _jsxs("div", { className: "relative z-10", children: [_jsxs("div", { className: "flex justify-between items-start mb-6", children: [_jsxs("div", { children: [_jsx("p", { className: "text-xs opacity-60 uppercase tracking-widest font-bold mb-1", children: "Status" }), _jsx("h2", { className: "text-2xl font-bold", children: order.status.replace("_", " ") })] }), _jsxs("div", { className: "text-right", children: [_jsx("p", { className: "text-xs opacity-60 uppercase tracking-widest font-bold mb-1", children: "Ref" }), _jsx("h2", { className: "text-2xl font-bold", children: order.refCode })] })] }), _jsxs("div", { className: "flex items-center gap-2 text-sm", children: [_jsx(CheckCircle, { size: 16, className: order.paymentStatus === "SUCCESS"
                                                        ? "text-green-400"
                                                        : "text-gray-500" }), _jsxs("span", { children: ["Payment ", order.paymentStatus.toLowerCase()] })] })] })] }), _jsxs("div", { className: "space-y-6", children: [_jsx("h3", { className: "font-bold text-lg px-2", children: "Timeline" }), _jsx("div", { className: "space-y-8 relative before:absolute before:left-4 before:top-2 before:bottom-2 before:w-0.5 before:bg-gray-100", children: order.timeline?.map((event, idx) => (_jsxs("div", { className: "flex gap-6 relative", children: [_jsx("div", { className: `w-8 h-8 rounded-full border-4 border-white flex items-center justify-center z-10 shadow-sm ${idx === 0 ? "bg-black text-white scale-110" : "bg-gray-200 text-gray-400"}`, children: getStatusIcon(event.type) }), _jsxs("div", { children: [_jsx("p", { className: `font-bold text-sm ${idx === 0 ? "text-black" : "text-gray-500"}`, children: event.text }), _jsx("p", { className: "text-xs text-gray-400 mt-1", children: new Date(event.createdAt).toLocaleString() })] })] }, idx))) })] }), _jsxs("div", { className: "p-6 border border-gray-100 rounded-2xl flex items-center justify-between", children: [_jsxs("div", { className: "flex items-center gap-3", children: [_jsx("div", { className: "w-10 h-10 bg-gray-50 rounded-full flex items-center justify-center", children: _jsx(Phone, { size: 18, className: "text-gray-400" }) }), _jsxs("div", { children: [_jsx("p", { className: "text-xs text-gray-500", children: "Need help with this order?" }), _jsx("p", { className: "text-sm font-bold", children: "Contact Support" })] })] }), _jsx("a", { href: `https://wa.me/2348001234567?text=Hi, status update for ${order.refCode}`, target: "_blank", className: "text-sm font-bold text-black border-b border-black", children: "WhatsApp" })] })] }))] }) }));
}
export default function OrderStatusPage() {
    return (_jsx(Suspense, { fallback: _jsx("div", { className: "p-20 text-center", children: "Loading status..." }), children: _jsx(OrderStatusContent, {}) }));
}
