"use client";
import { jsxs as _jsxs, jsx as _jsx, Fragment as _Fragment } from "react/jsx-runtime";
import { Button, Card, StatusChip } from "@vayva/ui";
import { formatDistanceToNow } from "date-fns";
import { CheckCircle, Clock, Loader2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
export function KitchenTicket({ order, onStatusChange }) {
    const [isLoading, setIsLoading] = useState(false);
    const updateStatus = async (status) => {
        setIsLoading(true);
        try {
            const res = await fetch(`/api/kitchen/orders/${order.id}/status`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ status })
            });
            if (!res.ok)
                throw new Error("Failed to update status");
            toast.success(`Order marked as ${status}`);
            onStatusChange();
        }
        catch (e) {
            toast.error("Error updating order");
        }
        finally {
            setIsLoading(false);
        }
    };
    const isPreparing = order.fulfillmentStatus === "PREPARING";
    return (_jsxs(Card, { className: `flex flex-col h-full overflow-hidden border-2 ${isPreparing ? "border-amber-400 bg-amber-50/10" : "border-gray-200"}`, children: [_jsxs("div", { className: "p-4 border-b bg-gray-50 flex justify-between items-start", children: [_jsxs("div", { children: [_jsxs("h3", { className: "text-xl font-bold text-gray-900", children: ["#", order.orderNumber] }), _jsxs("p", { className: "text-xs text-gray-500 mt-1 flex items-center gap-1", children: [_jsx(Clock, { size: 12 }), formatDistanceToNow(new Date(order.createdAt)), " ago"] })] }), _jsx(StatusChip, { status: order.fulfillmentStatus })] }), _jsxs("div", { className: "p-4 flex-1 space-y-3", children: [order.items.map((item) => (_jsx("div", { className: "flex justify-between items-start", children: _jsxs("div", { className: "flex gap-2", children: [_jsxs("span", { className: "font-bold text-gray-900 w-6", children: [item.quantity, "x"] }), _jsxs("div", { children: [_jsx("p", { className: "font-medium text-gray-900", children: item.title }), item.notes && (_jsxs("p", { className: "text-xs text-amber-600 italic mt-0.5", children: ["Note: ", item.notes] }))] })] }) }, item.id))), order.customerNote && (_jsxs("div", { className: "mt-4 p-2 bg-yellow-50 border border-yellow-100 rounded text-xs text-yellow-800", children: [_jsx("span", { className: "font-bold", children: "Customer Note:" }), " ", order.customerNote] }))] }), _jsx("div", { className: "p-4 border-t bg-gray-50/50", children: order.fulfillmentStatus === "UNFULFILLED" ? (_jsx(Button, { onClick: () => updateStatus("PREPARING"), className: "w-full bg-blue-600 hover:bg-blue-700 text-white", disabled: isLoading, children: isLoading ? _jsx(Loader2, { className: "animate-spin" }) : "Start Preparing" })) : order.fulfillmentStatus === "PREPARING" ? (_jsx(Button, { onClick: () => updateStatus("READY_FOR_PICKUP"), className: "w-full bg-green-600 hover:bg-green-700 text-white gap-2", disabled: isLoading, children: isLoading ? _jsx(Loader2, { className: "animate-spin" }) : _jsxs(_Fragment, { children: [_jsx(CheckCircle, { size: 18 }), " Mark Ready"] }) })) : (_jsx(Button, { variant: "outline", className: "w-full", disabled: true, children: "Completed" })) })] }));
}
