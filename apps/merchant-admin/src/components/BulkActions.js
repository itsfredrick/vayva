"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Button } from "@vayva/ui";
import { Trash2, Download, CheckSquare, Square } from "lucide-react";
export function BulkActions({ selectedCount, totalCount, allSelected, onSelectAll, onDeselectAll, actions, }) {
    if (selectedCount === 0)
        return null;
    return (_jsxs("div", { className: "bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4 flex items-center justify-between", children: [_jsxs("div", { className: "flex items-center gap-4", children: [_jsxs(Button, { variant: "ghost", onClick: allSelected ? onDeselectAll : onSelectAll, className: "flex items-center gap-2 text-sm font-medium text-blue-900 hover:text-blue-700 hover:bg-blue-100/50 transition-colors h-auto p-2", "aria-label": allSelected ? "Deselect all items" : "Select all items", children: [allSelected ? (_jsx(CheckSquare, { className: "h-5 w-5" })) : (_jsx(Square, { className: "h-5 w-5" })), _jsxs("span", { children: [selectedCount, " of ", totalCount, " selected"] })] }), !allSelected && selectedCount < totalCount && (_jsxs(Button, { variant: "link", onClick: onSelectAll, className: "text-sm text-blue-600 hover:text-blue-800 underline h-auto p-0", "aria-label": "Select all items on this page", children: ["Select all ", totalCount] }))] }), _jsx("div", { className: "flex items-center gap-2", children: actions.map((action, index) => (_jsxs(Button, { variant: action.variant || "outline", size: "sm", onClick: action.onClick, disabled: action.disabled, className: "flex items-center gap-2", "aria-label": action.label, children: [action.icon, action.label] }, index))) })] }));
}
// Preset bulk actions for common use cases
export const bulkDeleteAction = (onDelete) => ({
    label: "Delete",
    icon: _jsx(Trash2, { className: "h-4 w-4" }),
    onClick: onDelete,
    variant: "destructive",
});
export const bulkExportAction = (onExport) => ({
    label: "Export",
    icon: _jsx(Download, { className: "h-4 w-4" }),
    onClick: onExport,
    variant: "outline",
});
