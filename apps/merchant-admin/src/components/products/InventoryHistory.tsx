
"use client";

import React, { useEffect, useState } from "react";
import { format } from "date-fns";
import { Badge, Button, Card, Icon } from "@vayva/ui";

interface InventoryMovement {
    id: string;
    type: string; // "adjustment", "order", "return"
    quantity: number;
    reason: string | null;
    createdAt: string;
    variantName: string;
    performedBy: string | null;
}

export const InventoryHistory = ({ productId }: { productId: string }) => {
    const [movements, setMovements] = useState<InventoryMovement[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchHistory();
    }, [productId]);

    const fetchHistory = async () => {
        try {
            const res = await fetch(`/api/products/${productId}/inventory/history`);
            if (res.ok) {
                setMovements(await res.json());
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div className="text-center p-4 text-gray-500">Loading history...</div>;

    return (
        <Card className="p-0 overflow-hidden">
            <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                <h3 className="font-bold text-sm uppercase tracking-wider text-gray-700">Stock History</h3>
                <Button variant="ghost" size="sm" onClick={fetchHistory}><Icon name="RefreshCcw" size={14} /></Button>
            </div>

            {movements.length === 0 ? (
                <div className="p-8 text-center text-gray-400 text-sm">No stock movements recorded.</div>
            ) : (
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-gray-50 text-gray-500 font-medium border-b border-gray-100">
                            <tr>
                                <th className="p-3 pl-4">Date</th>
                                <th className="p-3">Variant</th>
                                <th className="p-3">Type</th>
                                <th className="p-3 text-right">Change</th>
                                <th className="p-3">Reason</th>
                                <th className="p-3">User</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {movements.map((move) => (
                                <tr key={move.id} className="hover:bg-gray-50/50">
                                    <td className="p-3 pl-4 text-gray-600">
                                        {format(new Date(move.createdAt), "MMM d, HH:mm")}
                                    </td>
                                    <td className="p-3 font-medium text-gray-900">{move.variantName}</td>
                                    <td className="p-3">
                                        <Badge variant={move.quantity > 0 ? "success" : "default"}>
                                            {move.type}
                                        </Badge>
                                    </td>
                                    <td className={`p-3 text-right font-mono ${move.quantity > 0 ? 'text-green-600' : 'text-red-600'}`}>
                                        {move.quantity > 0 ? "+" : ""}{move.quantity}
                                    </td>
                                    <td className="p-3 text-gray-500 max-w-[200px] truncate">{move.reason || "-"}</td>
                                    <td className="p-3 text-gray-500 text-xs">{move.performedBy || "System"}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </Card>
    );
};
