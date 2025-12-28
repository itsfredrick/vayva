'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { OpsShell } from '@/components/ops/ops-shell';
import { Button, Icon, GlassPanel, cn } from '@vayva/ui';

export default function OpsPayoutsPage() {
    const [merchants, setMerchants] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch('/api/ops/payouts')
            .then(res => res.json())
            .then(json => {
                setMerchants(Array.isArray(json) ? json : []);
                setLoading(false);
            })
            .catch(console.error);
    }, []);

    return (
        <OpsShell
            title="Payout Readiness"
            description="Track which merchants are cleared for settlement and identify blockers."
        >
            <div className="border border-white/10 rounded-2xl overflow-hidden bg-[#0a0f14]">
                <table className="w-full text-left text-sm">
                    <thead className="bg-white/5 text-text-secondary border-b border-white/5 font-medium uppercase text-[10px] tracking-widest">
                        <tr>
                            <th className="px-6 py-4">Merchant</th>
                            <th className="px-6 py-4">Plan</th>
                            <th className="px-6 py-4">KYC Status</th>
                            <th className="px-6 py-4">Readiness</th>
                            <th className="px-6 py-4">Block Reasons</th>
                            <th className="px-6 py-4 tex-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                        {loading ? (
                            <tr><td colSpan={6} className="px-6 py-12 text-center text-text-secondary">Analyzing payment flows...</td></tr>
                        ) : merchants.length === 0 ? (
                            <tr><td colSpan={6} className="px-6 py-12 text-center text-text-secondary">No merchants found.</td></tr>
                        ) : (
                            merchants.map(m => (
                                <tr key={m.id} className="hover:bg-white/5 transition-colors">
                                    <td className="px-6 py-4 font-bold text-white">{m.name}</td>
                                    <td className="px-6 py-4">
                                        <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest">{m.plan}</span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={cn("text-[10px] font-bold", m.kycStatus === 'VERIFIED' ? "text-emerald-400" : "text-amber-400")}>
                                            {m.kycStatus}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2">
                                            <div className={cn("w-2 h-2 rounded-full", m.isReady ? "bg-emerald-500" : "bg-red-500")} />
                                            <span className={cn("font-bold", m.isReady ? "text-emerald-400" : "text-red-400")}>
                                                {m.isReady ? 'Ready' : 'Blocked'}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex flex-wrap gap-1">
                                            {m.blockReasons.map((r: string) => (
                                                <span key={r} className="text-[9px] bg-red-500/10 text-red-400 px-1.5 py-0.5 rounded border border-red-500/20 font-bold uppercase">
                                                    {r.replace(/_/g, ' ')}
                                                </span>
                                            ))}
                                            {m.isReady && <span className="text-[9px] text-emerald-500/50 uppercase font-bold tracking-widest">None</span>}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <Link href={`/ops/merchants/${m.id}`}>
                                            <Button size="sm" variant="ghost">Manage</Button>
                                        </Link>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </OpsShell>
    );
}
