"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
export function EmptyStateGuidance({ primary, secondary, icon, }) {
    return (_jsxs("div", { className: "flex flex-col items-center justify-center py-12 px-4", children: [icon && _jsx("div", { className: "mb-4 text-4xl text-gray-400", children: icon }), _jsx("p", { className: "text-center text-[#64748B] mb-2 max-w-md", children: primary }), secondary && (_jsx("p", { className: "text-center text-sm text-[#94A3B8] max-w-md", children: secondary }))] }));
}
