"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React from "react";
import { Button, Modal } from "@vayva/ui";
import { AlertTriangle, Info, AlertCircle } from "lucide-react";
export function ConfirmDialog({ isOpen, onClose, onConfirm, title, message, confirmText = "Confirm", cancelText = "Cancel", variant = "danger", loading = false, }) {
    const icons = {
        danger: AlertCircle,
        warning: AlertTriangle,
        info: Info,
    };
    const colors = {
        danger: "text-red-600 bg-red-50",
        warning: "text-yellow-600 bg-yellow-50",
        info: "text-blue-600 bg-blue-50",
    };
    const Icon = icons[variant];
    // Handle keyboard shortcuts
    React.useEffect(() => {
        if (!isOpen)
            return;
        const handleKeyDown = (e) => {
            if (e.key === "Escape") {
                onClose();
            }
            else if (e.key === "Enter" && !loading) {
                onConfirm();
            }
        };
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [isOpen, onClose, onConfirm, loading]);
    return (_jsx(Modal, { isOpen: isOpen, onClose: onClose, title: "", children: _jsxs("div", { className: "space-y-4", children: [_jsxs("div", { className: "flex items-start gap-4", children: [_jsx("div", { className: `p-3 rounded-full ${colors[variant]}`, children: _jsx(Icon, { className: "h-6 w-6" }) }), _jsxs("div", { className: "flex-1", children: [_jsx("h3", { className: "text-lg font-semibold text-gray-900 mb-2", children: title }), _jsx("p", { className: "text-sm text-gray-600", children: message })] })] }), _jsxs("div", { className: "flex justify-end gap-3 pt-4 border-t", children: [_jsx(Button, { variant: "outline", onClick: onClose, disabled: loading, "aria-label": cancelText, children: cancelText }), _jsx(Button, { variant: variant === "danger" ? "destructive" : "primary", onClick: onConfirm, disabled: loading, "aria-label": confirmText, children: loading ? "Processing..." : confirmText })] })] }) }));
}
