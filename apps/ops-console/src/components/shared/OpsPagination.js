import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Button } from "@vayva/ui";
import { ChevronLeft, ChevronRight } from "lucide-react";
export function OpsPagination({ currentPage, totalItems, limit, onPageChange, }) {
    const totalPages = Math.ceil(totalItems / limit);
    const startItem = (currentPage - 1) * limit + 1;
    const endItem = Math.min(currentPage * limit, totalItems);
    return (_jsxs("div", { className: "bg-gray-50 border-t border-gray-200 px-6 py-3 flex items-center justify-between", children: [_jsxs("div", { className: "text-xs text-gray-500", children: ["Showing ", _jsx("span", { className: "font-medium", children: startItem }), " to", " ", _jsx("span", { className: "font-medium", children: endItem }), " of", " ", _jsx("span", { className: "font-medium", children: totalItems }), " results"] }), _jsxs("div", { className: "flex gap-2", children: [_jsxs(Button, { variant: "outline", size: "sm", onClick: () => onPageChange(currentPage - 1), disabled: currentPage <= 1, className: "h-8 text-xs h-auto", "aria-label": "Previous page", children: [_jsx(ChevronLeft, { className: "w-3 h-3 mr-1" }), "Previous"] }), _jsxs(Button, { variant: "outline", size: "sm", onClick: () => onPageChange(currentPage + 1), disabled: currentPage >= totalPages, className: "h-8 text-xs h-auto", "aria-label": "Next page", children: ["Next", _jsx(ChevronRight, { className: "w-3 h-3 ml-1" })] })] })] }));
}
