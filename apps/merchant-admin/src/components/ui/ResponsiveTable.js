"use client";
import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { Card } from "@vayva/ui";
export function ResponsiveTable({ data, columns, keyExtractor, onRowClick, loading, emptyMessage = "No data available" }) {
    if (loading) {
        return (_jsx("div", { className: "space-y-3", children: [1, 2, 3].map((i) => (_jsx("div", { className: "h-16 bg-gray-100 rounded-lg animate-pulse" }, i))) }));
    }
    if (data.length === 0) {
        return (_jsx(Card, { className: "p-8 text-center text-gray-500", children: emptyMessage }));
    }
    return (_jsxs(_Fragment, { children: [_jsx("div", { className: "hidden md:block overflow-x-auto", children: _jsxs("table", { className: "w-full", children: [_jsx("thead", { children: _jsx("tr", { className: "border-b border-gray-200", children: columns.map((col) => (_jsx("th", { className: "px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider", children: col.label }, col.key))) }) }), _jsx("tbody", { className: "divide-y divide-gray-100", children: data.map((item) => (_jsx("tr", { onClick: () => onRowClick?.(item), className: `
                  hover:bg-gray-50 transition-colors
                  ${onRowClick ? "cursor-pointer" : ""}
                `, children: columns.map((col) => (_jsx("td", { className: "px-4 py-4 text-sm text-gray-900", children: col.render ? col.render(item) : item[col.key] }, col.key))) }, keyExtractor(item)))) })] }) }), _jsx("div", { className: "md:hidden space-y-3", children: data.map((item) => (_jsx(Card, { className: `
              p-4 space-y-2
              ${onRowClick ? "cursor-pointer active:scale-[0.98] transition-transform" : ""}
            `, onClick: () => onRowClick?.(item), children: columns
                        .filter((col) => col.priority !== "low") // Hide low-priority columns on mobile
                        .map((col) => (_jsxs("div", { className: "flex justify-between items-start gap-2", children: [_jsx("span", { className: "text-xs font-semibold text-gray-500 uppercase tracking-wide min-w-[80px]", children: col.mobileLabel || col.label }), _jsx("span", { className: "text-sm text-gray-900 text-right flex-1", children: col.render ? col.render(item) : item[col.key] })] }, col.key))) }, keyExtractor(item)))) })] }));
}
