"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Button } from "@vayva/ui";
import { cn } from "@/lib/utils";
export const PremiumButton = ({ className, children, ...props }) => {
    return (_jsxs(Button, { className: cn("relative overflow-hidden group transition-all duration-300", "bg-[#22C55E] hover:bg-[#16A34A] text-white", "px-10 py-5 text-lg font-bold rounded-xl", "shadow-xl shadow-green-100", "hover:scale-[1.02] active:scale-[0.98]", "cubic-bezier(0.2, 0.8, 0.2, 1)", className), ...props, children: [_jsx("span", { className: "absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-shimmer pointer-events-none" }), _jsx("span", { className: "absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 shadow-[0_0_20px_rgba(34,197,94,0.4)] pointer-events-none" }), _jsx("span", { className: "absolute inset-0 border border-white/20 rounded-xl pointer-events-none" }), _jsx("span", { className: "relative z-10 flex items-center justify-center gap-2", children: children })] }));
};
