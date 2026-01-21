"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from "react";
import Link from "next/link";
import { MarketShell } from "@/components/market/market-shell";
import { MarketProductCard, } from "@/components/market/market-product-card";
import { Button, Icon } from "@vayva/ui";
const CATEGORIES = [
    { name: "Fashion", icon: "Shirt", count: "2.5k" },
    { name: "Electronics", icon: "Monitor", count: "1.2k" },
    { name: "Beauty", icon: "Sparkles", count: "850" },
    { name: "Home", icon: "Armchair", count: "3.4k" },
    { name: "Groceries", icon: "ShoppingCart", count: "500+" },
    { name: "Phones", icon: "Smartphone", count: "900+" },
    { name: "Services", icon: "PenTool", count: "120" },
    { name: "More", icon: "LayoutGrid", count: "View all" },
];
export default function MarketHomePage() {
    const [products, setProducts] = useState([]);
    const [sellers, setSellers] = useState([]);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        async function fetchData() {
            try {
                const [prodRes, sellRes] = await Promise.all([
                    fetch("/api/market/products?limit=10"),
                    fetch("/api/market/sellers")
                ]);
                if (prodRes.ok) {
                    setProducts(await prodRes.json());
                }
                if (sellRes.ok) {
                    setSellers(await sellRes.json());
                }
            }
            catch (err) {
                console.error("Market Load Error", err);
            }
            finally {
                setLoading(false);
            }
        }
        fetchData();
    }, []);
    return (_jsxs(MarketShell, { children: [_jsxs("section", { className: "relative h-[400px] mb-12", children: [_jsxs("div", { className: "absolute inset-0 bg-[#0f1a14] overflow-hidden", children: [_jsx("div", { className: "absolute top-0 left-1/4 w-[500px] h-[500px] bg-primary/20 rounded-full blur-[120px] mix-blend-screen opacity-30" }), _jsx("div", { className: "absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-blue-500/20 rounded-full blur-[100px] mix-blend-screen opacity-30" })] }), _jsxs("div", { className: "relative z-10 h-full flex flex-col items-center justify-center max-w-4xl mx-auto px-4 text-center", children: [_jsxs("h1", { className: "text-4xl md:text-6xl font-bold text-white mb-6", children: ["Discover Verified Sellers ", _jsx("br", {}), " ", _jsx("span", { className: "text-transparent bg-clip-text bg-gradient-to-r from-primary to-emerald-400", children: "in Nigeria." })] }), _jsxs("div", { className: "w-full max-w-2xl relative mb-8", children: [_jsx("input", { className: "w-full h-14 bg-white/10 backdrop-blur-md border border-white/20 rounded-full pl-6 pr-14 text-lg text-white placeholder:text-white/40 focus:outline-none focus:border-primary focus:bg-white/15 transition-all shadow-2xl", placeholder: "What are you looking for today?" }), _jsx(Button, { className: "absolute right-2 top-2 h-10 w-10 bg-primary rounded-full flex items-center justify-center text-black hover:bg-primary/90 transition-colors", children: _jsx(Icon, { name: "Search", size: 24 }) })] }), _jsx("div", { className: "flex flex-wrap justify-center gap-2", children: ["Fashion", "Sneakers", "iPhone 15", "Skincare", "Lagos"].map((tag) => (_jsx(Link, { href: "/market/search", className: "px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-sm text-white/70 hover:text-white hover:bg-white/10 transition-colors", children: tag }, tag))) })] })] }), _jsxs("div", { className: "max-w-[1400px] mx-auto px-4 lg:px-6 space-y-20 pb-12", children: [_jsxs("section", { children: [_jsxs("div", { className: "flex justify-between items-end mb-6", children: [_jsx("h2", { className: "text-2xl font-bold text-white", children: "Shop by Category" }), _jsxs(Link, { href: "/market/categories/all", className: "text-primary hover:text-primary/80 font-bold text-sm flex items-center gap-1", children: ["View All ", _jsx(Icon, { name: "ArrowRight", size: 16 })] })] }), _jsx("div", { className: "grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4", children: CATEGORIES.map((cat) => (_jsx(Link, { href: `/market/categories/${cat.name.toLowerCase()}`, children: _jsxs("div", { className: "group bg-white/5 rounded-xl p-4 border border-white/5 hover:border-primary/50 hover:bg-white/10 transition-all text-center h-full flex flex-col items-center justify-center gap-3", children: [_jsx(Icon, { name: cat.icon, size: 32, className: "text-text-secondary group-hover:text-primary transition-colors" }), _jsxs("div", { children: [_jsx("div", { className: "font-bold text-white text-sm", children: cat.name }), _jsx("div", { className: "text-[10px] text-text-secondary mt-1", children: cat.count })] })] }) }, cat.name))) })] }), _jsxs("section", { children: [_jsx("div", { className: "flex justify-between items-end mb-6", children: _jsx("h2", { className: "text-2xl font-bold text-white", children: "Trending on Vayva" }) }), loading ? (_jsx("div", { className: "text-white text-center", children: "Loading Market..." })) : (_jsx("div", { className: "grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6", children: products.length === 0 ? (_jsx("div", { className: "col-span-full text-center text-white/50 py-10", children: "No products found. Be the first to list!" })) : products.map((product) => (_jsx(MarketProductCard, { product: product }, product.id))) }))] }), _jsxs("section", { children: [_jsx("div", { className: "flex justify-between items-end mb-6", children: _jsx("h2", { className: "text-2xl font-bold text-white", children: "Top Sellers" }) }), _jsx("div", { className: "grid grid-cols-1 md:grid-cols-4 gap-6", children: sellers.map((seller) => (_jsx(Link, { href: `/market/sellers/${seller.slug}`, children: _jsxs("div", { className: "flex items-center gap-4 p-4 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 transition-all group cursor-pointer", children: [_jsx("div", { className: "w-14 h-14 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-xl font-bold text-white shadow-lg", children: seller.logo }), _jsxs("div", { children: [_jsxs("div", { className: "flex items-center gap-1 font-bold text-white group-hover:text-primary transition-colors", children: [seller.name, seller.verified && (_jsx(Icon, { name: "ShieldCheck", size: 16, className: "text-blue-400" }))] }), _jsx("div", { className: "text-sm text-text-secondary", children: seller.cat })] }), _jsx(Icon, { name: "ChevronRight", className: "ml-auto text-white/20 group-hover:text-white" })] }) }, seller.name))) })] }), _jsx("section", { className: "bg-gradient-to-r from-[#0f1a14] to-[#142210] rounded-2xl border border-white/5 p-8 flex flex-col md:flex-row justify-around gap-8 md:gap-0", children: [
                            {
                                icon: "Lock",
                                title: "Secure Payments",
                                desc: "Your money is safe until delivery.",
                            },
                            {
                                icon: "ShieldCheck",
                                title: "Verified Sellers",
                                desc: "We verify businesses for your safety.",
                            },
                            {
                                icon: "Headphones",
                                title: "Vayva Support",
                                desc: "24/7 support via WhatsApp.",
                            },
                        ].map((item, i) => (_jsxs("div", { className: "flex items-center gap-4", children: [_jsx("div", { className: "w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary", children: _jsx(Icon, { name: item.icon, size: 24 }) }), _jsxs("div", { children: [_jsx("h3", { className: "font-bold text-white", children: item.title }), _jsx("p", { className: "text-sm text-text-secondary", children: item.desc })] })] }, i))) })] })] }));
}
