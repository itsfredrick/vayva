"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from "react";
import axios from "axios";
const API_URL = process.env.NEXT_PUBLIC_API_URL || "";
export default function StoreDirectoryPage() {
    const [stores, setStores] = useState([]);
    const [filters, setFilters] = useState({ state: "", city: "", category: "" });
    const [isLoading, setIsLoading] = useState(true);
    const fetchStores = async () => {
        try {
            const params = new URLSearchParams(filters).toString();
            const res = await axios.get(`${API_URL}/marketplace/stores?${params}`);
            setStores(res.data || []);
        }
        catch (err) {
            console.error(err);
        }
        finally {
            setIsLoading(false);
        }
    };
    useEffect(() => {
        fetchStores();
    }, [filters]);
    return (_jsxs("div", { className: "min-h-screen bg-[#F7FAF7]", children: [_jsx("div", { className: "bg-white border-b border-gray-100 px-8 py-12", children: _jsxs("div", { className: "max-w-6xl mx-auto", children: [_jsx("h1", { className: "text-4xl font-bold text-[#0B1220] mb-4", children: "Discover Stores" }), _jsx("p", { className: "text-lg text-[#525252] mb-8", children: "Find trusted Nigerian merchants near you" }), _jsxs("div", { className: "flex gap-4", children: [_jsxs("select", { className: "px-4 py-3 border border-gray-200 rounded-lg bg-white", value: filters.state, onChange: (e) => setFilters({ ...filters, state: e.target.value }), children: [_jsx("option", { value: "", children: "All States" }), _jsx("option", { value: "Lagos", children: "Lagos" }), _jsx("option", { value: "FCT", children: "Abuja (FCT)" }), _jsx("option", { value: "Rivers", children: "Rivers" })] }), _jsxs("select", { className: "px-4 py-3 border border-gray-200 rounded-lg bg-white", value: filters.city, onChange: (e) => setFilters({ ...filters, city: e.target.value }), children: [_jsx("option", { value: "", children: "All Cities" }), _jsx("option", { value: "Ikeja", children: "Ikeja" }), _jsx("option", { value: "Lekki", children: "Lekki" }), _jsx("option", { value: "Abuja", children: "Abuja" })] })] })] }) }), _jsx("div", { className: "max-w-6xl mx-auto px-8 py-12", children: isLoading ? (_jsx("div", { className: "text-center text-gray-400 py-12", children: "Loading stores..." })) : stores.length === 0 ? (_jsx("div", { className: "text-center text-gray-400 py-12", children: "No stores found." })) : (_jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6", children: stores.map((store) => (_jsxs("div", { className: "bg-white rounded-2xl border border-gray-100 shadow-sm p-6 hover:shadow-lg transition-all", children: [_jsxs("div", { className: "flex items-center gap-4 mb-4", children: [_jsx("div", { className: "w-16 h-16 bg-gray-100 rounded-xl flex items-center justify-center text-2xl font-bold text-gray-400", children: store.displayName[0] }), _jsxs("div", { children: [_jsx("h3", { className: "font-bold text-[#0B1220]", children: store.displayName }), _jsxs("p", { className: "text-sm text-[#525252]", children: [store.city, ", ", store.state] })] })] }), _jsxs("div", { className: "flex gap-2 mb-4", children: [_jsx("span", { className: "text-xs bg-green-50 text-green-600 px-2 py-1 rounded font-bold", children: "Verified" }), store.pickupAvailable && (_jsx("span", { className: "text-xs bg-blue-50 text-blue-600 px-2 py-1 rounded font-bold", children: "Pickup" }))] }), _jsxs("div", { className: "flex gap-2", children: [_jsx("a", { href: `/stores/${store.slug}`, className: "flex-1 px-4 py-2 bg-[#22C55E] text-white rounded-lg text-center font-medium hover:bg-[#16A34A] transition-all", children: "Visit Store" }), store.whatsappNumberE164 && (_jsx("a", { href: `https://wa.me/${store.whatsappNumberE164}`, className: "px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-all", children: "\uD83D\uDCAC" }))] })] }, store.id))) })) })] }));
}
