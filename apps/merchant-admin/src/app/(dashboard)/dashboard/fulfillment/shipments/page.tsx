"use client";

import { useState, useEffect } from "react";
import { Button } from "@vayva/ui";
import { toast } from "sonner";
import { Truck, MapPin, ExternalLink, Loader2, Package } from "lucide-react";
import { formatDate } from "@/lib/format";
import Link from "next/link";

interface Shipment {
    id: string;
    orderId: string;
    orderNumber: string;
    status: string;
    provider: string;
    trackingCode: string | null;
    trackingUrl: string | null;
    courierName: string | null;
    recipientName: string | null;
    updatedAt: string;
}

export default function ShipmentsPage() {
    const [loading, setLoading] = useState(true);
    const [shipments, setShipments] = useState<Shipment[]>([]);
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
            if (!res.ok) throw new Error("Failed to load shipments");
            const result = await res.json() as { data: Shipment[] };
            setShipments(result.data || []);
        } catch (error: any) {
            console.error(error);
            toast.error((error as any).message || "Could not load shipments");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold tracking-tight text-slate-900">Shipments</h1>
                <p className="text-slate-500">Track and manage order deliveries.</p>
            </div>

            <div className="flex items-center gap-4 border-b border-slate-200">
                {["ALL", "IN_TRANSIT", "DELIVERED", "PICKED_UP"].map((tab: any) => (
                    <Button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`pb-3 px-1 text-sm font-medium border-b-2 transition-colors flex items-center gap-2 ${activeTab === tab
                            ? "border-indigo-600 text-indigo-600"
                            : "border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300"
                            }`}
                    >
                        {tab.replace("_", " ")}
                    </Button>
                ))}
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                {loading ? (
                    <div className="p-12 flex justify-center">
                        <Loader2 className="h-6 w-6 animate-spin text-slate-400" />
                    </div>
                ) : shipments.length === 0 ? (
                    <div className="p-16 text-center flex flex-col items-center">
                        <div className="h-12 w-12 bg-indigo-50 text-indigo-600 rounded-lg flex items-center justify-center mb-4">
                            <Truck className="h-6 w-6" />
                        </div>
                        <h3 className="text-lg font-medium text-slate-900 mb-1">No shipments found</h3>
                        <p className="text-slate-500 max-w-sm">
                            {activeTab === "ALL"
                                ? "Once you fulfill orders, their shipment status will appear here."
                                : `No shipments currently matching '${activeTab.replace("_", " ")}'.`}
                        </p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left">
                            <thead className="bg-slate-50 text-slate-600 font-medium border-b border-slate-100">
                                <tr>
                                    <th className="px-6 py-3">Tracking / Order</th>
                                    <th className="px-6 py-3">Recipient</th>
                                    <th className="px-6 py-3">Carrier</th>
                                    <th className="px-6 py-3">Status</th>
                                    <th className="px-6 py-3">Last Update</th>
                                    <th className="px-6 py-3 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {shipments.map((shipment: any) => (
                                    <tr key={shipment.id} className="hover:bg-slate-50/50 group">
                                        <td className="px-6 py-4">
                                            <div className="font-medium text-slate-900">{shipment.trackingCode || "Pending"}</div>
                                            <Link href={`/dashboard/orders/${shipment.orderId}`} className="text-xs text-indigo-600 hover:text-indigo-800 hover:underline">
                                                Order #{shipment.orderNumber}
                                            </Link>
                                        </td>
                                        <td className="px-6 py-4 text-slate-600">
                                            <div className="flex items-center gap-2">
                                                <MapPin className="h-3 w-3 text-slate-400" />
                                                {shipment.recipientName || "Unknown"}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-slate-600">
                                            {shipment.courierName || shipment.provider}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${shipment.status === 'DELIVERED' ? 'bg-emerald-100 text-emerald-700' :
                                                shipment.status === 'IN_TRANSIT' ? 'bg-blue-100 text-blue-700' :
                                                    shipment.status === 'FAILED' ? 'bg-red-100 text-red-700' :
                                                        'bg-slate-100 text-slate-600'
                                                }`}>
                                                {shipment.status.replace("_", " ")}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-slate-500 text-xs">
                                            {formatDate(shipment.updatedAt)}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            {shipment.trackingUrl && (
                                                <a
                                                    href={shipment.trackingUrl}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="inline-flex items-center gap-1 text-slate-500 hover:text-indigo-600 transition-colors"
                                                    title="Track Shipment"
                                                >
                                                    <ExternalLink className="h-4 w-4" />
                                                </a>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}
