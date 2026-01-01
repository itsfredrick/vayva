"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@vayva/ui";
import {
    ArrowLeft,
    Truck,
    MapPin,
    Package,
    Navigation,
    ExternalLink
} from "lucide-react";

export default function DeliveryDetailPage() {
    const { id } = useParams() as { id: string };
    const router = useRouter();
    const [shipment, setShipment] = useState<any>(null);
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
            if (!res.ok) throw new Error("Failed to load shipment");
            const json = await res.json();
            setShipment(json.data);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex h-screen items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-600"></div>
            </div>
        );
    }

    if (error || !shipment) {
        return (
            <div className="p-8">
                <div className="bg-red-50 text-red-700 p-4 rounded-lg">
                    Error: {error || "Shipment not found"}
                </div>
                <button onClick={() => router.back()} className="mt-4 text-indigo-600 hover:underline">
                    Go Back
                </button>
            </div>
        );
    }

    return (
        <div className="p-8 space-y-6 max-w-4xl mx-auto">
            {/* Header */}
            <div className="flex items-center gap-4">
                <button
                    onClick={() => router.back()}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                    <ArrowLeft size={20} className="text-gray-600" />
                </button>
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                        Tracking {shipment.trackingCode || "N/A"}
                    </h1>
                    <p className="text-sm text-gray-500 mt-1">
                        For Order <Link href={`/ops/orders/${shipment.orderId}`} className="text-indigo-600 hover:underline">#{shipment.Order?.orderNumber}</Link>
                    </p>
                </div>
                <div className="ml-auto">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium border ${shipment.status === 'DELIVERED' ? 'bg-green-50 text-green-700 border-green-200' :
                        shipment.status === 'FAILED' ? 'bg-red-50 text-red-700 border-red-200' :
                            'bg-blue-50 text-blue-700 border-blue-200'
                        }`}>
                        {shipment.status}
                    </span>
                </div>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Destination */}
                    <div>
                        <h3 className="text-sm font-semibold text-gray-500 uppercase mb-3 flex items-center gap-2">
                            <MapPin size={16} /> Destination
                        </h3>
                        <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                            <p className="font-medium text-gray-900">{shipment.recipientName}</p>
                            <p className="text-gray-600">{shipment.addressLine1}</p>
                            <p className="text-gray-600">{shipment.addressCity}</p>
                            <p className="text-gray-500 text-sm mt-2">{shipment.recipientPhone}</p>
                        </div>
                    </div>

                    {/* Provider Info */}
                    <div>
                        <h3 className="text-sm font-semibold text-gray-500 uppercase mb-3 flex items-center gap-2">
                            <Truck size={16} /> Logistics Provider
                        </h3>
                        <div className="space-y-4">
                            <div className="flex justify-between items-center py-2 border-b border-gray-100">
                                <span className="text-gray-600">Carrier</span>
                                <span className="font-medium">{shipment.DispatchJob?.[0]?.carrier || shipment.provider || "Unknown"}</span>
                            </div>
                            <div className="flex justify-between items-center py-2 border-b border-gray-100">
                                <span className="text-gray-600">Reference ID</span>
                                <span className="font-mono text-xs bg-gray-100 px-2 py-1 rounded">
                                    {shipment.DispatchJob?.[0]?.providerJobId || shipment.externalId || "—"}
                                </span>
                            </div>
                            {shipment.trackingUrl && (
                                <a
                                    href={shipment.trackingUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center justify-center gap-2 w-full px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50"
                                >
                                    <ExternalLink size={16} /> Track on Provider Site
                                </a>
                            )}
                        </div>
                    </div>
                </div>

                {/* Dispatch History */}
                <div className="border-t border-gray-200 bg-gray-50 px-6 py-4">
                    <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                        <Navigation size={18} /> Dispatch History
                    </h3>
                    <div className="space-y-4">
                        {shipment.DispatchJob?.map((job: any) => (
                            <div key={job.id} className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
                                <div className="flex justify-between mb-2">
                                    <span className="font-medium text-gray-800">{job.carrier}</span>
                                    <span className="text-xs text-gray-500">{new Date(job.createdAt).toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-500">Vehicle: {job.vehicleType}</span>
                                    <span className="px-2 py-0.5 rounded text-xs bg-gray-100 text-gray-700">{job.status}</span>
                                </div>
                            </div>
                        ))}
                        {(!shipment.DispatchJob || shipment.DispatchJob.length === 0) && (
                            <p className="text-sm text-gray-500 italic">No dispatch jobs recorded.</p>
                        )}
                    </div>
                </div>
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-3">
                <Link
                    href={`/ops/merchants/${shipment.storeId}?tab=deliveries`}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                    View Merchant Deliveries
                </Link>
                <Button
                    onClick={async () => {
                        try {
                            const res = await fetch(`/api/ops/deliveries/${id}/retry`, { method: "POST" });
                            if (res.ok) {
                                // toast would be nice here, but using alert since it's an internal tool if toaster is not available locally
                                alert("Dispatch retry initiated successfully");
                                window.location.reload();
                            } else {
                                throw new Error("Retry failed");
                            }
                        } catch (e) {
                            alert("Failed to retry dispatch");
                        }
                    }}
                    className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700"
                >
                    Retry Delivery
                </Button>
            </div>
        </div>
    );
}
