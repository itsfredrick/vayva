"use client";
import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState } from "react";
import { Button, Modal, Input, Label, Textarea } from "@vayva/ui";
import { AlertCircle, ShieldAlert } from "lucide-react";
export function DisputeDialog({ orderId, orderNumber, totalAmount }) {
    const [isOpen, setIsOpen] = useState(false);
    const [reason, setReason] = useState("");
    const [description, setDescription] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const handleSubmit = async () => {
        if (!reason || !description) {
            setError("Please provide a reason and description");
            return;
        }
        setLoading(true);
        setError(null);
        try {
            const res = await fetch("/api/disputes", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    orderId,
                    reason,
                    amount: totalAmount,
                    evidenceText: description
                })
            });
            if (res.ok) {
                setIsOpen(false);
                alert("Dispute opened successfully. A Vayva support agent will review your case.");
                window.location.reload(); // Refresh to show timeline update
            }
            else {
                const data = await res.json();
                setError(data.error || "Failed to open dispute");
            }
        }
        catch (e) {
            setError("Something went wrong. Please try again.");
        }
        finally {
            setLoading(false);
        }
    };
    return (_jsxs(_Fragment, { children: [_jsxs(Button, { variant: "outline", className: "w-full mb-3 border-orange-200 text-orange-700 hover:bg-orange-50 hover:text-orange-800", size: "sm", onClick: () => setIsOpen(true), children: [_jsx(ShieldAlert, { className: "w-4 h-4 mr-2" }), "Open Dispute"] }), _jsx(Modal, { isOpen: isOpen, onClose: () => setIsOpen(false), title: "Open Dispute", children: _jsxs("div", { className: "space-y-4", children: [_jsxs("p", { className: "text-sm text-muted-foreground", children: ["Opening a dispute for order ", _jsx("strong", { children: orderNumber }), ". Vayva will hold funds until resolved."] }), error && (_jsxs("div", { className: "bg-red-50 text-red-600 p-3 rounded-md text-sm flex items-start gap-2", children: [_jsx(AlertCircle, { className: "w-4 h-4 mt-0.5 shrink-0" }), error] })), _jsxs("div", { className: "space-y-2", children: [_jsx(Label, { htmlFor: "reason", children: "Reason for Dispute" }), _jsx(Input, { id: "reason", name: "reason", placeholder: "e.g. Items not received, Damaged goods", value: reason, onChange: (e) => setReason(e.target.value) })] }), _jsxs("div", { className: "space-y-2", children: [_jsx(Label, { htmlFor: "description", children: "Details & Evidence" }), _jsx(Textarea, { id: "description", name: "description", placeholder: "Please describe the issue in detail...", value: description, onChange: (e) => setDescription(e.target.value), rows: 4 })] }), _jsxs("div", { className: "flex justify-end gap-3 pt-4 border-t", children: [_jsx(Button, { variant: "ghost", onClick: () => setIsOpen(false), disabled: loading, children: "Cancel" }), _jsx(Button, { onClick: handleSubmit, disabled: loading, className: "bg-orange-600 hover:bg-orange-700 text-white", children: loading ? "Opening..." : "Open Dispute" })] })] }) })] }));
}
