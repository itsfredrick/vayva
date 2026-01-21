"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import * as motion from "framer-motion/client";
import { MessageSquareText, CreditCard, Package, Truck, BarChart3, Users, } from "lucide-react";
export function FeaturesSection() {
    return (_jsx("section", { id: "features", className: "py-24 px-4 bg-white", children: _jsxs("div", { className: "max-w-6xl mx-auto", children: [_jsxs(motion.div, { initial: { opacity: 0, y: 30 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true }, className: "text-center mb-20", children: [_jsx("div", { className: "inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-600 text-xs font-bold uppercase mb-6", children: "Capabilities" }), _jsx("h2", { className: "text-5xl font-bold text-[#0F172A] mb-6", children: "Put your business on Autopilot." })] }), _jsx("div", { className: "grid md:grid-cols-2 lg:grid-cols-3 gap-8", children: [
                        { title: "Orders from chat", Icon: MessageSquareText, color: "text-blue-500", bg: "bg-blue-50" },
                        { title: "Payments & reconciliation", Icon: CreditCard, color: "text-green-500", bg: "bg-green-50" },
                        { title: "Inventory tracking", Icon: Package, color: "text-orange-500", bg: "bg-orange-50" },
                        { title: "Delivery coordination", Icon: Truck, color: "text-purple-500", bg: "bg-purple-50" },
                        { title: "Business records", Icon: BarChart3, color: "text-indigo-500", bg: "bg-indigo-50" },
                        { title: "Multi-staff access", Icon: Users, color: "text-pink-500", bg: "bg-pink-50" },
                    ].map((feature, i) => (_jsxs(motion.div, { initial: { opacity: 0, y: 20 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true }, transition: { delay: i * 0.1 }, className: "group bg-white border border-gray-100 rounded-2xl p-8 hover:shadow-2xl hover:shadow-green-100/50 hover:border-[#22C55E]/30 transition-all text-center md:text-left", children: [_jsx("div", { className: `w-14 h-14 rounded-xl ${feature.bg} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform mx-auto md:mx-0`, children: _jsx(feature.Icon, { className: `w-7 h-7 ${feature.color}` }) }), _jsx("h3", { className: "text-xl font-bold text-[#0F172A] mb-3", children: feature.title }), _jsx("p", { className: "text-[#64748B] text-sm leading-relaxed", children: "Integrated features designed for speed." })] }, i))) })] }) }));
}
