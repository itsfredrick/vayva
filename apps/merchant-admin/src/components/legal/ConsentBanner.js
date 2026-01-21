"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@vayva/ui";
import { X } from "lucide-react";
export function ConsentBanner() {
    const [isVisible, setIsVisible] = useState(false);
    useEffect(() => {
        const consent = localStorage.getItem("vayva_consent");
        if (!consent) {
            setIsVisible(true);
        }
    }, []);
    const handleAccept = () => {
        localStorage.setItem("vayva_consent", "true");
        setIsVisible(false);
    };
    if (!isVisible)
        return null;
    return (_jsx("div", { className: "fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 shadow-xl p-4 md:p-6 transition-transform duration-300", children: _jsxs("div", { className: "max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-4", children: [_jsxs("div", { className: "flex-1 pr-8", children: [_jsx("h3", { className: "font-semibold text-gray-900 mb-1", children: "We value your privacy" }), _jsxs("p", { className: "text-sm text-gray-600 leading-relaxed", children: ["We use cookies to enhance your experience, analyze site usage, and ensure secure operation. By continuing to browser, you agree to our ", _jsx(Link, { href: "/legal/cookies", className: "text-blue-600 hover:underline", children: "Cookie Policy" }), "."] })] }), _jsxs("div", { className: "flex items-center gap-3 whitespace-nowrap", children: [_jsx(Button, { variant: "outline", size: "sm", onClick: () => setIsVisible(false), children: "Config" }), _jsx(Button, { size: "sm", onClick: handleAccept, className: "bg-gray-900 text-white hover:bg-gray-800", children: "Accept All" })] }), _jsx(Button, { variant: "ghost", size: "icon", onClick: () => setIsVisible(false), className: "absolute top-4 right-4 text-gray-400 hover:text-gray-600 md:hidden h-auto w-auto p-1", "aria-label": "Close consent banner", children: _jsx(X, { className: "h-4 w-4" }) })] }) }));
}
