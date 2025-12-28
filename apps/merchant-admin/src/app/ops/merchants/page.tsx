'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { OpsShell } from '@/components/ops/ops-shell';
import { RiskChip } from '@/components/ops/risk-chip';
import { Button, Icon, Input } from '@vayva/ui';

export default function OpsMerchantsPage() {
    const [search, setSearch] = useState('');
    const [merchants, setMerchants] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchMerchants = async (query = '') => {
        setLoading(true);
        try {
            const res = await fetch(`/api/ops/merchants?query=${query}`);
            const data = await res.json();
            setMerchants(Array.isArray(data) ? data : []);
        } catch (err) {
            console.error('Failed to fetch merchants:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMerchants();
    }, []);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        fetchMerchants(search);
    };

    return (
        <OpsShell
            title="Merchants"
            description="Manage stores, review risk profiles, and handle account actions."
            actions={
                <Button variant="outline" className="text-white border-white/10 hover:bg-white/5 gap-2">
                    <Icon name={"Download" as any} size={18} /> Export CSV
                </Button>
            }
        >
            {/* Search Bar */}
            <div className="bg-white/5 border border-white/5 rounded-xl p-6 mb-8">
                <form onSubmit={handleSearch} className="flex gap-4">
                    <div className="flex-1">
                        <Input
                            placeholder="Search by Store ID, Slug, Name, or Email..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="bg-black/20"
                        />
                    </div>
                    <Button type="submit" isLoading={loading}>
                        <Icon name={"Search" as any} size={18} className="mr-2" />
                        Search
                    </Button>
                </form>
            </div>

            {/* Table */}
            <div className="border border-white/10 rounded-xl overflow-hidden bg-[#0b141a]/50">
                <table className="w-full text-left text-sm">
                    <thead className="bg-white/5 text-text-secondary border-b border-white/5 font-medium uppercase text-xs tracking-wider">
                        <tr>
                            <th className="px-6 py-4 font-bold">Store</th>
                            <th className="px-6 py-4 font-bold">Plan</th>
                            <th className="px-6 py-4 font-bold">KYC Status</th>
                            <th className="px-6 py-4 font-bold">Risk</th>
                            <th className="px-6 py-4 font-bold">Created</th>
                            <th className="px-6 py-4"></th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                        {loading ? (
                            <tr>
                                <td colSpan={6} className="px-6 py-12 text-center text-text-secondary">
                                    Searching merchants...
                                </td>
                            </tr>
                        ) : merchants.length === 0 ? (
                            <tr>
                                <td colSpan={6} className="px-6 py-12 text-center text-text-secondary">
                                    No merchants found matching your query.
                                </td>
                            </tr>
                        ) : (
                            merchants.map((m) => (
                                <tr key={m.id} className="hover:bg-white/5 transition-colors group">
                                    <td className="px-6 py-4">
                                        <div className="font-bold text-white">{m.name}</div>
                                        <div className="text-text-secondary text-xs">{m.slug}.vayva.store</div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                                            {m.plan}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded border ${m.kycStatus === 'VERIFIED' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                                                m.kycStatus === 'FAILED' ? 'bg-red-500/10 text-red-400 border-red-500/20' :
                                                    'bg-amber-500/10 text-amber-400 border-amber-500/20'
                                            }`}>
                                            {m.kycStatus}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <RiskChip level="Low" />
                                    </td>
                                    <td className="px-6 py-4 text-text-secondary text-xs">
                                        {new Date(m.createdAt).toLocaleDateString()}
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <Link href={`/ops/merchants/${m.id}`}>
                                            <Button size="sm" variant="ghost" className="text-text-secondary hover:text-white">
                                                Manage
                                            </Button>
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
