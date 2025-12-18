'use client';

import React, { useEffect, useState } from 'react';
import { OpsShell } from '../../../components/OpsShell';
import { OpsService, RefundRequest } from '../../../services/OpsService';
import { Check, X } from 'lucide-react';

export default function RefundsPage() {
    const [refunds, setRefunds] = useState<RefundRequest[]>([]);

    useEffect(() => {
        OpsService.getRefunds().then(setRefunds);
    }, []);

    return (
        <OpsShell>
            <h1 className="text-2xl font-bold mb-6">Refund Approvals</h1>

            <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-gray-50 border-b border-gray-100 text-xs uppercase text-gray-500 font-semibold">
                        <tr>
                            <th className="px-6 py-4">Refund ID</th>
                            <th className="px-6 py-4">Merchant</th>
                            <th className="px-6 py-4">Amount</th>
                            <th className="px-6 py-4">Reason</th>
                            <th className="px-6 py-4">Status</th>
                            <th className="px-6 py-4 text-right">Action</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {refunds.map(r => (
                            <tr key={r.id}>
                                <td className="px-6 py-4 font-mono text-xs">{r.id}</td>
                                <td className="px-6 py-4 font-medium">{r.merchantName}</td>
                                <td className="px-6 py-4">₦{r.amount.toLocaleString()}</td>
                                <td className="px-6 py-4 text-gray-500">{r.reason}</td>
                                <td className="px-6 py-4">
                                    <span className="inline-block px-2 py-1 rounded-full text-xs font-bold bg-yellow-100 text-yellow-700 capitalize">
                                        {r.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-right flex justify-end gap-2">
                                    <button className="p-1 text-green-600 hover:bg-green-50 rounded">
                                        <Check size={18} />
                                    </button>
                                    <button className="p-1 text-red-600 hover:bg-red-50 rounded">
                                        <X size={18} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                        {refunds.length === 0 && (
                            <tr>
                                <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                                    No pending refunds.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </OpsShell>
    );
}
