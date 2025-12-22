'use client';

import React from 'react';
import { AdminShell } from '@/components/admin-shell';
import { Icon, Button } from '@vayva/ui';

const RETURNS = [
    { id: 'RMA-001', customer: 'Alice Doe', order: '#ORDER-1024', amount: '₦15,000', status: 'REQUESTED', date: '2 mins ago' },
    { id: 'RMA-002', customer: 'Bob Smith', order: '#ORDER-0998', amount: '₦5,200', status: 'APPROVED', date: '1 hour ago' },
];

export default function ReturnsPage() {
    return (
        <AdminShell title="Returns" breadcrumb="Finance">
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-[#0B0B0B]">Returns & RMA</h1>
                        <p className="text-sm text-gray-500">Manage customer return requests and logistics.</p>
                    </div>
                    {/* Actions */}
                </div>

                {/* Returns Table */}
                <div className="bg-white border border-gray-100 rounded-xl overflow-hidden shadow-sm">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-gray-50/50 text-gray-500 font-medium border-b border-gray-100">
                            <tr>
                                <th className="px-6 py-4">RMA ID</th>
                                <th className="px-6 py-4">Customer</th>
                                <th className="px-6 py-4">Order</th>
                                <th className="px-6 py-4">Amount</th>
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {RETURNS.map((rma) => (
                                <tr key={rma.id} className="hover:bg-gray-50/50 transition-colors">
                                    <td className="px-6 py-4 font-medium text-[#0B0B0B]">{rma.id}</td>
                                    <td className="px-6 py-4">{rma.customer}</td>
                                    <td className="px-6 py-4 text-gray-500">{rma.order}</td>
                                    <td className="px-6 py-4 font-medium">{rma.amount}</td>
                                    <td className="px-6 py-4">
                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${rma.status === 'REQUESTED' ? 'bg-orange-50 text-orange-600' :
                                            rma.status === 'APPROVED' ? 'bg-blue-50 text-blue-600' :
                                                'bg-gray-100 text-gray-600'
                                            }`}>
                                            {rma.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                            <Icon name={"MoreHorizontal" as any} size={16} />
                                        </Button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {RETURNS.length === 0 && (
                        <div className="p-12 text-center text-gray-400">
                            <Icon name="Inbox" size={48} className="mx-auto mb-4 opacity-50" />
                            <p>No active return requests.</p>
                        </div>
                    )}
                </div>
            </div>
        </AdminShell>
    );
}
