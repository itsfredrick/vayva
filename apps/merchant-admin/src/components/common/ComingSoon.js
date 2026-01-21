"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Button } from "@vayva/ui";
import { Construction } from "lucide-react";
export default function ComingSoonPage() {
    return (_jsxs("div", { className: "flex h-[60vh] flex-col items-center justify-center p-8 text-center text-gray-500", children: [_jsx("div", { className: "bg-gray-100 p-4 rounded-full mb-4", children: _jsx(Construction, { className: "h-8 w-8 text-gray-400" }) }), _jsx("h2", { className: "text-xl font-bold text-gray-900", children: "Coming Soon" }), _jsx("p", { className: "max-w-md mt-2 mb-6", children: "This feature is currently under development. Check back later!" }), _jsx(Button, { variant: "outline", onClick: () => window.history.back(), children: "Go Back" })] }));
}
