"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect } from "react";
import { Button } from "@vayva/ui";
export default function AuthError({ error, reset, }) {
    useEffect(() => {
        // Log the error to the server console
        console.error("Auth Error Boundary caught error:", {
            message: error.message,
            stack: error.stack,
            digest: error.digest,
            timestamp: new Date().toISOString(),
        });
    }, [error]);
    return (_jsx("div", { className: "min-h-screen flex flex-col items-center justify-center p-4 bg-gray-50", children: _jsxs("div", { className: "max-w-md w-full bg-white rounded-lg border border-gray-200 p-8 shadow-sm text-center", children: [_jsx("div", { className: "w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-6 text-2xl", children: "\u26A0\uFE0F" }), _jsx("h2", { className: "text-2xl font-bold text-black mb-4", children: "Something went wrong" }), _jsx("p", { className: "text-[#64748B] mb-8 leading-relaxed", children: "We encountered an error while trying to process your request. This has been logged and we're looking into it." }), _jsxs("div", { className: "flex flex-col gap-3", children: [_jsx(Button, { onClick: () => reset(), className: "bg-[#22C55E] hover:bg-[#16A34A] text-white py-3 font-semibold", children: "Try again" }), _jsx(Button, { variant: "outline", onClick: () => (window.location.href = "/"), className: "border-gray-300 py-3 font-semibold", children: "Go back home" })] }), process.env.NODE_ENV === "development" && (_jsxs("div", { className: "mt-8 p-4 bg-red-50 text-red-700 text-xs text-left rounded overflow-auto max-h-40 font-mono", children: [_jsx("p", { className: "font-bold mb-2", children: "Error Detail (Dev Only):" }), error.message, _jsx("div", { className: "mt-2 text-[10px] opacity-70", children: error.stack })] }))] }) }));
}
