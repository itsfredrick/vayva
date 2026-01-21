"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@vayva/ui";
import { ArrowLeft, Truck, MapPin, Navigation, ExternalLink } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
export default function DeliveryDetailPage() {
    const { id } = useParams();
    const { toast } = useToast();
    const router = useRouter();
    const [shipment, setShipment] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    useEffect(() => {
        fetchShipment();
    }, [id]);
    const fetchShipment = async () => {
        try {
            const res = await fetch(`/api/ops/deliveries/${id}`);
            if (res.status === 401) {
                window.location.href = "/ops/login";
                return;
            }
            if (!res.ok)
                throw new Error("Failed to load shipment");
            const json = await res.json();
            setShipment(json.data);
        }
        catch (err) {
            setError(err.message);
        }
        finally {
            setLoading(false);
        }
    };
    if (loading) {
        return (_jsx("div", { className: "flex h-screen items-center justify-center", children: _jsx("div", { className: "animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-600" }) }));
    }
    if (error || !shipment) {
        return (_jsxs("div", { className: "p-8", children: [_jsxs("div", { className: "bg-red-50 text-red-700 p-4 rounded-lg", children: ["Error: ", error || "Shipment not found"] }), _jsx(Button, { onClick: () => router.back(), variant: "link", className: "mt-4 text-indigo-600 hover:underline p-0 h-auto", children: "Go Back" })] }));
    }
    return (_jsxs("div", { className: "p-8 space-y-6 max-w-4xl mx-auto", children: [_jsxs("div", { className: "flex items-center gap-4", children: [_jsx(Button, { onClick: () => router.back(), variant: "ghost", size: "icon", "aria-label": "Go back", className: "h-10 w-10 hover:bg-gray-100 rounded-lg transition-colors p-2", children: _jsx(ArrowLeft, { size: 20, className: "text-gray-600" }) }), _jsxs("div", { children: [_jsxs("h1", { className: "text-2xl font-bold text-gray-900 flex items-center gap-2", children: ["Tracking ", shipment.trackingCode || "N/A"] }), _jsxs("p", { className: "text-sm text-gray-500 mt-1", children: ["For Order ", _jsxs(Link, { href: `/ops/orders/${shipment.orderId}`, className: "text-indigo-600 hover:underline", children: ["#", shipment.Order?.orderNumber] })] })] }), _jsx("div", { className: "ml-auto", children: _jsx("span", { className: `px-3 py-1 rounded-full text-sm font-medium border ${shipment.status === 'DELIVERED' ? 'bg-green-50 text-green-700 border-green-200' :
                                shipment.status === 'FAILED' ? 'bg-red-50 text-red-700 border-red-200' :
                                    'bg-blue-50 text-blue-700 border-blue-200'}`, children: shipment.status }) })] }), _jsxs("div", { className: "bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden", children: [_jsxs("div", { className: "p-6 grid grid-cols-1 md:grid-cols-2 gap-8", children: [_jsxs("div", { children: [_jsxs("h3", { className: "text-sm font-semibold text-gray-500 uppercase mb-3 flex items-center gap-2", children: [_jsx(MapPin, { size: 16 }), " Destination"] }), _jsxs("div", { className: "bg-gray-50 p-4 rounded-lg space-y-2", children: [_jsx("p", { className: "font-medium text-gray-900", children: shipment.recipientName }), _jsx("p", { className: "text-gray-600", children: shipment.addressLine1 }), _jsx("p", { className: "text-gray-600", children: shipment.addressCity }), _jsx("p", { className: "text-gray-500 text-sm mt-2", children: shipment.recipientPhone })] })] }), _jsxs("div", { children: [_jsxs("h3", { className: "text-sm font-semibold text-gray-500 uppercase mb-3 flex items-center gap-2", children: [_jsx(Truck, { size: 16 }), " Logistics Provider"] }), _jsxs("div", { className: "space-y-4", children: [_jsxs("div", { className: "flex justify-between items-center py-2 border-b border-gray-100", children: [_jsx("span", { className: "text-gray-600", children: "Carrier" }), _jsx("span", { className: "font-medium", children: shipment.DispatchJob?.[0]?.carrier || shipment.provider || "Unknown" })] }), _jsxs("div", { className: "flex justify-between items-center py-2 border-b border-gray-100", children: [_jsx("span", { className: "text-gray-600", children: "Reference ID" }), _jsx("span", { className: "font-mono text-xs bg-gray-100 px-2 py-1 rounded", children: shipment.DispatchJob?.[0]?.providerJobId || shipment.externalId || "—" })] }), shipment.trackingUrl && (_jsxs("a", { href: shipment.trackingUrl, target: "_blank", rel: "noopener noreferrer", className: "flex items-center justify-center gap-2 w-full px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50", children: [_jsx(ExternalLink, { size: 16 }), " Track on Provider Site"] }))] })] })] }), _jsxs("div", { className: "border-t border-gray-200 bg-gray-50 px-6 py-4", children: [_jsxs("h3", { className: "font-semibold text-gray-900 mb-4 flex items-center gap-2", children: [_jsx(Navigation, { size: 18 }), " Dispatch History"] }), _jsxs("div", { className: "space-y-4", children: [shipment.DispatchJob?.map((job) => (_jsxs("div", { className: "bg-white p-4 rounded-lg border border-gray-200 shadow-sm", children: [_jsxs("div", { className: "flex justify-between mb-2", children: [_jsx("span", { className: "font-medium text-gray-800", children: job.carrier }), _jsx("span", { className: "text-xs text-gray-500", children: new Date(job.createdAt).toLocaleString() })] }), _jsxs("div", { className: "flex justify-between text-sm", children: [_jsxs("span", { className: "text-gray-500", children: ["Vehicle: ", job.vehicleType] }), _jsx("span", { className: "px-2 py-0.5 rounded text-xs bg-gray-100 text-gray-700", children: job.status })] })] }, job.id))), (!shipment.DispatchJob || shipment.DispatchJob.length === 0) && (_jsx("p", { className: "text-sm text-gray-500 italic", children: "No dispatch jobs recorded." }))] })] })] }), _jsxs("div", { className: "flex justify-end gap-3", children: [_jsx(Link, { href: `/ops/merchants/${shipment.storeId}?tab=deliveries`, className: "px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50", children: "View Merchant Deliveries" }), _jsx(Button, { onClick: async () => {
                            try {
                                const res = await fetch(`/api/ops/deliveries/${id}/retry`, { method: "POST" });
                                if (res.ok) {
                                    // toast would be nice here, but using alert since it's an internal tool if toaster is not available locally
                                    toast({ title: "Success", description: "Dispatch retry initiated successfully." });
                                    window.location.reload();
                                }
                            }
                            catch (e) {
                                toast({ title: "Error", description: "Failed to retry dispatch.", variant: "destructive" });
                            }
                        }, className: "px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700", children: "Retry Delivery" })] })] }));
}
