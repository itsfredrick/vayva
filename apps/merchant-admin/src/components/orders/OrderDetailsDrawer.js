import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import React from "react";
import { UnifiedOrderStatus, OrderType } from "@vayva/shared";
import { Drawer, Icon, cn, Button } from "@vayva/ui";
export const OrderDetailsDrawer = ({ order, onClose, }) => {
    const [isLoading, setIsLoading] = React.useState(false);
    const [actionNote, setActionNote] = React.useState("");
    const [showCancel, setShowCancel] = React.useState(false);
    const [showRefund, setShowRefund] = React.useState(false);
    if (!order)
        return null;
    const formatCurrency = (amount) => {
        return new Intl.NumberFormat("en-NG", {
            style: "currency",
            currency: "NGN",
            maximumFractionDigits: 0,
        }).format(amount);
    };
    const handleStatusUpdate = async (nextStatus) => {
        setIsLoading(true);
        try {
            await fetch(`/api/orders/${order.id}/status`, {
                method: "POST",
                body: JSON.stringify({ next_status: nextStatus }),
            });
            // Ideally trigger a refresh of the parent list here
            onClose();
        }
        catch (e) {
            console.error(e);
        }
        finally {
            setIsLoading(false);
        }
    };
    const handleCancel = async () => {
        setIsLoading(true);
        try {
            await fetch(`/api/orders/${order.id}/cancel`, {
                method: "POST",
                body: JSON.stringify({ reason: actionNote || "Merchant cancelled" }),
            });
            onClose();
        }
        catch (e) {
            console.error(e);
        }
        finally {
            setIsLoading(false);
        }
    };
    const handleRefund = async () => {
        setIsLoading(true);
        try {
            await fetch(`/api/orders/${order.id}/refund`, {
                method: "POST",
                body: JSON.stringify({
                    amount: order.totalAmount,
                    reason: actionNote || "Full refund",
                }),
            });
            onClose();
        }
        catch (e) {
            console.error(e);
        }
        finally {
            setIsLoading(false);
        }
    };
    const renderActionButtons = () => {
        if (showCancel) {
            return (_jsxs("div", { className: "flex flex-col gap-3 w-full animate-in slide-in-from-bottom-5", children: [_jsx("p", { className: "text-sm font-bold text-red-600 mb-1", children: "Confirm Cancellation?" }), _jsx("input", { className: "w-full border border-gray-300 rounded-lg p-2 text-sm", placeholder: "Reason for cancellation...", value: actionNote, onChange: (e) => setActionNote(e.target.value) }), _jsxs("div", { className: "flex gap-2", children: [_jsx(Button, { onClick: () => setShowCancel(false), variant: "secondary", className: "flex-1 font-bold rounded-xl", children: "Back" }), _jsx(Button, { onClick: handleCancel, disabled: isLoading, variant: "destructive", className: "flex-1 font-bold rounded-xl", children: isLoading ? "Processing..." : "Confirm Cancel" })] })] }));
        }
        if (showRefund) {
            return (_jsxs("div", { className: "flex flex-col gap-3 w-full animate-in slide-in-from-bottom-5", children: [_jsx("p", { className: "text-sm font-bold text-orange-600 mb-1", children: "Issue Full Refund?" }), _jsx("input", { className: "w-full border border-gray-300 rounded-lg p-2 text-sm", placeholder: "Reason for refund...", value: actionNote, onChange: (e) => setActionNote(e.target.value) }), _jsxs("div", { className: "flex gap-2", children: [_jsx(Button, { onClick: () => setShowRefund(false), variant: "secondary", className: "flex-1 font-bold rounded-xl", children: "Back" }), _jsx(Button, { onClick: handleRefund, disabled: isLoading, className: "flex-1 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-xl", children: isLoading
                                    ? "Processing..."
                                    : `Refund ${formatCurrency(order.totalAmount)}` })] })] }));
        }
        // Default Workflow Buttons
        return (_jsxs("div", { className: "flex flex-col gap-3 w-full", children: [_jsxs("div", { className: "flex gap-2", children: [order.status === UnifiedOrderStatus.NEW && (_jsxs(_Fragment, { children: [_jsx(Button, { onClick: () => handleStatusUpdate(UnifiedOrderStatus.PROCESSING), className: "flex-1 rounded-xl font-bold", children: "Accept Order" }), _jsx(Button, { onClick: () => setShowCancel(true), variant: "destructive" //Using destructive variant but overriding bg for softer look if needed, or stick to system destructive
                                    , className: "px-4 bg-red-50 text-red-600 hover:bg-red-100 border-none rounded-xl font-bold", children: "Reject" })] })), order.status === UnifiedOrderStatus.PROCESSING && (_jsx(Button, { onClick: () => handleStatusUpdate(UnifiedOrderStatus.READY), className: "flex-1 rounded-xl font-bold", children: "Mark Ready / Shipped" })), order.status === UnifiedOrderStatus.READY && (_jsx(Button, { onClick: () => handleStatusUpdate(UnifiedOrderStatus.COMPLETED), className: "flex-1 bg-green-600 hover:bg-green-700 text-white rounded-xl font-bold", children: "Complete Order" }))] }), order.status !== UnifiedOrderStatus.CANCELLED &&
                    order.status !== UnifiedOrderStatus.REFUNDED &&
                    order.status !== UnifiedOrderStatus.NEW && (_jsxs("div", { className: "flex gap-2 justify-center pt-2", children: [_jsx(Button, { variant: "link", onClick: () => setShowCancel(true), className: "text-xs font-bold text-red-500 hover:text-red-700 underline p-0 h-auto", children: "Cancel Order" }), _jsx("span", { className: "text-gray-300", children: "|" }), _jsx(Button, { variant: "link", onClick: () => setShowRefund(true), className: "text-xs font-bold text-orange-500 hover:text-orange-700 underline p-0 h-auto", children: "Issue Refund" })] }))] }));
    };
    return (_jsxs(Drawer, { isOpen: !!order, onClose: onClose, title: order.type === OrderType.SERVICE
            ? `Booking #${order.id.split("_")[1]}`
            : `Order #${order.id.split("_")[1]}`, className: "md:max-w-md w-full", children: [_jsxs("div", { className: "p-6 space-y-8 pb-32", children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { children: [_jsx("p", { className: "text-xs text-gray-400 font-medium mb-1 uppercase tracking-wider", children: "Status" }), _jsx("h2", { className: "text-xl font-bold capitalize", children: order.status.replace("_", " ") })] }), _jsx("div", { className: cn("px-4 py-2 rounded-full text-sm font-bold capitalize", order.status === UnifiedOrderStatus.NEW
                                    ? "bg-blue-100 text-blue-700"
                                    : order.status === UnifiedOrderStatus.COMPLETED
                                        ? "bg-green-100 text-green-700"
                                        : order.status === UnifiedOrderStatus.CANCELLED
                                            ? "bg-red-100 text-red-700"
                                            : "bg-gray-100 text-gray-700"), children: order.status.replace("_", " ").toLowerCase() })] }), _jsxs("div", { className: "bg-gray-50 rounded-2xl p-4 border border-gray-100", children: [_jsxs("div", { className: "flex items-center gap-3 mb-4", children: [_jsx("div", { className: "w-10 h-10 rounded-full bg-white border border-gray-200 flex items-center justify-center font-bold text-gray-500", children: order.customer.name.charAt(0) }), _jsxs("div", { children: [_jsx("h3", { className: "font-bold text-gray-900", children: order.customer.name }), _jsx("p", { className: "text-xs text-gray-500 font-mono", children: order.customer.phone })] })] }), _jsxs("div", { className: "flex gap-2", children: [_jsxs(Button, { className: "flex-1 bg-green-500 hover:bg-green-600 text-white rounded-lg font-bold gap-2", children: [_jsx(Icon, { name: "MessageCircle", size: 16 }), " WhatsApp"] }), _jsx(Button, { variant: "outline", className: "flex-1 rounded-lg font-bold", children: "Call" })] })] }), _jsxs("div", { children: [_jsxs("h3", { className: "text-sm font-bold text-gray-900 mb-4 flex items-center gap-2", children: [_jsx(Icon, { name: "ShoppingBag", size: 16 }), " Items"] }), _jsxs("div", { className: "space-y-3", children: [order.items.map((item, i) => (_jsxs("div", { className: "flex justify-between items-start py-2 border-b border-gray-50 last:border-0", children: [_jsxs("div", { className: "flex gap-3", children: [_jsxs("div", { className: "w-6 h-6 rounded bg-gray-100 flex items-center justify-center text-xs font-bold text-gray-600", children: [item.quantity, "x"] }), _jsxs("div", { children: [_jsx("p", { className: "text-sm font-medium text-gray-900", children: item.name }), item.modifiers && (_jsx("div", { className: "flex flex-wrap gap-1 mt-1", children: item.modifiers.map((m, idx) => (_jsx("span", { className: "text-[10px] bg-gray-100 text-gray-600 px-1.5 rounded", children: m }, idx))) }))] })] }), _jsx("span", { className: "font-mono text-sm font-medium", children: formatCurrency(item.price * item.quantity) })] }, i))), _jsxs("div", { className: "flex justify-between pt-4 border-t border-gray-100", children: [_jsx("span", { className: "font-bold text-gray-900", children: "Total" }), _jsx("span", { className: "font-bold text-xl text-gray-900", children: formatCurrency(order.totalAmount) })] })] })] }), _jsxs("div", { className: "p-4 rounded-xl border border-gray-100 flex items-center justify-between", children: [_jsxs("div", { className: "flex items-center gap-2", children: [_jsx(Icon, { name: "CreditCard", size: 18, className: "text-gray-400" }), _jsx("span", { className: "text-sm font-medium text-gray-600", children: "Payment Status" })] }), _jsx("span", { className: cn("text-xs font-bold px-2 py-1 rounded uppercase", order.paymentStatus === "paid"
                                    ? "bg-green-50 text-green-700"
                                    : "bg-orange-50 text-orange-700"), children: order.paymentStatus })] })] }), _jsx("div", { className: "absolute bottom-0 left-0 right-0 p-4 bg-white border-t border-gray-100 z-10", children: renderActionButtons() })] }));
};
