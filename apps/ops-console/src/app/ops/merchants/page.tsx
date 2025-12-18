'use client';

import React, { useEffect, useState } from 'react';
import { OpsShell } from '../../../components/OpsShell';
import { OpsService, Merchant } from '../../../services/OpsService';
import Link from 'next/link';

export default function MerchantsPage() {
    const [merchants, setMerchants] = useState<Merchant[]>([]);

    useEffect(() => {
        OpsService.getMerchants().then(setMerchants);
    }, []);

    return (
        <OpsShell>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Merchants</h1>
            </div>

            <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-gray-50 border-b border-gray-100 text-xs uppercase text-gray-500 font-semibold">
                        <tr>
                            <th className="px-6 py-4">Merchant</th>
                            <th className="px-6 py-4">Plan</th>
                            <th className="px-6 py-4">KYC Status</th>
                            <th className="px-6 py-4">Risk</th>
                            <th className="px-6 py-4">Joined</th>
                            <th className="px-6 py-4 text-right">Action</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {merchants.map(m => (
                            <tr key={m.id} className="hover:bg-gray-50">
                                <td className="px-6 py-4">
                                    <div className="font-medium">{m.name}</div>
                                    <div className="text-xs text-gray-500">{m.email}</div>
                                </td>
                                <td className="px-6 py-4 text-sm capitalize">{m.plan}</td>
                                <td className="px-6 py-4">
                                    <span className={`inline-block px-2 py-1 rounded-full text-xs font-bold capitalize ${m.kycStatus === 'verified' ? 'bg-green-100 text-green-700' :
                                        m.kycStatus === 'pending' ? 'bg-orange-100 text-orange-700' :
                                            'bg-gray-100 text-gray-600'
                                        }`}>
                                        {m.kycStatus}
                                    </span>
                                </td>
                                <td className="px-6 py-4">
                                    <span className={`inline-block px-2 py-1 rounded-full text-xs font-bold capitalize ${m.riskScore === 'high' ? 'bg-red-100 text-red-700' :
                                        'bg-gray-100 text-gray-600'
                                        }`}>
                                        {m.riskScore}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-gray-500 text-sm">{m.joinedAt}</td>
                                <td className="px-6 py-4 text-right">
                                    <Link href={`/ops/merchants/${m.id}`} className="text-sm font-medium hover:underline">
                                        View
                                    </Link>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </OpsShell>
    );
}
