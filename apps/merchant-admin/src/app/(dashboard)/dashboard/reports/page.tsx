'use client';

import React, { useState, useEffect } from 'react';
import { Icon } from '@vayva/ui'; // Mock
import { motion } from 'framer-motion';

export default function ReportsPage() {
    const [summary, setSummary] = useState<any>(null);
    const [reconciliation, setReconciliation] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [range, setRange] = useState('7d'); // 7d, 30d, 90d

    useEffect(() => {
        fetchData();
    }, [range]);

    const fetchData = async () => {
        setLoading(true);
        try {
            // Simplified date logic
            const to = new Date();
            const from = new Date();
            from.setDate(from.getDate() - (range === '30d' ? 30 : range === '90d' ? 90 : 7));

            const query = `?from=${from.toISOString()}&to=${to.toISOString()}`;

            const [resSum, resRec] = await Promise.all([
                fetch(`/api/merchant/reports/summary${query}`),
                fetch(`/api/merchant/reports/reconciliation${query}`)
            ]);

            setSummary(await resSum.json());
            const recData = await resRec.json();
            setReconciliation(recData.items || []);

        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    const handleExport = () => {
        window.open('/api/merchant/reports/export/reconciliation', '_blank');
    };

    return (
        <div className="max-w-7xl mx-auto py-8 px-6">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-2xl font-bold">Reports & Reconciliation</h1>
                    <p className="text-gray-500 text-sm">Financial truth for your store.</p>
                </div>
                <div className="flex gap-2">
                    <select
                        value={range}
                        onChange={e => setRange(e.target.value)}
                        className="p-2 border border-gray-200 rounded-lg text-sm bg-white"
                    >
                        <option value="7d">Last 7 Days</option>
                        <option value="30d">Last 30 Days</option>
                        <option value="90d">Last 90 Days</option>
                    </select>
                    <button onClick={handleExport} className="flex items-center gap-1.5 px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-bold hover:bg-gray-50">
                        <Icon name={"Download" as any} size={14} />
                        Export
                    </button>
                </div>
            </div>

            {/* SUMMARY CARDS */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                <SummaryCard
                    label="Gross Sales"
                    value={`₦${summary ? summary.grossSales.toLocaleString() : '...'}`}
                    sub="Total paid orders"
                    icon="Banknote"
                />
                <SummaryCard
                    label="Net Sales"
                    value={`₦${summary ? summary.netSales.toLocaleString() : '...'}`}
                    sub="Minus refunds"
                    icon="Wallet"
                />
                <SummaryCard
                    label="Delivery Success"
                    value={`${summary ? summary.delivery.successRate : '...'}%`}
                    sub={`${summary?.delivery.deliveredCount || 0} delivered`}
                    icon="Truck"
                />
                <SummaryCard
                    label="Refunds"
                    value={`₦${summary ? summary.refundsAmount.toLocaleString() : '...'}`}
                    sub={`${summary?.refundsCount || 0} processed`}
                    icon="RotateCcw"
                    negative
                />
            </div>

            {/* TABS */}
            <div className="border-b border-gray-200 mb-6">
                <div className="flex gap-6">
                    <button className="py-2 border-b-2 border-black font-bold text-sm">Reconciliation</button>
                    <button className="py-2 border-b-2 border-transparent text-gray-400 hover:text-gray-600 font-bold text-sm">Order History</button>
                    <button className="py-2 border-b-2 border-transparent text-gray-400 hover:text-gray-600 font-bold text-sm">Payouts</button>
                </div>
            </div>

            {/* RECONCILIATION TABLE */}
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
                <table className="w-full text-sm text-left">
                    <thead className="bg-gray-50 text-gray-500 font-medium">
                        <tr>
                            <th className="p-4">Date</th>
                            <th className="p-4">Order Ref</th>
                            <th className="p-4">Customer</th>
                            <th className="p-4">Status</th>
                            <th className="p-4 text-right">Total</th>
                            <th className="p-4 text-right">Paid</th>
                            <th className="p-4 text-center">Discrepancy</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            Array(5).fill(0).map((_, i) => (
                                <tr key={i}><td colSpan={7} className="p-4"><div className="h-4 bg-gray-100 rounded animate-pulse" /></td></tr>
                            ))
                        ) : (
                            reconciliation.map(item => (
                                <tr key={item.orderId} className="border-t border-gray-100 hover:bg-gray-50">
                                    <td className="p-4 text-gray-500">{new Date(item.date).toLocaleDateString()}</td>
                                    <td className="p-4 font-mono text-xs">{item.refCode}</td>
                                    <td className="p-4">{item.customerName}</td>
                                    <td className="p-4">
                                        <span className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold ${item.status === 'FULFILLED' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'
                                            }`}>
                                            {item.status}
                                        </span>
                                    </td>
                                    <td className="p-4 text-right font-medium">₦{item.total.toLocaleString()}</td>
                                    <td className="p-4 text-right text-gray-600">₦{item.paidAmount.toLocaleString()}</td>
                                    <td className="p-4 text-center">
                                        {item.discrepancies.length > 0 ? (
                                            <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-red-100 text-red-700 rounded text-[10px] font-bold">
                                                <Icon name={"AlertCircle" as any} size={10} />
                                                {item.discrepancies[0]}
                                            </span>
                                        ) : (
                                            <span className="text-green-500 text-xs font-bold">Match</span>
                                        )}
                                    </td>
                                </tr>
                            ))
                        )}
                        {!loading && reconciliation.length === 0 && (
                            <tr><td colSpan={7} className="p-12 text-center text-gray-400">No data found for this period.</td></tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

function SummaryCard({ label, value, sub, icon, negative }: any) {
    return (
        <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex items-start justify-between">
            <div>
                <p className="text-gray-500 text-xs font-bold uppercase mb-1">{label}</p>
                <h3 className={`text-xl font-bold ${negative ? 'text-red-600' : 'text-black'}`}>{value}</h3>
                <p className="text-gray-400 text-xs mt-1">{sub}</p>
            </div>
            <div className="p-2 bg-gray-50 rounded-lg text-gray-400">
                <Icon name={icon as any} size={18} />
            </div>
        </div>
    );
}
