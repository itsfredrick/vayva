import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Loader2 } from "lucide-react";
// Full page loading spinner
export function PageLoader({ message = "Loading..." }) {
    return (_jsx("div", { className: "min-h-screen flex items-center justify-center", children: _jsxs("div", { className: "text-center", children: [_jsx(Loader2, { className: "h-8 w-8 animate-spin text-primary mx-auto mb-4" }), _jsx("p", { className: "text-sm text-gray-600", children: message })] }) }));
}
// Inline loading spinner
export function InlineLoader({ size = "md" }) {
    const sizeClasses = {
        sm: "h-4 w-4",
        md: "h-6 w-6",
        lg: "h-8 w-8"
    };
    return (_jsx("div", { className: "flex items-center justify-center p-4", children: _jsx(Loader2, { className: `${sizeClasses[size]} animate-spin text-primary` }) }));
}
// Card skeleton loader
export function CardSkeleton() {
    return (_jsxs("div", { className: "bg-white rounded-lg border border-gray-200 p-6 animate-pulse", children: [_jsx("div", { className: "h-4 bg-gray-200 rounded w-3/4 mb-4" }), _jsx("div", { className: "h-4 bg-gray-200 rounded w-1/2 mb-2" }), _jsx("div", { className: "h-4 bg-gray-200 rounded w-2/3" })] }));
}
// Table row skeleton loader
export function TableRowSkeleton({ columns = 4 }) {
    return (_jsx("tr", { className: "animate-pulse", children: Array.from({ length: columns }).map((_, i) => (_jsx("td", { className: "px-6 py-4", children: _jsx("div", { className: "h-4 bg-gray-200 rounded" }) }, i))) }));
}
// List skeleton loader
export function ListSkeleton({ items = 5 }) {
    return (_jsx("div", { className: "space-y-3", children: Array.from({ length: items }).map((_, i) => (_jsxs("div", { className: "flex items-center space-x-4 animate-pulse", children: [_jsx("div", { className: "h-12 w-12 bg-gray-200 rounded-full" }), _jsxs("div", { className: "flex-1 space-y-2", children: [_jsx("div", { className: "h-4 bg-gray-200 rounded w-3/4" }), _jsx("div", { className: "h-3 bg-gray-200 rounded w-1/2" })] })] }, i))) }));
}
// Product grid skeleton
export function ProductGridSkeleton({ items = 6 }) {
    return (_jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6", children: Array.from({ length: items }).map((_, i) => (_jsxs("div", { className: "bg-white rounded-lg border border-gray-200 overflow-hidden animate-pulse", children: [_jsx("div", { className: "h-48 bg-gray-200" }), _jsxs("div", { className: "p-4 space-y-3", children: [_jsx("div", { className: "h-4 bg-gray-200 rounded w-3/4" }), _jsx("div", { className: "h-4 bg-gray-200 rounded w-1/2" }), _jsx("div", { className: "h-8 bg-gray-200 rounded" })] })] }, i))) }));
}
// Empty state component
export function EmptyState({ icon: Icon, title, description, action }) {
    return (_jsxs("div", { className: "text-center py-12", children: [Icon && (_jsx("div", { className: "flex justify-center mb-4", children: _jsx("div", { className: "rounded-full bg-gray-100 p-3", children: _jsx(Icon, { className: "h-8 w-8 text-gray-400" }) }) })), _jsx("h3", { className: "text-lg font-semibold text-gray-900 mb-2", children: title }), description && (_jsx("p", { className: "text-sm text-gray-600 mb-6 max-w-md mx-auto", children: description })), action && _jsx("div", { children: action })] }));
}
