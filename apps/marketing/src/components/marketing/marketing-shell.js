import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { ScrollToTop } from "./ScrollToTop";
export function MarketingShell({ children, className = "", }) {
    return (_jsxs("div", { className: `min-h-screen bg-[#F5F5F7] text-[#1d1d1f] font-sans ${className}`, children: [_jsxs("div", { className: "fixed inset-0 pointer-events-none", children: [_jsx("div", { className: "absolute top-0 right-0 w-[500px] h-[500px] bg-[#46EC13]/5 rounded-full blur-[120px]" }), _jsx("div", { className: "absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-500/5 rounded-full blur-[120px]" }), _jsx("div", { className: "absolute inset-0 bg-gradient-to-b from-white/50 to-transparent" })] }), _jsx("div", { className: "relative z-10 w-full", children: children }), _jsx(ScrollToTop, {})] }));
}
