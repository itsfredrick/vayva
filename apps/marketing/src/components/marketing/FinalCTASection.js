"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import Link from "next/link";
import * as motion from "framer-motion/client";
import { PremiumButton } from "@/components/marketing/PremiumButton";
import { APP_URL } from "@/lib/constants";
export function FinalCTASection() {
    return (_jsx("section", { className: "py-32 px-4 bg-white relative overflow-hidden", children: _jsxs(motion.div, { initial: { opacity: 0, scale: 0.9 }, whileInView: { opacity: 1, scale: 1 }, viewport: { once: true }, className: "max-w-4xl mx-auto text-center relative", children: [_jsx("h2", { className: "text-5xl md:text-6xl font-bold text-[#0F172A] mb-8 leading-tight", children: "Stop running your business in chat bubbles." }), _jsx("div", { className: "flex flex-col sm:flex-row gap-4 justify-center", children: _jsx(Link, { href: `${APP_URL}/signup`, children: _jsx(PremiumButton, { className: "px-12 py-6 text-xl rounded-2xl", children: "Create your account" }) }) })] }) }));
}
