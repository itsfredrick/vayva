"use client";
import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { Button, Card, StatusChip } from "@vayva/ui";
import { format } from "date-fns";
import { Check, X, User, Phone, Mail } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
export function ViewingRequestCard({ request, onUpdate }) {
    const [isLoading, setIsLoading] = useState(false);
    const updateStatus = async (status) => {
        setIsLoading(true);
        try {
            const res = await fetch(`/api/properties/viewings/${request.id}/status`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ status })
            });
            if (!res.ok)
                throw new Error("Failed to update status");
            toast.success(status === "CONFIRMED" ? "Tour Confirmed" : "Request Declined");
            onUpdate();
        }
        catch (e) {
            toast.error("An error occurred");
        }
        finally {
            setIsLoading(false);
        }
    };
    const customerName = request.metadata?.customerName || (request.customer ? `${request.customer.firstName} ${request.customer.lastName}` : "Unknown Guest");
    const customerEmail = request.metadata?.customerEmail || request.customer?.email;
    const customerPhone = request.metadata?.customerPhone || request.customer?.phone;
    return (_jsxs(Card, { className: "p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-6 hover:shadow-md transition-shadow bg-white", children: [_jsxs("div", { className: "flex items-start gap-4", children: [_jsxs("div", { className: "flex flex-col items-center justify-center bg-blue-50 text-blue-700 rounded-lg w-16 h-16 shrink-0 border border-blue-100", children: [_jsx("span", { className: "text-xs font-bold uppercase", children: format(new Date(request.startsAt), "MMM") }), _jsx("span", { className: "text-xl font-bold", children: format(new Date(request.startsAt), "d") })] }), _jsxs("div", { className: "space-y-1", children: [_jsx("h4", { className: "font-semibold text-gray-900 text-lg", children: request.service.title }), _jsxs("div", { className: "flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-sm text-gray-500", children: [_jsxs("div", { className: "flex items-center gap-1.5", children: [_jsx(ClockIcon, { className: "w-4 h-4" }), format(new Date(request.startsAt), "h:mm a")] }), _jsxs("div", { className: "flex items-center gap-1.5", children: [_jsx(User, { className: "w-4 h-4" }), customerName] })] }), _jsxs("div", { className: "flex items-center gap-3 text-xs text-gray-400 pt-1", children: [customerEmail && (_jsxs("div", { className: "flex items-center gap-1", children: [_jsx(Mail, { size: 12 }), " ", customerEmail] })), customerPhone && (_jsxs("div", { className: "flex items-center gap-1", children: [_jsx(Phone, { size: 12 }), " ", customerPhone] }))] })] })] }), _jsx("div", { className: "flex items-center gap-4 self-end sm:self-center", children: request.status === "PENDING" ? (_jsxs(_Fragment, { children: [_jsxs(Button, { variant: "outline", size: "sm", className: "bg-red-50 text-red-600 border-red-100 hover:bg-red-100 hover:text-red-700", onClick: () => updateStatus("CANCELLED"), disabled: isLoading, children: [_jsx(X, { size: 16, className: "mr-1" }), " Decline"] }), _jsxs(Button, { size: "sm", className: "bg-green-600 hover:bg-green-700 text-white shadow-sm", onClick: () => updateStatus("CONFIRMED"), disabled: isLoading, children: [_jsx(Check, { size: 16, className: "mr-1" }), " Approve"] })] })) : (_jsx(StatusChip, { status: request.status })) })] }));
}
function ClockIcon(props) {
    return (_jsxs("svg", { ...props, xmlns: "http://www.w3.org/2000/svg", width: "24", height: "24", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", children: [_jsx("circle", { cx: "12", cy: "12", r: "10" }), _jsx("polyline", { points: "12 6 12 12 16 14" })] }));
}
