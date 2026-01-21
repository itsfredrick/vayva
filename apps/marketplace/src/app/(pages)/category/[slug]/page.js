import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { prisma } from "@/lib/prisma";
import { MobileCategoryHeader } from "@/components/mobile/MobileCategoryHeader";
import { Star, Clock } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
export default async function CategoryPage({ params }) {
    const slug = params.slug;
    const isFood = slug === "food";
    const title = slug.charAt(0).toUpperCase() + slug.slice(1);
    // Dynamic Data Fetching
    let items = [];
    if (isFood) {
        // Fetch Restaurants
        items = await prisma.store.findMany({
            where: {
                OR: [
                    { category: 'food' },
                    { category: 'restaurant' },
                    { industrySlug: 'food-beverage' }
                ],
                isLive: true
            },
            take: 20
        });
    }
    else {
        // Fetch Products
        items = await prisma.product.findMany({
            where: {
                productType: { contains: slug, mode: 'insensitive' }, // Simple keyword match
                status: 'PUBLISHED'
            },
            include: {
                productImages: true,
                store: true
            },
            take: 20
        });
    }
    return (_jsxs("div", { className: "pb-24", children: [_jsx(MobileCategoryHeader, { title: title }), _jsx("div", { className: "p-4", children: isFood ? (_jsxs("div", { className: "space-y-6", children: [_jsx("div", { className: "flex items-center justify-between mb-2", children: _jsx("h2", { className: "font-bold text-lg", children: "Featured Restaurants" }) }), items.length === 0 ? (_jsx("p", { className: "text-gray-500 text-center py-10", children: "No restaurants found." })) : (items.map((store) => (_jsxs(Link, { href: `/store/${store.slug}`, className: "block group", children: [_jsxs("div", { className: "relative h-40 bg-gray-100 rounded-xl overflow-hidden mb-3", children: [store.bannerUrl ? (_jsx(Image, { src: store.bannerUrl, alt: store.name, fill: true, className: "object-cover group-hover:scale-105 transition-transform duration-300" })) : (_jsx("div", { className: "w-full h-full flex items-center justify-center text-gray-300", children: _jsx("span", { className: "text-4xl font-bold opacity-20", children: store.name[0] }) })), _jsxs("div", { className: "absolute bottom-3 right-3 bg-white px-2 py-1 rounded-lg text-xs font-bold shadow-sm flex items-center gap-1", children: [_jsx(Clock, { size: 12, className: "text-[#22C55E]" }), "30-45 min"] })] }), _jsxs("div", { className: "flex justify-between items-start", children: [_jsxs("div", { children: [_jsx("h3", { className: "font-bold text-gray-900", children: store.name }), _jsx("p", { className: "text-sm text-gray-500 truncate max-w-[250px]", children: store.bio || "African • Fast Food • Drinks" })] }), _jsxs("div", { className: "bg-gray-100 px-2 py-1 rounded-full text-xs font-bold flex items-center gap-1", children: [_jsx(Star, { size: 10, className: "fill-orange-400 text-orange-400" }), "4.5"] })] })] }, store.id))))] })) : (_jsx("div", { className: "grid grid-cols-2 gap-4", children: items.length === 0 ? (_jsxs("div", { className: "col-span-2 text-center py-20 text-gray-500", children: ["No products found in ", title, "."] })) : (items.map((product) => (_jsxs(Link, { href: `/listing/${product.id}`, className: "bg-white border border-gray-100 rounded-xl overflow-hidden block", children: [_jsx("div", { className: "aspect-square bg-gray-50 relative", children: product.productImages?.[0] ? (_jsx(Image, { src: product.productImages[0].url, alt: product.title, fill: true, className: "object-cover" })) : null }), _jsxs("div", { className: "p-3", children: [_jsx("div", { className: "text-xs text-[#22C55E] font-medium mb-1 line-clamp-1", children: product.store?.name }), _jsx("h3", { className: "font-medium text-sm text-gray-900 line-clamp-2 h-10", children: product.title }), _jsxs("div", { className: "mt-2 font-bold", children: ["\u20A6", Number(product.price).toLocaleString()] })] })] }, product.id)))) })) })] }));
}
