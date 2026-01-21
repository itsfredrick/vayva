"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Button } from "@vayva/ui";
import Link from "next/link";
export function ActivationNudge({ type, onDismiss }) {
    if (type === "activated") {
        // Silent success - no UI
        return null;
    }
    const getNudgeContent = () => {
        switch (type) {
            case "no_orders":
                return {
                    message: "Your setup is ready. Orders will appear automatically when customers message you on WhatsApp.",
                    action: null,
                };
            case "no_payments":
                return {
                    message: "You have orders waiting for payment confirmation.",
                    action: {
                        label: "Learn how to record payments",
                        href: "/help#recording-payments",
                    },
                };
            default:
                return null;
        }
    };
    const content = getNudgeContent();
    if (!content)
        return null;
    return (_jsx("div", { className: "bg-blue-50 border border-blue-200 rounded-lg p-4", children: _jsxs("div", { className: "flex justify-between items-start gap-4", children: [_jsxs("div", { className: "flex-1", children: [_jsx("p", { className: "text-sm text-blue-900", children: content.message }), content.action && (_jsx(Link, { href: content.action.href, className: "text-sm text-blue-600 hover:text-blue-700 underline mt-2 inline-block", children: content.action.label }))] }), onDismiss && (_jsx(Button, { onClick: onDismiss, className: "text-blue-600 hover:text-blue-700 text-sm flex-shrink-0", "aria-label": "Dismiss", children: "\u00D7" }))] }) }));
}
