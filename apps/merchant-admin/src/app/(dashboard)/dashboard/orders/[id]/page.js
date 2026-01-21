"use client";
import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button, cn, StatusChip, Card, Skeleton } from "@vayva/ui";
import { ChevronLeft, Truck, User, MapPin, Printer, AlertTriangle, ShoppingBag, MessageSquare } from "lucide-react";
import { PrepTimeCard } from "@/components/orders/PrepTimeCard";
export default function OrderDetailPage() {
    const params = useParams();
    const router = useRouter();
    const id = params?.id;
    const [loading, setLoading] = useState(true);
    const [shipping, setShipping] = useState(false);
    const [order, setOrder] = useState(null);
    const fetchOrder = async () => {
        try {
            const res = await fetch(`/api/orders/${id}`);
            const data = await res.json();
            if (data.error)
                throw new Error(data.error);
            setOrder(data);
        }
        catch (err) {
            toast.error("Failed to load order");
            router.push("/dashboard/orders");
        }
        finally {
            setLoading(false);
        }
    };
    useEffect(() => {
        if (id)
            fetchOrder();
    }, [id]);
    const handleShip = async () => {
        setShipping(true);
        try {
            const res = await fetch(`/api/orders/${id}`, {
                method: "PATCH",
                body: JSON.stringify({ status: "SHIPPED" })
            });
            const data = await res.json();
            if (!res.ok)
                throw new Error(data.error || "Shipping failed");
            toast.success("Order marked as shipped!");
            fetchOrder();
        }
        catch (err) {
            toast.error(err.message);
        }
        finally {
            setShipping(false);
        }
    };
    if (loading) {
        return (_jsxs("div", { className: "p-4 md:p-8 space-y-8 animate-in fade-in duration-500", children: [_jsx("div", { className: "flex flex-col md:flex-row md:items-center justify-between gap-4", children: _jsxs("div", { className: "space-y-2", children: [_jsxs("div", { className: "flex items-center gap-3", children: [_jsx(Skeleton, { className: "h-10 w-32" }), _jsx(Skeleton, { className: "h-6 w-24" })] }), _jsx(Skeleton, { className: "h-4 w-48" })] }) }), _jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-3 gap-8", children: [_jsx("div", { className: "lg:col-span-2 space-y-8", children: _jsxs(Card, { className: "p-6", children: [_jsx(Skeleton, { className: "h-8 w-40 mb-6" }), _jsx("div", { className: "space-y-4", children: [1, 2, 3].map((i) => (_jsxs("div", { className: "flex gap-4", children: [_jsx(Skeleton, { className: "h-16 w-16" }), _jsxs("div", { className: "flex-1 space-y-2", children: [_jsx(Skeleton, { className: "h-5 w-1/2" }), _jsx(Skeleton, { className: "h-4 w-1/4" })] })] }, i))) })] }) }), _jsx("div", { className: "space-y-8", children: _jsxs(Card, { className: "p-6", children: [_jsx(Skeleton, { className: "h-6 w-32 mb-4" }), _jsxs("div", { className: "space-y-4", children: [_jsx(Skeleton, { className: "h-4 w-full" }), _jsx(Skeleton, { className: "h-4 w-3/4" }), _jsx(Skeleton, { className: "h-4 w-5/6" })] })] }) })] })] }));
    }
    if (!order)
        return null;
    const formatCurrency = (amount) => {
        return new Intl.NumberFormat("en-NG", {
            style: "currency",
            currency: order.currency || "NGN",
            maximumFractionDigits: 0,
        }).format(amount);
    };
    return (_jsxs("div", { className: "max-w-6xl mx-auto p-6 space-y-8 pb-20", children: [order.riskLevel && order.riskLevel !== "LOW" && (_jsx("div", { className: cn("p-4 rounded-2xl border flex items-center justify-between animate-in fade-in slide-in-from-top-4 duration-500", order.riskLevel === "CRITICAL" ? "bg-red-50 border-red-100 text-red-800" :
                    order.riskLevel === "HIGH" ? "bg-orange-50 border-orange-100 text-orange-800" :
                        "bg-yellow-50 border-yellow-100 text-yellow-800"), children: _jsxs("div", { className: "flex items-center gap-3", children: [_jsx("div", { className: cn("p-2 rounded-xl", order.riskLevel === "CRITICAL" ? "bg-red-100" :
                                order.riskLevel === "HIGH" ? "bg-orange-100" : "bg-yellow-100"), children: _jsx(AlertTriangle, { className: "h-5 w-5" }) }), _jsxs("div", { children: [_jsxs("h3", { className: "font-bold flex items-center gap-2 uppercase tracking-wide text-xs", children: [order.riskLevel, " Fraud Risk Detected", order.isHeld && _jsx("span", { className: "bg-red-600 text-white text-[10px] px-2 py-0.5 rounded-full", children: "HELD" })] }), _jsxs("p", { className: "text-sm opacity-90 font-medium font-inter", children: ["Flagged for: ", order.riskReasons?.join(", ") || "Suspicious activity"] })] })] }) })), _jsxs("div", { className: "flex flex-col md:flex-row md:items-center justify-between gap-6", children: [_jsxs("div", { className: "flex items-start gap-4", children: [_jsx(Button, { variant: "outline", size: "icon", onClick: () => router.back(), "aria-label": "Go back", className: "w-10 h-10 bg-white rounded-xl flex items-center justify-center border border-gray-100 shadow-sm hover:bg-gray-50 transition-all active:scale-95", children: _jsx(ChevronLeft, { className: "h-5 w-5" }) }), _jsxs("div", { children: [_jsxs("div", { className: "flex items-center gap-3", children: [_jsxs("h1", { className: "text-3xl font-black text-black tracking-tight", children: ["Order #", order.orderNumber || order.id.slice(0, 8)] }), _jsx(StatusChip, { status: order.fulfillmentStatus })] }), _jsxs("p", { className: "text-gray-500 font-medium font-inter mt-1", children: ["Placed on ", new Date(order.createdAt).toLocaleDateString("en-US", {
                                                month: "long",
                                                day: "numeric",
                                                year: "numeric",
                                                hour: "2-digit",
                                                minute: "2-digit"
                                            })] })] })] }), _jsxs("div", { className: "flex items-center gap-3", children: [_jsxs(Button, { variant: "outline", className: "font-bold border-gray-200", children: [_jsx(Printer, { className: "h-4 w-4 mr-2" }), " Print Slip"] }), order.fulfillmentStatus !== 'FULFILLED' && order.status !== 'CANCELLED' && (_jsx(Button, { onClick: handleShip, disabled: shipping, className: "bg-vayva-green text-white hover:bg-vayva-green/90 font-bold shadow-xl shadow-green-500/20", children: shipping ? "Processing..." : _jsxs(_Fragment, { children: [_jsx(Truck, { className: "h-4 w-4 mr-2" }), " Mark Shipped"] }) }))] })] }), _jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-3 gap-8", children: [_jsx("div", { className: "lg:col-span-2 space-y-6", children: _jsxs("div", { className: "bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden", children: [_jsx("div", { className: "p-6 border-b border-gray-100 bg-gray-50/30", children: _jsxs("h2", { className: "font-bold text-gray-900 flex items-center gap-2 uppercase tracking-tighter text-xs", children: [_jsx(ShoppingBag, { className: "h-4 w-4 text-gray-400" }), " Items Summary"] }) }), _jsx("div", { className: "divide-y divide-gray-50", children: order.items.map((item) => (_jsxs("div", { className: "p-6 flex gap-4 hover:bg-gray-50/30 transition-colors", children: [_jsx("div", { className: "h-16 w-16 bg-gray-100 rounded-xl flex-shrink-0 overflow-hidden border border-gray-100", children: item.productVariant?.image && (_jsx("img", { src: item.productVariant.image, alt: "", className: "h-full w-full object-cover" })) }), _jsxs("div", { className: "flex-1 flex flex-col justify-center", children: [_jsx("h3", { className: "font-bold text-gray-900", children: item.productName }), _jsxs("p", { className: "text-xs font-bold text-gray-400 uppercase", children: ["Quantity: ", item.quantity] })] }), _jsxs("div", { className: "text-right flex flex-col justify-center", children: [_jsx("p", { className: "font-black text-gray-900 font-mono", children: formatCurrency(item.price * item.quantity) }), _jsxs("p", { className: "text-[10px] text-gray-400 font-bold", children: [formatCurrency(item.price), " / unit"] })] })] }, item.id))) }), _jsx("div", { className: "bg-gray-50/50 p-6 border-t border-gray-100", children: _jsxs("div", { className: "flex justify-between items-center bg-white p-4 rounded-xl border border-gray-100 shadow-sm", children: [_jsx("span", { className: "font-bold text-gray-500 uppercase text-xs tracking-wider", children: "Total Amount" }), _jsx("span", { className: "font-black text-2xl text-gray-900 font-mono", children: formatCurrency(order.total) })] }) })] }) }), _jsxs("div", { className: "space-y-6", children: [_jsxs("div", { className: "bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-6", children: [_jsx("h2", { className: "font-bold text-gray-900 uppercase tracking-tighter text-xs border-b border-gray-50 pb-3", children: "Payment & Fulfillment" }), _jsxs("div", { className: "space-y-4", children: [_jsxs("div", { className: "flex justify-between items-center group", children: [_jsx("span", { className: "text-sm font-bold text-gray-400 group-hover:text-gray-600 transition-colors", children: "Payment" }), _jsx(StatusChip, { status: order.paymentStatus })] }), _jsxs("div", { className: "flex justify-between items-center group", children: [_jsx("span", { className: "text-sm font-bold text-gray-400 group-hover:text-gray-600 transition-colors", children: "Fulfillment" }), _jsx(StatusChip, { status: order.fulfillmentStatus })] })] })] }), _jsx(PrepTimeCard, { orderId: order.id, currentPrepTime: order.metadata?.prepTimeMinutes, onUpdate: fetchOrder }), _jsxs("div", { className: "bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-4", children: [_jsxs("h2", { className: "font-bold text-gray-900 uppercase tracking-tighter text-xs flex items-center gap-2", children: [_jsx(User, { className: "h-4 w-4 text-gray-300" }), " Customer"] }), _jsxs("div", { className: "flex items-center gap-4 mb-4", children: [_jsx("div", { className: "w-12 h-12 rounded-xl bg-vayva-green text-white flex items-center justify-center font-black text-lg", children: order.customer?.firstName?.charAt(0) }), _jsxs("div", { children: [_jsxs("p", { className: "font-black text-gray-900 leading-tight", children: [order.customer?.firstName, " ", order.customer?.lastName] }), _jsx("p", { className: "text-xs font-bold text-gray-400", children: order.customer?.email })] })] }), _jsx("div", { className: "flex gap-2", children: _jsxs(Button, { className: "flex-1 rounded-xl bg-green-500 hover:bg-green-600 text-white font-bold h-11 shadow-lg shadow-green-500/20", children: [_jsx(MessageSquare, { className: "w-4 h-4 mr-2" }), " WhatsApp"] }) })] }), _jsxs("div", { className: "bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-4", children: [_jsxs("h2", { className: "font-bold text-gray-900 uppercase tracking-tighter text-xs flex items-center gap-2", children: [_jsx(MapPin, { className: "h-4 w-4 text-gray-300" }), " Delivery"] }), order.shippingAddress ? (_jsxs("div", { className: "text-sm font-medium text-gray-600 leading-relaxed bg-gray-50 p-4 rounded-xl border border-gray-100", children: [order.shippingAddress.street, _jsx("br", {}), order.shippingAddress.city, ", ", order.shippingAddress.state] })) : (_jsx("p", { className: "text-sm text-gray-400 italic", children: "No address provided" }))] })] })] })] }));
}
