"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Button } from "@vayva/ui";
import { useRouter } from "next/navigation";
import { Home, ArrowLeft } from "lucide-react";
export default function NotFound() {
    const router = useRouter();
    return (_jsx("div", { className: "min-h-screen bg-gray-50 flex items-center justify-center p-4", children: _jsxs("div", { className: "text-center max-w-md", children: [_jsxs("div", { className: "mb-8", children: [_jsx("h1", { className: "text-9xl font-bold text-gray-200", children: "404" }), _jsx("h2", { className: "text-2xl font-bold text-gray-900 mt-4", children: "Page Not Found" }), _jsx("p", { className: "text-gray-500 mt-2", children: "The page you're looking for doesn't exist or has been moved." })] }), _jsxs("div", { className: "flex flex-col sm:flex-row gap-3 justify-center", children: [_jsxs(Button, { onClick: () => router.back(), variant: "outline", className: "flex items-center gap-2", children: [_jsx(ArrowLeft, { className: "w-4 h-4" }), "Go Back"] }), _jsxs(Button, { onClick: () => router.push("/dashboard"), className: "flex items-center gap-2", children: [_jsx(Home, { className: "w-4 h-4" }), "Dashboard"] })] })] }) }));
}
