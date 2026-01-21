"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import Image from "next/image";
import * as motion from "framer-motion/client";
export function ProblemSection() {
    return (_jsx("section", { className: "py-24 px-4 bg-gray-50/50", children: _jsxs(motion.div, { initial: { opacity: 0, x: -50 }, whileInView: { opacity: 1, x: 0 }, viewport: { once: true }, className: "max-w-6xl mx-auto grid md:grid-cols-2 gap-16 items-center", children: [_jsx("div", { className: "relative rounded-[32px] overflow-hidden shadow-2xl border border-gray-200 rotate-2 hover:rotate-0 transition-all duration-500 group-hover:scale-[1.02]", children: _jsx(Image, { src: "/images/chaos-problem.jpg", alt: "Chaos without Vayva", width: 800, height: 600, className: "w-full h-auto object-cover" }) }), _jsxs("div", { children: [_jsxs("h2", { className: "text-4xl font-bold text-[#0F172A] mb-8 leading-tight", children: ["WhatsApp is chaotic.", _jsx("br", {}), _jsx("span", { className: "text-red-500", children: "Business shouldn't be." })] }), _jsx("div", { className: "space-y-6", children: [
                                "Orders get lost in chat threads",
                                "Prices change mid-conversation",
                                "No records of what was sold",
                                "No accountability or audit trail",
                            ].map((item) => (_jsxs("div", { className: "flex items-center gap-4 text-[#64748B] text-lg font-medium", children: [_jsx("div", { className: "w-6 h-6 rounded-full bg-red-50 flex items-center justify-center text-red-500", children: "\u00D7" }), item] }, item))) })] })] }) }));
}
