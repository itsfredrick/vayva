"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { MarketShell } from "@/components/market/market-shell"; // Ensure this exists or imports correct shell
import { Icon, Button } from "@vayva/ui"; // Assume UI lib
export default function MarketProductPage() {
    const params = useParams();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    useEffect(() => {
        async function load() {
            try {
                const res = await fetch(`/api/market/products/${params.id}`);
                if (!res.ok)
                    throw new Error("Product not found");
                const data = await res.json();
                setProduct(data);
            }
            catch (err) {
                setError("Failed to load product");
            }
            finally {
                setLoading(false);
            }
        }
        if (params.id)
            load();
    }, [params.id]);
    if (loading)
        return _jsx(MarketShell, { children: _jsx("div", { className: "p-12 text-center text-white", children: "Loading..." }) });
    if (error || !product)
        return _jsx(MarketShell, { children: _jsx("div", { className: "p-12 text-center text-red-400", children: error }) });
    return (_jsx(MarketShell, { children: _jsxs("div", { className: "max-w-6xl mx-auto px-4 py-8", children: [_jsxs("div", { className: "flex items-center gap-2 text-sm text-gray-400 mb-6", children: [_jsx(Link, { href: "/market", className: "hover:text-white", children: "Market" }), _jsx("span", { children: "/" }), _jsx("span", { className: "text-white", children: product.name })] }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-12", children: [_jsx("div", { className: "space-y-4", children: _jsxs("div", { className: "aspect-square bg-gray-800 rounded-2xl overflow-hidden border border-white/10 relative", children: [_jsx("div", { className: "absolute top-4 left-4 z-10", children: _jsx("span", { className: `px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${product.condition === 'NEW' ? 'bg-green-500/20 text-green-400 border border-green-500/30' :
                                                'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30'}`, children: product.condition }) }), product.images?.[0] ? (_jsx("img", { src: product.images[0], alt: product.name, className: "w-full h-full object-cover" })) : (_jsx("div", { className: "w-full h-full flex items-center justify-center text-gray-600", children: "No Image" }))] }) }), _jsxs("div", { children: [_jsx("h1", { className: "text-3xl font-bold text-white mb-2", children: product.name }), _jsxs("div", { className: "flex items-center gap-4 mb-6", children: [_jsxs("div", { className: "text-2xl font-bold text-emerald-400", children: [product.curr, " ", product.price.toLocaleString()] }), product.warranty && (_jsxs("div", { className: "flex items-center gap-1 text-xs text-blue-300 bg-blue-500/10 px-2 py-1 rounded", children: [_jsx(Icon, { name: "ShieldCheck", size: 14 }), product.warranty] }))] }), _jsxs("div", { className: "bg-white/5 border border-white/10 rounded-xl p-4 mb-8 flex items-center justify-between", children: [_jsxs("div", { className: "flex items-center gap-3", children: [_jsx("div", { className: "w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold", children: product.seller.logo ? _jsx("img", { src: product.seller.logo, className: "w-full h-full rounded-full" }) : product.seller.name[0] }), _jsxs("div", { children: [_jsxs("div", { className: "text-sm font-bold text-white flex items-center gap-1", children: [product.seller.name, product.seller.verified && _jsx(Icon, { name: "BadgeCheck", size: 14, className: "text-blue-400" })] }), _jsx("div", { className: "text-xs text-gray-400", children: product.seller.location })] })] }), _jsx(Button, { variant: "outline", size: "sm", children: "View Store" })] }), _jsxs("div", { className: "flex gap-4 mb-12", children: [_jsx(Button, { size: "lg", className: "w-full bg-primary text-black hover:bg-primary/90 font-bold", children: "Add to Cart" }), _jsx(Button, { size: "lg", variant: "outline", className: "w-full", children: "Make Offer" })] }), product.specs && Object.keys(product.specs).length > 0 && (_jsxs("div", { className: "border-t border-white/10 pt-8", children: [_jsx("h3", { className: "text-lg font-bold text-white mb-4", children: "Technical Specifications" }), _jsx("div", { className: "grid grid-cols-1 gap-y-2", children: Object.entries(product.specs).map(([key, val]) => (_jsxs("div", { className: "grid grid-cols-2 py-2 border-b border-white/5", children: [_jsx("div", { className: "text-sm text-gray-400 capitalize", children: key.replace(/([A-Z])/g, ' $1').trim() }), _jsx("div", { className: "text-sm text-white font-medium", children: val })] }, key))) })] })), _jsxs("div", { className: "mt-8", children: [_jsx("h3", { className: "text-lg font-bold text-white mb-2", children: "Description" }), _jsx("p", { className: "text-gray-400 leading-relaxed text-sm", children: product.desc })] })] })] })] }) }));
}
