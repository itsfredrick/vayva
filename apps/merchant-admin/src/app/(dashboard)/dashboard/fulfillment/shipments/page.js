"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from "react";
import { Button } from "@vayva/ui";
import { toast } from "sonner";
import { Truck, MapPin, ExternalLink, Loader2 } from "lucide-react";
import { formatDate } from "@/lib/format";
import Link from "next/link";
export default function ShipmentsPage() {
    const [loading, setLoading] = useState(true);
    const [shipments, setShipments] = useState([]);
    const [activeTab, setActiveTab] = useState("ALL");
    useEffect(() => {
        fetchShipments();
    }, [activeTab]);
    const fetchShipments = async () => {
        setLoading(true);
        try {
            // For MVP, we fetch all and filter client side or basic server filter
            // The API supports status filter, but let's just fetch all for now or param
            const url = activeTab === "ALL" ? "/api/fulfillment/shipments" : `/api/fulfillment/shipments?status=${activeTab}`;
            const res = await fetch(url);
            if (!res.ok)
                throw new Error("Failed to load shipments");
            const result = await res.json();
            setShipments(result.data || []);
        }
        catch (error) {
            console.error(error);
            toast.error("Could not load shipments");
        }
        finally {
            setLoading(false);
        }
    };
    return (_jsxs("div", { className: "space-y-6", children: [_jsxs("div", { children: [_jsx("h1", { className: "text-2xl font-bold tracking-tight text-slate-900", children: "Shipments" }), _jsx("p", { className: "text-slate-500", children: "Track and manage order deliveries." })] }), _jsx("div", { className: "flex items-center gap-4 border-b border-slate-200", children: ["ALL", "IN_TRANSIT", "DELIVERED", "PICKED_UP"].map((tab) => (_jsx(Button, { onClick: () => setActiveTab(tab), className: `pb-3 px-1 text-sm font-medium border-b-2 transition-colors flex items-center gap-2 ${activeTab === tab
                        ? "border-indigo-600 text-indigo-600"
                        : "border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300"}`, children: tab.replace("_", " ") }, tab))) }), _jsx("div", { className: "bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden", children: loading ? (_jsx("div", { className: "p-12 flex justify-center", children: _jsx(Loader2, { className: "h-6 w-6 animate-spin text-slate-400" }) })) : shipments.length === 0 ? (_jsxs("div", { className: "p-16 text-center flex flex-col items-center", children: [_jsx("div", { className: "h-12 w-12 bg-indigo-50 text-indigo-600 rounded-lg flex items-center justify-center mb-4", children: _jsx(Truck, { className: "h-6 w-6" }) }), _jsx("h3", { className: "text-lg font-medium text-slate-900 mb-1", children: "No shipments found" }), _jsx("p", { className: "text-slate-500 max-w-sm", children: activeTab === "ALL"
                                ? "Once you fulfill orders, their shipment status will appear here."
                                : `No shipments currently matching '${activeTab.replace("_", " ")}'.` })] })) : (_jsx("div", { className: "overflow-x-auto", children: _jsxs("table", { className: "w-full text-sm text-left", children: [_jsx("thead", { className: "bg-slate-50 text-slate-600 font-medium border-b border-slate-100", children: _jsxs("tr", { children: [_jsx("th", { className: "px-6 py-3", children: "Tracking / Order" }), _jsx("th", { className: "px-6 py-3", children: "Recipient" }), _jsx("th", { className: "px-6 py-3", children: "Carrier" }), _jsx("th", { className: "px-6 py-3", children: "Status" }), _jsx("th", { className: "px-6 py-3", children: "Last Update" }), _jsx("th", { className: "px-6 py-3 text-right", children: "Actions" })] }) }), _jsx("tbody", { className: "divide-y divide-slate-100", children: shipments.map((shipment) => (_jsxs("tr", { className: "hover:bg-slate-50/50 group", children: [_jsxs("td", { className: "px-6 py-4", children: [_jsx("div", { className: "font-medium text-slate-900", children: shipment.trackingCode || "Pending" }), _jsxs(Link, { href: `/dashboard/orders/${shipment.orderId}`, className: "text-xs text-indigo-600 hover:text-indigo-800 hover:underline", children: ["Order #", shipment.orderNumber] })] }), _jsx("td", { className: "px-6 py-4 text-slate-600", children: _jsxs("div", { className: "flex items-center gap-2", children: [_jsx(MapPin, { className: "h-3 w-3 text-slate-400" }), shipment.recipientName || "Unknown"] }) }), _jsx("td", { className: "px-6 py-4 text-slate-600", children: shipment.courierName || shipment.provider }), _jsx("td", { className: "px-6 py-4", children: _jsx("span", { className: `inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${shipment.status === 'DELIVERED' ? 'bg-emerald-100 text-emerald-700' :
                                                    shipment.status === 'IN_TRANSIT' ? 'bg-blue-100 text-blue-700' :
                                                        shipment.status === 'FAILED' ? 'bg-red-100 text-red-700' :
                                                            'bg-slate-100 text-slate-600'}`, children: shipment.status.replace("_", " ") }) }), _jsx("td", { className: "px-6 py-4 text-slate-500 text-xs", children: formatDate(shipment.updatedAt) }), _jsx("td", { className: "px-6 py-4 text-right", children: shipment.trackingUrl && (_jsx("a", { href: shipment.trackingUrl, target: "_blank", rel: "noopener noreferrer", className: "inline-flex items-center gap-1 text-slate-500 hover:text-indigo-600 transition-colors", title: "Track Shipment", children: _jsx(ExternalLink, { className: "h-4 w-4" }) })) })] }, shipment.id))) })] }) })) })] }));
}
