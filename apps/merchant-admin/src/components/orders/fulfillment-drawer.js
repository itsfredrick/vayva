"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from "react";
import { Badge, Button, Drawer, Input, SuccessState } from "@vayva/ui";
import { Truck, MapPin } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
export function FulfillmentDrawer({ order, isOpen, onClose, onUpdate, }) {
    const { toast } = useToast();
    const [loading, setLoading] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    // State for manual updates
    const [courierName, setCourierName] = useState("");
    const [courierPhone, setCourierPhone] = useState("");
    const shipment = order?.shipment;
    // Strict Dispatch (POST /api/orders/[id]/delivery/dispatch)
    const handleDispatch = async () => {
        setLoading(true);
        try {
            const res = await fetch(`/api/orders/${order.id}/delivery/dispatch`, {
                method: "POST",
            });
            const data = await res.json();
            if (!res.ok) {
                toast({
                    title: "Dispatch Failed",
                    description: data.error || "Could not dispatch delivery.",
                    variant: "destructive",
                });
            }
            else {
                setIsSuccess(true);
                setTimeout(() => {
                    onUpdate?.();
                }, 3000);
            }
        }
        catch (err) {
            console.error(err);
            toast({
                title: "Error",
                description: "Failed to dispatch delivery. Please try again.",
                variant: "destructive",
            });
        }
        finally {
            setLoading(false);
        }
    };
    // Strict Manual Status (POST /api/orders/[id]/delivery/manual-status)
    const handleManualStatus = async (status) => {
        setLoading(true);
        try {
            const payload = {
                status,
                courierName: courierName || undefined,
                courierPhone: courierPhone || undefined,
            };
            const res = await fetch(`/api/orders/${order.id}/delivery/manual-status`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });
            const data = await res.json();
            if (!res.ok) {
                toast({
                    title: "Update Failed",
                    description: data.error || "Could not update status.",
                    variant: "destructive",
                });
            }
            else {
                setIsSuccess(true);
                setTimeout(() => {
                    onUpdate?.();
                    setIsSuccess(false);
                }, 3000);
            }
        }
        catch (err) {
            console.error(err);
            toast({
                title: "Error",
                description: "Failed to update status.",
                variant: "destructive",
            });
        }
        finally {
            setLoading(false);
        }
    };
    const hasShipment = !!shipment;
    const isCustom = shipment?.provider === "CUSTOM";
    const isKwik = shipment?.provider === "KWIK";
    const status = shipment?.status || "DRAFT";
    if (isSuccess) {
        return (_jsx(Drawer, { isOpen: isOpen, onClose: onClose, title: "Success", children: _jsx("div", { className: "h-full flex items-center justify-center -mt-12", children: _jsx(SuccessState, { title: "Delivery Scheduled", description: "Your delivery has been successfully dispatched. The customer will receive tracking updates shortly.", icon: "truck", action: _jsx(Button, { onClick: onClose, variant: "outline", className: "px-8", children: "Close" }) }) }) }));
    }
    return (_jsx(Drawer, { isOpen: isOpen, onClose: onClose, title: `Fulfillment #${order?.orderNumber || order?.refCode}`, children: _jsxs("div", { className: "space-y-6 pt-4", children: [(!hasShipment || status === "DRAFT") && (_jsxs("div", { className: "bg-gray-50 p-6 rounded-2xl border border-dashed border-gray-200", children: [_jsxs("div", { className: "flex items-center gap-4 mb-6", children: [_jsx("div", { className: "w-12 h-12 bg-black text-white rounded-xl flex items-center justify-center shadow-lg", children: _jsx(Truck, { className: "w-6 h-6" }) }), _jsxs("div", { children: [_jsx("h3", { className: "font-bold text-gray-900", children: hasShipment ? "Confirm Dispatch" : "Ready to Deliver?" }), _jsx("p", { className: "text-xs text-gray-500", children: "Dispatch via your active provider." })] })] }), _jsx(Button, { className: "w-full h-12 rounded-xl", onClick: handleDispatch, isLoading: loading, children: hasShipment ? "Confirm & Dispatch" : "Dispatch Delivery" })] })), hasShipment && (_jsxs("div", { className: "bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm", children: [_jsxs("div", { className: "p-4 bg-gray-50/50 border-b border-gray-100 flex justify-between items-center", children: [_jsx("span", { className: "text-[10px] font-bold uppercase tracking-widest text-gray-400", children: isKwik ? "KWIK DELIVERY" : "CUSTOM COURIER" }), _jsx(Badge, { variant: status === "DELIVERED" ? "success" : "default", children: status })] }), _jsxs("div", { className: "p-6 space-y-6", children: [(shipment.trackingUrl || shipment.trackingCode) && (_jsxs("div", { className: "p-4 bg-indigo-50/50 rounded-xl border border-indigo-100/50 space-y-4", children: [shipment.trackingCode && (_jsxs("div", { className: "flex justify-between items-center text-xs", children: [_jsx("span", { className: "font-bold text-indigo-900/40 uppercase tracking-widest text-[9px]", children: "Tracking Code" }), _jsx("span", { className: "font-mono font-bold text-indigo-600", children: shipment.trackingCode })] })), shipment.trackingUrl && (_jsxs("a", { href: shipment.trackingUrl, target: "_blank", rel: "noopener noreferrer", className: "flex items-center justify-center gap-2 w-full h-10 bg-indigo-600 text-white text-xs font-bold rounded-lg hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-600/20", children: [_jsx(MapPin, { className: "w-3.5 h-3.5" }), "Track Real-time"] }))] })), isCustom && status !== "DELIVERED" && status !== "CANCELED" && (_jsxs("div", { className: "space-y-4", children: [_jsx("h4", { className: "text-xs font-bold text-gray-400 uppercase tracking-widest", children: "Update Progress" }), status === "REQUESTED" && (_jsx(Button, { size: "sm", variant: "outline", className: "w-full h-11 rounded-xl", onClick: () => handleManualStatus("ACCEPTED"), children: "Mark Accepted" })), status === "ACCEPTED" && (_jsxs("div", { className: "space-y-3", children: [_jsx(Input, { placeholder: "Courier Name", value: courierName, onChange: (e) => setCourierName(e.target.value), className: "h-11 rounded-xl" }), _jsx(Input, { placeholder: "Courier Phone", value: courierPhone, onChange: (e) => setCourierPhone(e.target.value), className: "h-11 rounded-xl" }), _jsx(Button, { size: "sm", className: "w-full h-11 rounded-xl", onClick: () => handleManualStatus("PICKED_UP"), disabled: !courierName, children: "Confirm Pickup" })] })), status === "PICKED_UP" && (_jsx(Button, { size: "sm", className: "w-full h-11 rounded-xl", onClick: () => handleManualStatus("IN_TRANSIT"), children: "Mark In Transit" })), status === "IN_TRANSIT" && (_jsxs("div", { className: "grid grid-cols-2 gap-3", children: [_jsx(Button, { size: "sm", variant: "outline", className: "h-11 rounded-xl text-green-600 border-green-100 hover:bg-green-50 hover:border-green-200", onClick: () => handleManualStatus("DELIVERED"), children: "Delivered" }), _jsx(Button, { size: "sm", variant: "outline", className: "h-11 rounded-xl text-red-600 border-red-100 hover:bg-red-50 hover:border-red-200", onClick: () => handleManualStatus("FAILED"), children: "Failed" })] }))] })), _jsxs("div", { className: "p-4 bg-gray-50 rounded-xl space-y-2 border border-gray-100", children: [_jsx("p", { className: "text-[10px] font-bold text-gray-400 uppercase tracking-widest", children: "Ship to" }), _jsx("div", { className: "text-sm font-bold text-gray-900", children: shipment.recipientName || order.customer?.name || "Customer" }), _jsxs("div", { className: "text-xs text-gray-500 leading-relaxed", children: [shipment.addressLine1 || "No Address Address Specified", _jsx("br", {}), shipment.addressCity] })] })] })] }))] }) }));
}
