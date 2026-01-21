"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { StoreShell } from "@/components/storefront/store-shell";
import { ProductCard } from "@/components/storefront/product-card";
import { Button, Icon } from "@vayva/ui";
const CATEGORIES = [
    { name: "Men", image: "man" },
    { name: "Women", image: "woman" },
    { name: "Accessories", image: "watch" },
    { name: "Footwear", image: "hiking" },
];
export default function StoreHomepage({ params, }) {
    const { slug } = React.use(params);
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        // Fetch real products from API
        fetch("/api/products/items?status=ACTIVE&limit=4")
            .then((res) => res.json())
            .then((data) => {
            // Transform API data to Product format
            const transformedProducts = data.map((item) => ({
                id: item.id,
                name: item.name,
                price: `₦ ${item.price.toLocaleString()}`,
                image: item.images?.[0] || "https://via.placeholder.com/300?text=Product",
                slug: item.id,
                inStock: (item.inventory?.[0]?.available || 0) > 0,
            }));
            setProducts(transformedProducts);
            setLoading(false);
        })
            .catch((err) => {
            console.error("Failed to fetch products:", err);
            setLoading(false);
        });
    }, []);
    return (_jsxs(StoreShell, { slug: slug, children: [_jsxs("section", { className: "relative h-[500px] flex items-center overflow-hidden", children: [_jsxs("div", { className: "absolute inset-0 bg-[#142210]", children: [_jsx("div", { className: "absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-primary/5 to-transparent" }), _jsx("div", { className: "absolute -bottom-24 -left-24 w-96 h-96 bg-primary/10 rounded-full blur-[100px]" })] }), _jsxs("div", { className: "max-w-7xl mx-auto px-4 relative z-10 w-full grid grid-cols-1 md:grid-cols-2 gap-12 items-center", children: [_jsxs("div", { className: "space-y-6 text-center md:text-left", children: [_jsx("span", { className: "inline-block px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-bold uppercase tracking-wider text-primary", children: "New Collection 2026" }), _jsxs("h1", { className: "text-5xl md:text-7xl font-bold text-white tracking-tight leading-tight", children: ["Elevate Your ", _jsx("br", {}), _jsx("span", { className: "text-transparent bg-clip-text bg-gradient-to-r from-white to-white/50", children: "Everyday Style." })] }), _jsx("p", { className: "text-lg text-text-secondary max-w-lg mx-auto md:mx-0", children: "Discover premium essentials crafted for the modern individual. Designed in Lagos, worn worldwide." }), _jsxs("div", { className: "flex gap-4 justify-center md:justify-start", children: [_jsx(Link, { href: `/store/${slug}/collections/all`, children: _jsx(Button, { size: "lg", className: "bg-primary text-black hover:bg-primary/90 rounded-full font-bold px-8", children: "Shop Now" }) }), _jsx(Link, { href: `/store/${slug}/collections/new`, children: _jsx(Button, { size: "lg", variant: "outline", className: "rounded-full px-8 text-white hover:bg-white/5 border-white/20", children: "View Lookbook" }) })] })] }), _jsxs("div", { className: "hidden md:block relative h-[400px]", children: [_jsx("div", { className: "absolute right-0 top-0 w-64 h-80 bg-white/5 rounded-2xl rotate-3 border border-white/10 backdrop-blur-sm z-10" }), _jsx("div", { className: "absolute right-12 top-12 w-64 h-80 bg-white/10 rounded-2xl -rotate-2 border border-white/10 backdrop-blur-md z-20 flex items-center justify-center", children: _jsx(Icon, { name: "ShoppingBag", size: 64, className: "text-white/20" }) })] })] })] }), _jsx("section", { className: "py-12 border-b border-white/5", children: _jsx("div", { className: "max-w-7xl mx-auto px-4 overflow-x-auto scrollbar-hide", children: _jsx("div", { className: "flex gap-4 min-w-max", children: CATEGORIES.map((cat) => (_jsx(Link, { href: `/store/${slug}/collections/${cat.name.toLowerCase()}`, children: _jsxs("div", { className: "group flex items-center gap-3 px-6 py-3 rounded-full bg-white/5 border border-white/5 hover:bg-white/10 transition-colors cursor-pointer", children: [_jsx(Icon, { name: cat.image, className: "text-text-secondary group-hover:text-primary transition-colors" }), _jsx("span", { className: "font-bold text-white text-sm", children: cat.name })] }) }, cat.name))) }) }) }), _jsx("section", { className: "py-20", children: _jsxs("div", { className: "max-w-7xl mx-auto px-4", children: [_jsxs("div", { className: "flex justify-between items-end mb-10", children: [_jsxs("div", { children: [_jsx("h2", { className: "text-3xl font-bold text-white mb-2", children: "Featured Drops" }), _jsx("p", { className: "text-text-secondary", children: "Handpicked just for you." })] }), _jsxs(Link, { href: `/store/${slug}/collections/all`, className: "text-primary hover:text-primary/80 text-sm font-bold flex items-center gap-1", children: ["View All ", _jsx(Icon, { name: "ArrowRight", size: 16 })] })] }), _jsx("div", { className: "grid grid-cols-2 lg:grid-cols-4 gap-6", children: loading ? (
                            // Loading skeleton
                            [1, 2, 3, 4].map((i) => (_jsxs("div", { className: "animate-pulse", children: [_jsx("div", { className: "bg-white/5 h-64 rounded-2xl mb-4" }), _jsx("div", { className: "bg-white/5 h-4 rounded w-3/4 mb-2" }), _jsx("div", { className: "bg-white/5 h-4 rounded w-1/2" })] }, i)))) : products.length > 0 ? (products.map((product) => (_jsx(ProductCard, { product: product, storeSlug: slug }, product.id)))) : (_jsx("div", { className: "col-span-full text-center py-12", children: _jsx("p", { className: "text-text-secondary", children: "No products available yet." }) })) })] }) }), _jsx("section", { className: "py-16 bg-[#0b141a]", children: _jsx("div", { className: "max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8", children: [
                        {
                            icon: "Truck",
                            title: "Fast Delivery",
                            desc: "Lagos delivery within 24 hours.",
                        },
                        {
                            icon: "ShieldCheck",
                            title: "Secure Payment",
                            desc: "100% secure checkout via Paystack.",
                        },
                        {
                            icon: "MessageCircle",
                            title: "WhatsApp Support",
                            desc: "Chat with us anytime for help.",
                        },
                    ].map((item, i) => (_jsxs("div", { className: "flex flex-col items-center text-center p-6 rounded-2xl bg-white/5 border border-white/5", children: [_jsx("div", { className: "w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-4", children: _jsx(Icon, { name: item.icon, size: 24 }) }), _jsx("h3", { className: "font-bold text-white text-lg mb-2", children: item.title }), _jsx("p", { className: "text-sm text-text-secondary", children: item.desc })] }, i))) }) })] }));
}
