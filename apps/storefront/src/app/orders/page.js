"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from "react";
import { Button } from "@vayva/ui";
import { StoreShell } from "@/components/StoreShell";
import { useStore } from "@/context/StoreContext";
import { StorefrontService } from "@/services/storefront.service";
export default function OrderStatusPage() {
    const { store } = useStore();
    const [ref, setRef] = useState("");
    const [phone, setPhone] = useState("");
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    if (!store)
        return null;
    const handleSearch = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        setOrder(null);
        try {
            const result = await StorefrontService.getOrderStatus(ref, phone);
            if (result) {
                setOrder(result);
            }
            else {
                setError("Order not found. Please check your reference and phone number.");
            }
        }
        catch (err) {
            setError("An error occurred. Please try again.");
        }
        setLoading(false);
    };
    return (_jsx(StoreShell, { children: _jsxs("div", { className: "max-w-xl mx-auto px-4 py-20", children: [_jsx("h1", { className: "text-3xl font-bold mb-8 text-center", children: "Track Order" }), _jsxs("form", { onSubmit: handleSearch, className: "bg-gray-50 p-8 rounded-xl mb-12", children: [_jsxs("div", { className: "space-y-4", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-sm font-bold mb-2", children: "Order Reference" }), _jsx("input", { type: "text", value: ref, onChange: (e) => setRef(e.target.value), placeholder: "e.g. ORD-12345", className: "w-full p-3 border border-gray-200 rounded-lg outline-none focus:ring-1 focus:ring-black", required: true })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-bold mb-2", children: "Phone Number" }), _jsx("input", { type: "tel", value: phone, onChange: (e) => setPhone(e.target.value), placeholder: "e.g. +234...", className: "w-full p-3 border border-gray-200 rounded-lg outline-none focus:ring-1 focus:ring-black", required: true })] }), _jsx(Button, { type: "submit", disabled: loading, className: "w-full bg-black text-white py-4 rounded-lg font-bold hover:bg-gray-900 transition-colors disabled:opacity-50", children: loading ? "Searching..." : "Track Order" })] }), error && (_jsx("p", { className: "text-red-500 text-sm mt-4 text-center", children: error }))] }), order && (_jsxs("div", { className: "border border-gray-200 rounded-xl p-8", children: [_jsxs("div", { className: "flex justify-between items-start mb-6", children: [_jsxs("div", { children: [_jsxs("h2", { className: "text-xl font-bold", children: ["Order ", order.ref] }), _jsx("p", { className: "text-sm text-gray-500", children: new Date(order.createdAt).toLocaleDateString() })] }), _jsx("span", { className: "px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-bold uppercase", children: order.status })] }), _jsxs("div", { className: "space-y-4", children: [order.items.map((item, idx) => (_jsxs("div", { className: "flex justify-between text-sm", children: [_jsxs("span", { children: [item.quantity, "x ", item.productName] }), _jsxs("span", { className: "font-bold", children: ["\u20A6", item.price.toLocaleString()] })] }, idx))), _jsxs("div", { className: "pt-4 border-t border-gray-100 flex justify-between font-bold text-lg", children: [_jsx("span", { children: "Total" }), _jsxs("span", { children: ["\u20A6", order.total.toLocaleString()] })] })] })] }))] }) }));
}
