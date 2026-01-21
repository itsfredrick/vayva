import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import Link from "next/link";
import { GlassPanel, Icon } from "@vayva/ui";
import { ArrowRight } from "lucide-react";
export function ControlCenterCard({ title, description, icon, href, status, disabled, }) {
    const Content = (_jsx(GlassPanel, { className: `group relative h-full p-6 transition-all duration-300 hover:border-white/20 hover:bg-white/5 ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`, children: _jsxs("div", { className: "flex h-full flex-col justify-between", children: [_jsxs("div", { children: [_jsxs("div", { className: "mb-4 flex items-center justify-between", children: [_jsx("div", { className: "flex h-10 w-10 items-center justify-center rounded-full bg-white/5 text-white/70 group-hover:bg-white/10 group-hover:text-white", children: _jsx(Icon, { name: icon, size: 20 }) }), status && (_jsx("span", { className: "rounded-full bg-white/5 px-2 py-1 text-xs font-medium text-white/50", children: status }))] }), _jsxs("h3", { className: "mb-1 flex items-center gap-2 text-lg font-medium text-white", children: [_jsx(Icon, { name: icon, className: "w-6 h-6 text-primary group-hover:scale-110 transition-transform" }), title] }), _jsx("p", { className: "text-sm text-text-secondary", children: description })] }), _jsxs("div", { className: "mt-6 flex items-center text-sm font-medium text-white/0 transition-all duration-300 group-hover:text-primary group-hover:text-white", children: [_jsx("span", { className: "mr-2", children: "Manage" }), _jsx(ArrowRight, { size: 16 })] })] }) }));
    if (disabled) {
        return Content;
    }
    return (_jsx(Link, { href: href, className: "block h-full no-underline", children: Content }));
}
