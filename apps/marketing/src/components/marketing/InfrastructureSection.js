"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import * as motion from "framer-motion/client";
import { Smartphone, Users, Wifi, ShieldCheck } from "lucide-react";
export function InfrastructureSection() {
    return (_jsx("section", { className: "py-24 px-4 bg-white", children: _jsxs(motion.div, { initial: { opacity: 0, y: 30 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true }, className: "max-w-4xl mx-auto", children: [_jsxs("div", { className: "text-center mb-16", children: [_jsx("div", { className: "inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-50 text-orange-600 text-xs font-bold uppercase mb-6", children: "Engineered for Nigeria" }), _jsx("h2", { className: "text-4xl font-bold text-[#0F172A] mb-4", children: "Infrastructure for the local reality." })] }), _jsx("div", { className: "grid md:grid-cols-2 gap-8", children: [
                        { title: "Local payment realities", Icon: Smartphone, color: "text-green-600", bg: "bg-green-100" },
                        { title: "Informal selling norms", Icon: Users, color: "text-orange-600", bg: "bg-orange-100" },
                        { title: "Network constraints", Icon: Wifi, color: "text-blue-600", bg: "bg-blue-100" },
                        { title: "Regulatory awareness", Icon: ShieldCheck, color: "text-purple-600", bg: "bg-purple-100" },
                    ].map((item) => (_jsxs("div", { className: "bg-gray-50 rounded-2xl p-8 border border-gray-100 hover:bg-white hover:shadow-xl transition-all group", children: [_jsx("div", { className: `w-12 h-12 rounded-xl ${item.bg} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`, children: _jsx(item.Icon, { className: `w-6 h-6 ${item.color}` }) }), _jsx("h3", { className: "font-bold text-[#0F172A] mb-3 text-lg", children: item.title }), _jsx("p", { className: "text-[#64748B] text-sm leading-relaxed", children: "Built for Nigeria." })] }, item.title))) })] }) }));
}
