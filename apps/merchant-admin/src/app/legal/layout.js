import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { GlobalFooter } from "@/components/layout/GlobalFooter";
export default function LegalLayout({ children, }) {
    return (_jsxs("div", { className: "min-h-screen bg-gray-50 flex flex-col", children: [_jsx("div", { className: "bg-white border-b border-gray-200", children: _jsx("div", { className: "max-w-7xl mx-auto px-6 h-16 flex items-center", children: _jsx("a", { href: "/", className: "text-xl font-bold text-gray-900", children: "Vayva" }) }) }), _jsx("main", { className: "flex-1 max-w-4xl mx-auto w-full px-6 py-12", children: _jsx("div", { className: "bg-white rounded-2xl border border-gray-200 shadow-sm p-8 md:p-12", children: children }) }), _jsx(GlobalFooter, {})] }));
}
