"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { cn, Button } from "@vayva/ui";
import { motion } from "framer-motion";
// 1. Settings Section Container
export const SettingsSection = ({ title, description, children, className, }) => (_jsxs("section", { className: cn("flex flex-col gap-6 mb-10 last:mb-0", className), children: [_jsxs("div", { className: "flex flex-col gap-1", children: [_jsx("h3", { className: "text-lg font-bold text-black", children: title }), description && _jsx("p", { className: "text-sm text-[#525252]", children: description })] }), children] }));
// 2. Settings Card (White surface)
export const SettingsCard = ({ children, className, onClick, }) => (_jsx(motion.div, { className: cn("bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden p-6", className), whileHover: onClick
        ? { y: -2, boxShadow: "0 10px 30px -10px rgba(0,0,0,0.05)" }
        : undefined, onClick: onClick, children: children }));
// 3. Status Badge
export const StatusBadge = ({ status, className, }) => {
    let colors = "bg-gray-50 text-gray-600 border-gray-200";
    // Status Logic
    const s = status?.toLowerCase() || "draft";
    if (["published", "live", "verified", "connected", "paid", "active"].includes(s)) {
        colors = "bg-green-50 text-green-700 border-green-200";
    }
    else if (["pending", "in_review", "review", "trialing"].includes(s)) {
        colors = "bg-yellow-50 text-yellow-700 border-yellow-200";
    }
    else if (["failed", "rejected", "overdue", "disconnected"].includes(s)) {
        colors = "bg-red-50 text-red-700 border-red-200";
    }
    return (_jsx("span", { className: cn("px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border", colors, className), children: status?.replace("_", " ") }));
};
// 4. Action Button Row
export const ActionRow = ({ label, actionLabel, onAction, description, destructive, }) => (_jsxs("div", { className: "flex items-center justify-between py-4 border-b border-gray-50 last:border-0", children: [_jsxs("div", { children: [_jsx("p", { className: "text-sm font-medium text-black", children: label }), description && (_jsx("p", { className: "text-xs text-[#525252] mt-0.5", children: description }))] }), _jsx(Button, { variant: "link", onClick: onAction, className: cn("text-sm font-semibold hover:underline h-auto p-0", destructive ? "text-red-600" : "text-black"), children: actionLabel })] }));
