"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import Link from "next/link";
import { Button } from "@vayva/ui";
import { ArrowRight } from "lucide-react";
import * as motion from "framer-motion/client";
export default function TemplatesDiscoverySection() {
    return (_jsxs("section", { className: "py-24 px-4 bg-gray-900 border-t border-white/10 relative overflow-hidden", children: [_jsx("div", { className: "absolute top-0 left-0 w-full h-full bg-gradient-to-b from-green-500/5 to-transparent pointer-events-none" }), _jsxs(motion.div, { initial: { opacity: 0 }, whileInView: { opacity: 1 }, viewport: { once: true }, transition: { duration: 1 }, className: "max-w-7xl mx-auto", children: [_jsxs("div", { className: "max-w-3xl mb-16", children: [_jsx("div", { className: "inline-flex items-center gap-2 px-3 py-1 rounded-full bg-green-500/10 text-green-400 text-xs font-bold uppercase mb-6 border border-green-500/20", children: "The Result" }), _jsxs("h2", { className: "text-4xl md:text-5xl font-bold text-white mb-6 leading-tight", children: ["Your products,", _jsx("br", {}), _jsx("span", { className: "text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-blue-500", children: "beautifully organized." })] }), _jsx("p", { className: "text-lg text-gray-400 mb-8 leading-relaxed", children: "Choose from industry-standard templates. Vayva automatically builds a stunning, mobile-optimized store for you." })] }), _jsx("div", { className: "grid md:grid-cols-2 gap-6", children: [
                            {
                                name: "Fashion Boutique",
                                headline: "Bold, visual-first retail layout for clothing brands.",
                                slug: "Retail",
                            },
                            {
                                name: "Restaurant & Grill",
                                headline: "Fast, mobile-first ordering menu for huge appetites.",
                                slug: "Food",
                            },
                            {
                                name: "Digital Downloads",
                                headline: "Secure delivery for ebooks, courses, and software.",
                                slug: "Digital",
                            },
                            {
                                name: "Consultancy",
                                headline: "Professional booking and scheduling for experts.",
                                slug: "Service",
                            },
                        ].map((cat) => (_jsx(Link, { href: `/templates?category=${cat.slug}&utm_source=homepage_discovery`, className: "group", children: _jsxs("div", { className: "bg-white/5 border border-white/10 rounded-2xl p-8 h-full hover:bg-white/10 hover:border-green-500/30 transition-all flex flex-col justify-between", children: [_jsxs("div", { children: [_jsxs("div", { className: "flex justify-between items-start mb-4", children: [_jsx("h3", { className: "text-2xl font-bold text-white tracking-tight", children: cat.name }), _jsx(ArrowRight, { className: "w-6 h-6 text-gray-500 group-hover:text-green-400 transition-colors" })] }), _jsx("p", { className: "text-gray-400 text-lg mb-6 leading-relaxed", children: cat.headline })] }), _jsxs("div", { className: "flex items-center gap-2", children: [_jsx("span", { className: "w-2 h-2 rounded-full bg-green-500" }), _jsx("span", { className: "text-xs font-bold text-green-500 uppercase tracking-widest group-hover:underline decoration-green-500/50 underline-offset-4", children: "Preview Template" })] })] }) }, cat.name))) }), _jsx("div", { className: "mt-12 text-center", children: _jsx(Link, { href: "/templates", children: _jsx(Button, { className: "bg-white text-gray-900 hover:bg-gray-100 px-8 py-4 rounded-xl font-bold transition-all", children: "See all 14 templates" }) }) })] })] }));
}
