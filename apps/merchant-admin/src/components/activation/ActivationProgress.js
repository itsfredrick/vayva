"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from "react";
import { Button } from "@vayva/ui";
export function ActivationProgress({ firstOrder, firstPayment, firstCompletion, onDismiss, }) {
    const [dismissed, setDismissed] = useState(false);
    // Don't show if all steps complete or dismissed
    if (dismissed || (firstOrder && firstPayment && firstCompletion)) {
        return null;
    }
    const handleDismiss = () => {
        setDismissed(true);
        onDismiss?.();
    };
    return (_jsxs("div", { className: "bg-white border border-gray-200 rounded-lg p-4 shadow-sm", children: [_jsxs("div", { className: "flex justify-between items-start mb-3", children: [_jsx("h3", { className: "text-sm font-semibold text-black", children: "Setup progress" }), _jsx(Button, { onClick: handleDismiss, className: "text-[#64748B] hover:text-black text-sm", "aria-label": "Dismiss", children: "\u00D7" })] }), _jsxs("div", { className: "space-y-2", children: [_jsxs("div", { className: "flex items-center gap-2", children: [_jsx("div", { className: `w-4 h-4 rounded-full flex items-center justify-center ${firstOrder ? "bg-[#22C55E]" : "bg-gray-200"}`, children: firstOrder && _jsx("span", { className: "text-white text-xs", children: "\u2713" }) }), _jsx("span", { className: `text-sm ${firstOrder ? "text-black" : "text-[#64748B]"}`, children: "Receive first order" })] }), _jsxs("div", { className: "flex items-center gap-2", children: [_jsx("div", { className: `w-4 h-4 rounded-full flex items-center justify-center ${firstPayment ? "bg-[#22C55E]" : "bg-gray-200"}`, children: firstPayment && _jsx("span", { className: "text-white text-xs", children: "\u2713" }) }), _jsx("span", { className: `text-sm ${firstPayment ? "text-black" : "text-[#64748B]"}`, children: "Record a payment" })] }), _jsxs("div", { className: "flex items-center gap-2", children: [_jsx("div", { className: `w-4 h-4 rounded-full flex items-center justify-center ${firstCompletion ? "bg-[#22C55E]" : "bg-gray-200"}`, children: firstCompletion && _jsx("span", { className: "text-white text-xs", children: "\u2713" }) }), _jsx("span", { className: `text-sm ${firstCompletion ? "text-black" : "text-[#64748B]"}`, children: "Complete an order" })] })] })] }));
}
