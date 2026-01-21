"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import * as React from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, } from "@/components/ui/dialog";
import { Button } from "@vayva/ui";
import { Textarea } from "@/components/ui/textarea";
export function ReasonModal({ isOpen, onClose, onConfirm, title, description, confirmLabel = "Confirm Action", placeholder = "Please provide a reason for this action...", }) {
    const [reason, setReason] = React.useState("");
    const [isSubmitting, setIsSubmitting] = React.useState(false);
    React.useEffect(() => {
        if (isOpen)
            setReason("");
    }, [isOpen]);
    const handleConfirm = async () => {
        if (!reason.trim())
            return;
        setIsSubmitting(true);
        try {
            await onConfirm(reason);
            onClose();
        }
        catch (error) {
            console.error("Failed to confirm action", error);
        }
        finally {
            setIsSubmitting(false);
        }
    };
    return (_jsx(Dialog, { open: isOpen, onOpenChange: (open) => !open && onClose(), children: _jsxs(DialogContent, { className: "sm:max-w-[425px]", children: [_jsxs(DialogHeader, { children: [_jsx(DialogTitle, { className: "text-xl font-bold", children: title }), _jsx(DialogDescription, { className: "text-muted-foreground", children: description })] }), _jsxs("div", { className: "grid gap-4 py-4", children: [_jsx(Textarea, { value: reason, onChange: (e) => setReason(e.target.value), placeholder: placeholder, className: "min-h-[100px] bg-slate-50/50 border-slate-200", autoFocus: true }), _jsx("p", { className: "text-[10px] text-muted-foreground italic", children: "* This action will be audited and logged to the global system log." })] }), _jsxs(DialogFooter, { className: "gap-2 sm:gap-0", children: [_jsx(Button, { variant: "ghost", onClick: onClose, disabled: isSubmitting, children: "Cancel" }), _jsx(Button, { onClick: handleConfirm, disabled: !reason.trim() || isSubmitting, className: "bg-primary text-primary-foreground hover:bg-primary/90", children: isSubmitting ? "Processing..." : confirmLabel })] })] }) }));
}
