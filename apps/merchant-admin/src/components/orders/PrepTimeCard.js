"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from "react";
import { toast } from "sonner";
import { Button, Input } from "@vayva/ui";
import { Clock, Edit2, Save, X } from "lucide-react";
export function PrepTimeCard({ orderId, currentPrepTime, onUpdate }) {
    const [isEditing, setIsEditing] = useState(false);
    const [prepTime, setPrepTime] = useState(currentPrepTime?.toString() || "30");
    const [saving, setSaving] = useState(false);
    const handleSave = async () => {
        const minutes = parseInt(prepTime);
        if (isNaN(minutes) || minutes < 5 || minutes > 480) {
            toast.error("Prep time must be between 5 and 480 minutes");
            return;
        }
        setSaving(true);
        try {
            const res = await fetch(`/api/market/orders/${orderId}/prep-time`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ prepTimeMinutes: minutes }),
            });
            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.error || "Failed to update prep time");
            }
            toast.success("Preparation time updated");
            setIsEditing(false);
            onUpdate();
        }
        catch (error) {
            toast.error(error.message);
        }
        finally {
            setSaving(false);
        }
    };
    const handleCancel = () => {
        setPrepTime(currentPrepTime?.toString() || "30");
        setIsEditing(false);
    };
    return (_jsxs("div", { className: "bg-white p-6 rounded-xl border border-gray-100 shadow-sm", children: [_jsxs("div", { className: "flex items-center justify-between mb-4", children: [_jsxs("h2", { className: "font-semibold text-gray-900 flex items-center gap-2", children: [_jsx(Clock, { className: "h-4 w-4" }), "Preparation Time"] }), !isEditing && currentPrepTime && (_jsxs(Button, { variant: "link", onClick: () => setIsEditing(true), className: "text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1 p-0 h-auto", children: [_jsx(Edit2, { className: "h-3 w-3" }), "Edit"] }))] }), isEditing ? (_jsxs("div", { className: "space-y-3", children: [_jsxs("div", { className: "flex items-center gap-2", children: [_jsx(Input, { type: "number", value: prepTime, onChange: (e) => setPrepTime(e.target.value), min: 5, max: 480, className: "w-24 text-center", disabled: saving }), _jsx("span", { className: "text-sm text-gray-500", children: "minutes" })] }), _jsxs("div", { className: "flex gap-2", children: [_jsxs(Button, { onClick: handleSave, disabled: saving, size: "sm", className: "bg-blue-600 hover:bg-blue-700 text-white", children: [_jsx(Save, { className: "h-3 w-3 mr-1" }), saving ? "Saving..." : "Save"] }), _jsxs(Button, { onClick: handleCancel, disabled: saving, size: "sm", variant: "outline", children: [_jsx(X, { className: "h-3 w-3 mr-1" }), "Cancel"] })] }), _jsx("p", { className: "text-xs text-gray-400", children: "Estimated time to prepare this order (5-480 min)" })] })) : currentPrepTime ? (_jsxs("div", { children: [_jsx("p", { className: "text-3xl font-bold text-gray-900", children: currentPrepTime }), _jsx("p", { className: "text-sm text-gray-500 mt-1", children: "minutes" })] })) : (_jsxs(Button, { onClick: () => setIsEditing(true), variant: "outline", size: "sm", className: "w-full", children: [_jsx(Clock, { className: "h-4 w-4 mr-2" }), "Set Prep Time"] }))] }));
}
