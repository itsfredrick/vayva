"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { cn, Button } from "@vayva/ui";
export function EmptyState({ icon, title, description, action, className, }) {
    return (_jsxs("div", { className: cn("flex flex-col items-center justify-center text-center py-16 px-4", className), children: [icon && (_jsx("div", { className: "w-16 h-16 rounded-full bg-gray-50 flex items-center justify-center mb-4", children: icon })), _jsx("h3", { className: "text-lg font-semibold text-[#0B1220] mb-2", children: title }), _jsx("p", { className: "text-sm text-gray-500 max-w-sm mb-6", children: description }), action] }));
}
export function ErrorState({ title = "Something went wrong", message, onRetry, className, }) {
    return (_jsxs("div", { className: cn("flex flex-col items-center justify-center text-center py-16 px-4", className), children: [_jsx("div", { className: "w-16 h-16 rounded-full bg-red-50 flex items-center justify-center mb-4", children: _jsx("svg", { className: "w-8 h-8 text-red-500", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" }) }) }), _jsx("h3", { className: "text-lg font-semibold text-[#0B1220] mb-2", children: title }), _jsx("p", { className: "text-sm text-gray-500 max-w-sm mb-6", children: message }), onRetry && (_jsx(Button, { onClick: onRetry, className: "px-4 py-2 bg-[#22C55E] text-white rounded-lg text-sm font-medium hover:bg-[#16A34A] transition-colors", children: "Try Again" }))] }));
}
export function LoadingState({ message = "Loading...", className, }) {
    return (_jsxs("div", { className: cn("flex flex-col items-center justify-center py-16 px-4", className), children: [_jsx("div", { className: "animate-spin rounded-full h-8 w-8 border-b-2 border-[#22C55E] mb-4" }), _jsx("p", { className: "text-sm text-gray-500", children: message })] }));
}
export function Skeleton({ className }) {
    return _jsx("div", { className: cn("animate-pulse bg-gray-100 rounded", className) });
}
export function CardSkeleton() {
    return (_jsxs("div", { className: "bg-white rounded-2xl border border-gray-100 p-6 space-y-4", children: [_jsx(Skeleton, { className: "h-4 w-1/3" }), _jsx(Skeleton, { className: "h-4 w-2/3" }), _jsx(Skeleton, { className: "h-4 w-1/2" })] }));
}
export function TableRowSkeleton() {
    return (_jsxs("tr", { children: [_jsx("td", { className: "px-6 py-4", children: _jsx(Skeleton, { className: "h-4 w-24" }) }), _jsx("td", { className: "px-6 py-4", children: _jsx(Skeleton, { className: "h-4 w-32" }) }), _jsx("td", { className: "px-6 py-4", children: _jsx(Skeleton, { className: "h-4 w-16" }) }), _jsx("td", { className: "px-6 py-4", children: _jsx(Skeleton, { className: "h-4 w-20" }) })] }));
}
export function RetryBanner({ message, onRetry }) {
    return (_jsxs("div", { className: "bg-yellow-50 border border-yellow-200 rounded-lg p-4 flex items-center justify-between", children: [_jsxs("div", { className: "flex items-center gap-3", children: [_jsx("div", { className: "animate-spin rounded-full h-4 w-4 border-b-2 border-yellow-600" }), _jsx("span", { className: "text-sm text-yellow-800", children: message })] }), onRetry && (_jsx(Button, { onClick: onRetry, className: "text-sm font-medium text-yellow-700 hover:text-yellow-800", children: "Retry Now" }))] }));
}
