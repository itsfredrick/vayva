'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { OpsShell } from '@/components/ops/ops-shell';
import { Button, Icon, cn } from '@vayva/ui';

export default function OpsKycPage() {
    const [status, setStatus] = useState<'PENDING' | 'FAILED' | 'VERIFIED'>('PENDING');
    const [records, setRecords] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [overriding, setOverriding] = useState<string | null>(null);

    const fetchKyc = async (s: string) => {
        setLoading(true);
        try {
            const res = await fetch(`/api/ops/kyc?status=${s}`);
            const data = await res.json();
            setRecords(Array.isArray(data) ? data : []);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchKyc(status);
    }, [status]);

    const handleOverride = async (recId: string) => {
        const reason = prompt('Please enter a reason for this manual KYC override:');
        if (!reason) return;

        setOverriding(recId);
        try {
            const res = await fetch(`/api/ops/kyc/${recId}/override`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ reason })
            });
            if (res.ok) {
                fetchKyc(status);
            } else {
                alert('Override failed');
            }
        } catch (err) {
            console.error(err);
        } finally {
            setOverriding(null);
        }
    };

    return (
        <OpsShell
            title="KYC Review Queue"
            description="Review identity verification attempts and manage manual overrides."
        >
            {/* Status Tabs */}
            <div className="flex gap-4 mb-8">
                {['PENDING', 'FAILED', 'VERIFIED'].map((s) => (
                    <button
                        key={s}
                        onClick={() => setStatus(s as any)}
                        className={cn(
                            "px-6 py-2 rounded-full text-xs font-bold transition-all border",
                            status === s
                                ? "bg-primary text-black border-primary"
                                : "bg-white/5 text-text-secondary border-white/10 hover:border-white/20"
                        )}
                    >
                        {s}
                    </button>
                ))}
            </div>

            {/* Table */}
            <div className="border border-white/10 rounded-xl overflow-hidden bg-[#0b141a]/50">
                <table className="w-full text-left text-sm">
                    <thead className="bg-white/5 text-text-secondary border-b border-white/5 font-medium uppercase text-xs tracking-wider">
                        <tr>
                            <th className="px-6 py-4">Merchant</th>
                            <th className="px-6 py-4">Owner Name</th>
                            <th className="px-6 py-4">Method</th>
                            <th className="px-6 py-4">Attempt Time</th>
                            <th className="px-6 py-4">Plan</th>
                            <th className="px-6 py-4 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                        {loading ? (
                            <tr><td colSpan={6} className="px-6 py-12 text-center text-text-secondary">Loading queue...</td></tr>
                        ) : records.length === 0 ? (
                            <tr><td colSpan={6} className="px-6 py-12 text-center text-text-secondary">No records in this status.</td></tr>
                        ) : (
                            records.map((r) => (
                                <tr key={r.id} className="hover:bg-white/5 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="font-bold text-white">{r.storeName}</div>
                                        <div className="text-[10px] text-text-secondary font-mono uppercase">{r.storeId}</div>
                                    </td>
                                    <td className="px-6 py-4 text-white font-medium">{r.ownerName}</td>
                                    <td className="px-6 py-4">
                                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-white/5 border border-white/10 text-white/60">
                                            {r.method} via {r.provider}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-text-secondary text-xs">
                                        {new Date(r.attemptTime).toLocaleString()}
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="text-[10px] font-bold text-indigo-400">{r.plan}</span>
                                    </td>
                                    <td className="px-6 py-4 text-right space-x-2">
                                        <Link href={`/ops/merchants/${r.storeId}`}>
                                            <Button size="sm" variant="ghost">Detail</Button>
                                        </Link>
                                        {status !== 'VERIFIED' && (
                                            <Button
                                                size="sm"
                                                className="bg-emerald-600 hover:bg-emerald-500"
                                                onClick={() => handleOverride(r.id)}
                                                isLoading={overriding === r.id}
                                            >
                                                Override
                                            </Button>
                                        )}
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
