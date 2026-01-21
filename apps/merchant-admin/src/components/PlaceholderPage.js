"use client";
import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { AppShell, GlassPanel, Button, Icon } from "@vayva/ui"; // Assuming these are exported
import { useRouter } from "next/navigation";
export default function PlaceholderPage({ title = "Coming Soon", }) {
    const router = useRouter();
    return (_jsx(AppShell, { sidebar: _jsx(_Fragment, {}), header: _jsx(_Fragment, {}), children: _jsx("div", { className: "flex items-center justify-center h-[50vh]", children: _jsxs(GlassPanel, { className: "p-12 text-center max-w-md mx-auto", children: [_jsx("div", { className: "bg-white/10 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6", children: _jsx(Icon, { name: "Construction", className: "w-10 h-10 text-primary" }) }), _jsx("h2", { className: "text-2xl font-bold text-white mb-2", children: title }), _jsx("p", { className: "text-gray-400 mb-8", children: "This feature is currently under development. Check back later!" }), _jsx(Button, { onClick: () => router.back(), variant: "secondary", children: "Go Back" })] }) }) }));
}
