"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from "react";
import { Button } from "@vayva/ui";
export function InfoTooltip({ content, children }) {
    const [isVisible, setIsVisible] = useState(false);
    // Ensure content is max 2 lines (approximately 100 characters)
    const truncatedContent = content.length > 100 ? content.substring(0, 97) + "..." : content;
    return (_jsxs("div", { className: "relative inline-block", children: [_jsx(Button, { onMouseEnter: () => setIsVisible(true), onMouseLeave: () => setIsVisible(false), onClick: () => setIsVisible(!isVisible), className: "text-[#64748B] hover:text-black transition-colors", "aria-label": "More information", children: children || (_jsx("svg", { className: "w-4 h-4", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" }) })) }), isVisible && (_jsxs("div", { className: "absolute z-10 bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-black text-white text-xs rounded shadow-lg max-w-xs", children: [_jsx("p", { children: truncatedContent }), _jsx("div", { className: "absolute top-full left-1/2 transform -translate-x-1/2 -mt-1", children: _jsx("div", { className: "border-4 border-transparent border-t-[#0F172A]" }) })] }))] }));
}
