import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import Link from "next/link";
import { Icon, Button } from "@vayva/ui";
export function ProductCard({ product, storeSlug }) {
    return (_jsx("div", { className: "group relative", children: _jsxs(Link, { href: `/store/${storeSlug}/products/${product.id}`, className: "block", children: [_jsxs("div", { className: "aspect-[4/5] w-full overflow-hidden rounded-xl bg-white/5 relative", children: [_jsx("div", { className: "absolute inset-0 flex items-center justify-center text-white/10 group-hover:scale-105 transition-transform duration-500", children: product.image ? (
                            // In real app, use Next Image
                            _jsx("div", { className: "w-full h-full bg-cover bg-center", style: { backgroundImage: `url(${product.image})` } })) : (_jsx(Icon, { name: "Image", size: 48 })) }), _jsx("div", { className: "absolute inset-x-4 bottom-4 opacity-0 group-hover:opacity-100 transition-opacity hidden md:block", children: _jsx(Button, { className: "w-full bg-primary text-black font-bold shadow-lg hover:bg-primary/90 border-none", onClick: (e) => {
                                    e.preventDefault();
                                    alert("Added to cart!");
                                }, children: "Quick Add" }) }), !product.inStock && (_jsx("div", { className: "absolute top-2 left-2 px-2 py-1 bg-black/60 backdrop-blur rounded text-[10px] font-bold text-white uppercase tracking-wider", children: "Out of Stock" }))] }), _jsxs("div", { className: "mt-3", children: [_jsx("h3", { className: "text-sm font-medium text-white group-hover:text-primary transition-colors line-clamp-1", children: product.name }), _jsx("p", { className: "text-sm font-bold text-white/80", children: product.price })] })] }) }));
}
