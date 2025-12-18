'use client';

import React, { useEffect, useState } from 'react';
import { OpsShell } from '../../../components/OpsShell';
import { OpsService, Dispute } from '../../../services/OpsService';
import Link from 'next/link';

export default function DisputesPage() {
    const [disputes, setDisputes] = useState<Dispute[]>([]);

    useEffect(() => {
        OpsService.getDisputes().then(setDisputes);
    }, []);

    return (
        <OpsShell>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Disputes</h1>
            </div>

            <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-gray-50 border-b border-gray-100 text-xs uppercase text-gray-500 font-semibold">
                        <tr>
                            <th className="px-6 py-4">Dispute ID</th>
                            <th className="px-6 py-4">Merchant</th>
                            <th className="px-6 py-4">Customer</th>
                            <th className="px-6 py-4">Amount</th>
                            <th className="px-6 py-4">Status</th>
                            <th className="px-6 py-4 text-right">Action</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {disputes.map(d => (
                            <tr key={d.id} className="hover:bg-gray-50">
                                <td className="px-6 py-4 font-mono text-xs">{d.id}</td>
                                <td className="px-6 py-4 font-medium">{d.merchantName}</td>
                                <td className="px-6 py-4">{d.customerName}</td>
                                <td className="px-6 py-4">₦{d.amount.toLocaleString()}</td>
                                <td className="px-6 py-4">
                                    <span className={`inline-block px-2 py-1 rounded-full text-xs font-bold capitalize ${d.status === 'open' ? 'bg-red-100 text-red-700' :
                                        'bg-green-100 text-green-700'
                                        }`}>
                                        {d.status.replace('_', ' ')}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <button className="text-sm font-medium hover:underline">
                                        Resolve
                                    </button>
                                </td>
                            </tr>
                        ))}
                        {disputes.length === 0 && (
                            <tr>
                                <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                                    No open disputes.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </OpsShell>
    );
}
