"use client";
import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState } from "react";
import { Button, Icon } from "@vayva/ui";
import { motion } from "framer-motion";
import { useToast } from "@/components/ui/use-toast";
export const DeliveryTaskModal = ({ isOpen, onClose, order, }) => {
    const { toast } = useToast();
    const [loading, setLoading] = useState(false);
    if (!isOpen)
        return null;
    const handleSubmit = async () => {
        setLoading(true);
        try {
            const res = await fetch(`/api/orders/${order.id}/delivery/dispatch`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
            });
            if (!res.ok)
                throw new Error("Failed to create shipment");
            toast({
                title: "Success",
                description: "Delivery Task Created & Order Fulfilled!",
            });
            onClose();
            // Ideally trigger refresh of order details here
            window.location.reload();
        }
        catch (error) {
            console.error(error);
            toast({
                title: "Error",
                description: "Failed to create delivery task",
                variant: "destructive",
            });
        }
        finally {
            setLoading(false);
        }
    };
    return (_jsx("div", { className: "fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm", onClick: (e) => e.target === e.currentTarget && onClose(), children: _jsxs(motion.div, { initial: { opacity: 0, scale: 0.95 }, animate: { opacity: 1, scale: 1 }, exit: { opacity: 0, scale: 0.95 }, className: "bg-white rounded-xl shadow-xl w-full max-w-lg overflow-hidden", children: [_jsxs("div", { className: "p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50", children: [_jsx("h3", { className: "font-bold text-black", children: "Create Delivery Task" }), _jsx(Button, { variant: "ghost", size: "icon", onClick: onClose, "aria-label": "Close", className: "h-8 w-8", children: _jsx(Icon, { name: "X", size: 18 }) })] }), _jsxs("div", { className: "p-6 flex flex-col gap-4", children: [_jsxs("div", { className: "bg-blue-50 p-3 rounded-lg text-sm text-blue-800 flex items-start gap-2", children: [_jsx(Icon, { name: "Info", size: 16, className: "mt-0.5 shrink-0" }), _jsx("p", { children: "This will assign a rider to pick up from your store location." })] }), _jsxs("div", { className: "grid grid-cols-2 gap-4", children: [_jsxs("div", { className: "flex flex-col gap-1", children: [_jsx("label", { className: "text-xs font-bold text-[#525252]", children: "Pickup Address" }), _jsxs("div", { className: "p-2 border border-gray-200 rounded-lg bg-gray-50 text-sm text-gray-500 h-24 overflow-hidden", children: ["Store Onboarding Address (Test)", _jsx("br", {}), "123 Merchant Road", _jsx("br", {}), "Lagos"] })] }), _jsxs("div", { className: "flex flex-col gap-1", children: [_jsx("label", { className: "text-xs font-bold text-[#525252]", children: "Delivery Address" }), _jsx("div", { className: "p-2 border border-gray-200 rounded-lg bg-gray-50 text-sm text-gray-500 h-24 overflow-hidden", children: order.shippingAddress ? (_jsxs(_Fragment, { children: [order.shippingAddress.street, _jsx("br", {}), order.shippingAddress.city, ", ", order.shippingAddress.state] })) : (_jsx("span", { className: "text-gray-400 italic", children: "No shipping address provided" })) })] })] }), _jsxs("div", { className: "flex flex-col gap-1", children: [_jsx("label", { className: "text-xs font-bold text-[#525252]", htmlFor: "rider-pref", children: "Rider Preference" }), _jsxs("select", { id: "rider-pref", "aria-label": "Rider Preference", className: "h-10 border border-gray-200 rounded-lg px-2 bg-white", children: [_jsx("option", { children: "Standard Bike (Next Available)" }), _jsx("option", { children: "Express (Priority)" })] })] }), _jsx(Button, { className: "w-full mt-2", onClick: handleSubmit, disabled: loading, children: loading ? "Requesting Rider..." : "Create Task" })] })] }) }));
};
export const RefundModal = ({ isOpen, onClose, order }) => {
    const { toast } = useToast();
    const [loading, setLoading] = useState(false);
    const [amount, setAmount] = useState(order.total.toString());
    const [reason, setReason] = useState("");
    if (!isOpen)
        return null;
    const handleSubmit = async () => {
        setLoading(true);
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1500));
        setLoading(false);
        onClose();
        toast({
            title: "Refund Initiated",
            description: "The refund process has started.",
        });
    };
    return (_jsx("div", { className: "fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm", onClick: (e) => e.target === e.currentTarget && onClose(), children: _jsxs(motion.div, { initial: { opacity: 0, scale: 0.95 }, animate: { opacity: 1, scale: 1 }, exit: { opacity: 0, scale: 0.95 }, className: "bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden", children: [_jsxs("div", { className: "p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50", children: [_jsx("h3", { className: "font-bold text-black", children: "Initiate Refund" }), _jsx(Button, { variant: "ghost", size: "icon", onClick: onClose, "aria-label": "Close", className: "h-8 w-8", children: _jsx(Icon, { name: "X", size: 18 }) })] }), _jsxs("div", { className: "p-6 flex flex-col gap-4", children: [_jsxs("div", { className: "flex flex-col gap-1", children: [_jsx("label", { className: "text-xs font-bold text-[#525252]", htmlFor: "refund-amount", children: "Refund Amount (\u20A6)" }), _jsx("input", { id: "refund-amount", type: "number", className: "h-10 border border-gray-200 rounded-lg px-3 focus:ring-2 focus:ring-black/5 outline-none", value: amount, onChange: (e) => setAmount(e.target.value) }), _jsxs("p", { className: "text-xs text-gray-400", children: ["Max refundable: \u20A6 ", order.total.toLocaleString()] })] }), _jsxs("div", { className: "flex flex-col gap-1", children: [_jsx("label", { className: "text-xs font-bold text-[#525252]", htmlFor: "refund-reason", children: "Reason" }), _jsxs("select", { id: "refund-reason", "aria-label": "Refund Reason", className: "h-10 border border-gray-200 rounded-lg px-2 bg-white", value: reason, onChange: (e) => setReason(e.target.value), children: [_jsx("option", { value: "", children: "Select a reason" }), _jsx("option", { value: "cancelled", children: "Order Cancelled" }), _jsx("option", { value: "returned", children: "Item Returned" }), _jsx("option", { value: "out_of_stock", children: "Out of Stock" }), _jsx("option", { value: "fraud", children: "Fraudulent" })] })] }), _jsx(Button, { variant: "outline", className: "w-full mt-2 border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700 hover:border-red-300", onClick: handleSubmit, disabled: loading || !reason, children: loading ? "Processing..." : "Confirm Refund" })] })] }) }));
};
