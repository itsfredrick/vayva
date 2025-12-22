'use client';

import React from 'react';
import { AdminShell } from '@/components/admin-shell';
import { Icon } from '@vayva/ui';
import { formatNGN } from '@/config/pricing';

const DISPUTES = [
    { id: 'dp_123', provider: 'Stripe', amount: formatNGN(25000), reason: 'Product not received', status: 'EVIDENCE_REQUIRED', due: 'Tomorrow' },
];

export default function DisputesPage() {
    return (
        <AdminShell title="Disputes" breadcrumb="Finance">
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-[#0B0B0B]">Disputes & Chargebacks</h1>
                        <p className="text-sm text-gray-500">Manage and respond to payment disputes.</p>
                    </div>
                </div>

                <div className="bg-white border border-gray-100 rounded-xl overflow-hidden shadow-sm">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-gray-50/50 text-gray-500 font-medium border-b border-gray-100">
                            <tr>
                                <th className="px-6 py-4">Dispute ID</th>
                                <th className="px-6 py-4">Provider</th>
                                <th className="px-6 py-4">Amount</th>
                                <th className="px-6 py-4">Reason</th>
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4">Response Due</th>
                                <th className="px-6 py-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {DISPUTES.map((d) => (
                                <tr key={d.id} className="hover:bg-gray-50/50 transition-colors">
                                    <td className="px-6 py-4 font-medium text-[#0B0B0B]">{d.id}</td>
                                    <td className="px-6 py-4 flex items-center gap-2">
                                        <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                                        {d.provider}
                                    </td>
                                    <td className="px-6 py-4 font-medium">{d.amount}</td>
                                    <td className="px-6 py-4 text-gray-500">{d.reason}</td>
                                    <td className="px-6 py-4">
                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${d.status === 'EVIDENCE_REQUIRED' ? 'bg-red-50 text-red-600' :
                                            'bg-gray-100 text-gray-600'
                                            }`}>
                                            {d.status.replace('_', ' ')}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-red-600 font-medium">{d.due}</td>
                                    <td className="px-6 py-4 text-right">
                                        <button className="text-[#0B0B0B] hover:text-blue-600 font-medium text-xs border border-gray-200 px-3 py-1 rounded-lg hover:border-blue-600 transition-colors">
                                            Evidence
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {DISPUTES.length === 0 && (
                        <div className="p-12 text-center text-gray-400">
                            <Icon name={"CheckCircle" as any} size={48} className="mx-auto mb-4 opacity-50 text-green-500" />
                            <p>No open disputes. Great job!</p>
                        </div>
                    )}
                </div>
            </div>
        </AdminShell>
    );
}
