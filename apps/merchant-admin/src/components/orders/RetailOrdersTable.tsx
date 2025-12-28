
import React, { useState, useEffect } from 'react';
import { UnifiedOrder } from '@vayva/shared';
import { Icon, cn } from '@vayva/ui';

interface RetailOrdersTableProps {
    orders: UnifiedOrder[];
    selectedIds: string[];
    onToggleSelect: (id: string) => void;
    onToggleAll: (ids: string[]) => void;
    onSelectOrder: (order: UnifiedOrder) => void;
}

export const RetailOrdersTable = ({ orders, selectedIds, onToggleSelect, onToggleAll, onSelectOrder }: RetailOrdersTableProps) => {
    const allSelected = orders.length > 0 && orders.every(o => selectedIds.includes(o.id));
    const someSelected = selectedIds.length > 0 && !allSelected;

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN', maximumFractionDigits: 0 }).format(amount);
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'NEW': return "bg-blue-50 text-blue-700";
            case 'PROCESSING': return "bg-orange-50 text-orange-700";
            case 'COMPLETED': return "bg-green-50 text-green-700";
            default: return "bg-gray-50 text-gray-600";
        }
    };

    if (orders.length === 0) {
        return (
            <div className="text-center py-20 bg-gray-50 rounded-3xl border border-dashed border-gray-200 flex flex-col items-center">
                <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-3 text-gray-400">
                    <Icon name="Search" size={20} />
                </div>
                <h3 className="font-bold text-gray-900">No matching orders</h3>
                <p className="text-gray-500 text-sm">Try adjusting your filters or search query.</p>
            </div>
        );
    }

    return (
        <div className="bg-white border boundary-gray-200 rounded-xl overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-gray-50/50 border-b border-gray-100 text-xs uppercase text-gray-500 font-bold tracking-wider">
                            <th className="p-4 w-12">
                                <input
                                    type="checkbox"
                                    className="rounded border-gray-300 text-black focus:ring-black"
                                    checked={allSelected}
                                    ref={input => { if (input) input.indeterminate = someSelected; }}
                                    onChange={() => onToggleAll(orders.map(o => o.id))}
                                />
                            </th>
                            <th className="p-4">Order</th>
                            <th className="p-4">Date</th>
                            <th className="p-4">Customer</th>
                            <th className="p-4">Status</th>
                            <th className="p-4 text-right">Total</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                        {orders.map(order => {
                            const isSelected = selectedIds.includes(order.id);
                            return (
                                <tr
                                    key={order.id}
                                    className={cn(
                                        "group transition-colors hover:bg-gray-50 cursor-pointer",
                                        isSelected && "bg-blue-50/30 hover:bg-blue-50/50"
                                    )}
                                    onClick={(e) => {
                                        // Don't trigger if checkbox clicked
                                        if ((e.target as HTMLElement).tagName !== 'INPUT') {
                                            onSelectOrder(order);
                                        }
                                    }}
                                >
                                    <td className="p-4 relative">
                                        <input
                                            type="checkbox"
                                            className="rounded border-gray-300 text-black focus:ring-black"
                                            checked={isSelected}
                                            onChange={() => onToggleSelect(order.id)}
                                            onClick={(e) => e.stopPropagation()}
                                        />
                                    </td>
                                    <td className="p-4">
                                        <div className="font-bold text-gray-900">#{(order as any).orderNumber || order.id.slice(-6)}</div>
                                        <div className="text-xs text-gray-400 font-mono">{(order as any).refCode || order.id}</div>
                                    </td>
                                    <td className="p-4 text-sm text-gray-600">
                                        {new Date(order.timestamps?.createdAt || Date.now()).toLocaleDateString()}
                                        <div className="text-xs text-gray-400">
                                            {new Date(order.timestamps?.createdAt || Date.now()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </div>
                                    </td>
                                    <td className="p-4">
                                        <div className="font-medium text-gray-900">{order.customer?.name || 'Guest'}</div>
                                        {/* <div className="text-xs text-gray-400">{order.customer?.email}</div> */}
                                    </td>
                                    <td className="p-4">
                                        <span className={cn("px-2.5 py-1 rounded-full text-xs font-bold capitalize", getStatusColor(order.status))}>
                                            {order.status.toLowerCase().replace('_', ' ')}
                                        </span>
                                    </td>
                                    <td className="p-4 text-right font-mono font-medium text-gray-900">
                                        {formatCurrency(order.totalAmount)}
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
};
