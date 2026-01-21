"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Button } from "@vayva/ui";
import { useEducation } from "@/hooks/useEducation";
export function WorkflowNudge({ userId, guidanceId, message, }) {
    const { shouldShow, dismiss } = useEducation(userId, guidanceId);
    if (!shouldShow) {
        return null;
    }
    return (_jsx("div", { className: "bg-amber-50 border border-amber-200 rounded-lg p-4 mb-4", children: _jsxs("div", { className: "flex justify-between items-start gap-4", children: [_jsx("p", { className: "text-sm text-amber-900", children: message }), _jsx(Button, { onClick: dismiss, className: "text-amber-600 hover:text-amber-700 text-sm flex-shrink-0", "aria-label": "Dismiss", children: "\u00D7" })] }) }));
}
