"use client";

import { Button, Card, StatusChip } from "@vayva/ui";
import { formatDistanceToNow } from "date-fns";
import { CheckCircle, Clock, Loader2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface OrderItem {
    id: string;
    title: string;
    quantity: number;
    // Notes/Metadata are not in current OrderItem schema, but we keep the optional field for future use if extended
    notes?: string;
}

interface Order {
    id: string;
    orderNumber: string;
    items: OrderItem[];
    createdAt: string; // Serialized date
    fulfillmentStatus: string;
    customerNote?: string;
}

interface KitchenTicketProps {
    order: Order;
    onStatusChange: () => void;
}

export function KitchenTicket({ order, onStatusChange }: KitchenTicketProps) {
    const [isLoading, setIsLoading] = useState(false);

    const updateStatus = async (status: string) => {
        setIsLoading(true);
        try {
            const res = await fetch(`/api/kitchen/orders/${order.id}/status`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ status })
            });
            if (!res.ok) throw new Error("Failed to update status");
            toast.success(`Order marked as ${status}`);
            onStatusChange();
        } catch (e) {
            toast.error("Error updating order");
        } finally {
            setIsLoading(false);
        }
    };

    const isPreparing = order.fulfillmentStatus === "PREPARING";

    return (
        <Card className={`flex flex-col h-full overflow-hidden border-2 ${isPreparing ? "border-amber-400 bg-amber-50/10" : "border-gray-200"}`}>
            {/* Header */}
            <div className="p-4 border-b bg-gray-50 flex justify-between items-start">
                <div>
                    <h3 className="text-xl font-bold text-gray-900">#{order.orderNumber}</h3>
                    <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                        <Clock size={12} />
                        {formatDistanceToNow(new Date(order.createdAt))} ago
                    </p>
                </div>
                <StatusChip status={order.fulfillmentStatus} />
            </div>

            {/* Items */}
            <div className="p-4 flex-1 space-y-3">
                {order.items.map((item) => (
                    <div key={item.id} className="flex justify-between items-start">
                        <div className="flex gap-2">
                            <span className="font-bold text-gray-900 w-6">{item.quantity}x</span>
                            <div>
                                <p className="font-medium text-gray-900">{item.title}</p>
                                {item.notes && (
                                    <p className="text-xs text-amber-600 italic mt-0.5">Note: {item.notes}</p>
                                )}
                            </div>
                        </div>
                    </div>
                ))}

                {order.customerNote && (
                    <div className="mt-4 p-2 bg-yellow-50 border border-yellow-100 rounded text-xs text-yellow-800">
                        <span className="font-bold">Customer Note:</span> {order.customerNote}
                    </div>
                )}
            </div>

            {/* Actions */}
            <div className="p-4 border-t bg-gray-50/50">
                {order.fulfillmentStatus === "UNFULFILLED" ? (
                    <Button
                        onClick={() => updateStatus("PREPARING")}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                        disabled={isLoading}
                    >
                        {isLoading ? <Loader2 className="animate-spin" /> : "Start Preparing"}
                    </Button>
                ) : order.fulfillmentStatus === "PREPARING" ? (
                    <Button
                        onClick={() => updateStatus("READY_FOR_PICKUP")}
                        className="w-full bg-green-600 hover:bg-green-700 text-white gap-2"
                        disabled={isLoading}
                    >
                        {isLoading ? <Loader2 className="animate-spin" /> : <><CheckCircle size={18} /> Mark Ready</>}
                    </Button>
                ) : (
                    <Button variant="outline" className="w-full" disabled>
                        Completed
                    </Button>
                )}
            </div>
        </Card>
    );
}
