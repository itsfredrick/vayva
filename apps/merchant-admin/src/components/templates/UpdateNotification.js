"use client";
import { jsxs as _jsxs, jsx as _jsx } from "react/jsx-runtime";
import { Button } from "@vayva/ui";
export function UpdateNotification({ templateName, currentVersion, latestVersion, onReview, onDismiss, }) {
    return (_jsx("div", { className: "bg-blue-50 border border-blue-200 rounded-lg p-4", children: _jsxs("div", { className: "flex justify-between items-start gap-4", children: [_jsxs("div", { className: "flex-1", children: [_jsxs("p", { className: "text-sm font-semibold text-blue-900 mb-1", children: ["Update available for ", templateName] }), _jsxs("p", { className: "text-sm text-blue-700 mb-3", children: ["A newer version (", latestVersion, ") of your template is available. You're currently on ", currentVersion, "."] }), _jsx(Button, { variant: "link", onClick: onReview, className: "text-sm text-blue-600 hover:text-blue-700 underline font-semibold h-auto p-0", children: "Review update" })] }), onDismiss && (_jsx(Button, { variant: "ghost", size: "icon", onClick: onDismiss, className: "text-blue-600 hover:text-blue-700 h-6 w-6", "aria-label": "Dismiss", children: "\u00D7" }))] }) }));
}
