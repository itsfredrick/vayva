import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
export default function Loading() {
    return (_jsx("div", { className: "fixed inset-0 bg-white z-[9999] flex items-center justify-center", children: _jsxs("div", { className: "flex flex-col items-center gap-4", children: [_jsxs("div", { className: "relative w-16 h-16", children: [_jsx("div", { className: "absolute inset-0 border-4 border-gray-100 rounded-full" }), _jsx("div", { className: "absolute inset-0 border-4 border-[#22C55E] border-t-transparent rounded-full animate-spin" })] }), _jsx("p", { className: "text-sm font-medium text-gray-500 animate-pulse", children: "Loading Vayva..." })] }) }));
}
