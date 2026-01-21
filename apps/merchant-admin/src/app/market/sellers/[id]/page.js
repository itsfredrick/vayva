"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React from "react";
import { MarketShell } from "@/components/market/market-shell";
import { MarketProductCard, } from "@/components/market/market-product-card";
import { Button, Icon } from "@vayva/ui";
const DEMO_PRODUCTS = [
    {
        id: "1",
        name: "MacBook Pro M3 Max",
        price: "₦ 3,500,000",
        image: "",
        sellerName: "TechDepot",
        sellerVerified: true,
        inStock: true,
        rating: 4.8,
    },
    {
        id: "2",
        name: 'iPad Pro 12.9"',
        price: "₦ 1,800,000",
        image: "",
        sellerName: "TechDepot",
        sellerVerified: true,
        inStock: true,
        rating: 5.0,
    },
    {
        id: "3",
        name: "Magic Keyboard",
        price: "₦ 450,000",
        image: "",
        sellerName: "TechDepot",
        sellerVerified: true,
        inStock: true,
        rating: 4.9,
    },
];
export default function SellerProfilePage({ params, }) {
    const { id } = React.use(params);
    const sellerName = "TechDepot"; // derived from params id in real app
    return (_jsxs(MarketShell, { children: [_jsx("div", { className: "bg-[#0b141a] border-b border-white/5 py-12", children: _jsxs("div", { className: "max-w-5xl mx-auto px-4 flex flex-col md:flex-row items-center md:items-start gap-8", children: [_jsx("div", { className: "w-24 h-24 rounded-2xl bg-indigo-500 flex items-center justify-center text-4xl font-bold text-white shadow-2xl", children: sellerName.charAt(0) }), _jsxs("div", { className: "flex-1 text-center md:text-left", children: [_jsxs("h1", { className: "text-3xl font-bold text-white mb-2 flex items-center justify-center md:justify-start gap-2", children: [sellerName, _jsx(Icon, { name: "ShieldCheck", className: "text-blue-400", size: 24 })] }), _jsxs("div", { className: "flex items-center justify-center md:justify-start gap-4 text-sm text-text-secondary mb-4", children: [_jsxs("span", { className: "flex items-center gap-1", children: [_jsx(Icon, { name: "MapPin", size: 16 }), " Ikeja, Lagos"] }), _jsxs("span", { className: "flex items-center gap-1", children: [_jsx(Icon, { name: "Star", size: 16, className: "text-yellow-400" }), " 4.8 (120 reviews)"] }), _jsxs("span", { className: "flex items-center gap-1", children: [_jsx(Icon, { name: "Clock", size: 16 }), " Joined 2024"] })] }), _jsx("p", { className: "text-white/80 max-w-xl", children: "Your #1 source for premium Apple products in Lagos. We sell authentic gadgets with warranty. Fast delivery guaranteed." })] }), _jsxs("div", { className: "flex gap-3", children: [_jsxs(Button, { className: "rounded-full bg-white text-black hover:bg-white/90 font-bold", children: [_jsx(Icon, { name: "MessageCircle", size: 18, className: "mr-2" }), " Message"] }), _jsx(Button, { variant: "outline", size: "icon", className: "rounded-full border-white/10 text-white hover:bg-white/5", children: _jsx(Icon, { name: "Share2", size: 18 }) })] })] }) }), _jsxs("div", { className: "max-w-5xl mx-auto px-4 py-8", children: [_jsxs("div", { className: "flex gap-8 border-b border-white/5 mb-8 overflow-x-auto", children: [_jsx(Button, { className: "pb-4 text-primary font-bold border-b-2 border-primary whitespace-nowrap", children: "Products (24)" }), _jsx(Button, { className: "pb-4 text-text-secondary hover:text-white font-medium whitespace-nowrap", children: "About" }), _jsx(Button, { className: "pb-4 text-text-secondary hover:text-white font-medium whitespace-nowrap", children: "Policies" }), _jsx(Button, { className: "pb-4 text-text-secondary hover:text-white font-medium whitespace-nowrap", children: "Reviews" })] }), _jsx("div", { className: "grid grid-cols-2 md:grid-cols-3 gap-6", children: DEMO_PRODUCTS.map((product) => (_jsx(MarketProductCard, { product: product }, product.id))) })] })] }));
}
