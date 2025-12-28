
'use client';

import React, { useState, useEffect } from 'react';
import { Card, Icon } from '@vayva/ui';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    AreaChart,
    Area
} from 'recharts';

export default function AnalyticsDashboardPage() {
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAnalytics = async () => {
            try {
                const res = await fetch('/api/analytics/dashboard');
                const json = await res.json();
                setData(json);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchAnalytics();
    }, []);

    if (loading) return <div className="p-8 text-gray-400">Loading Analytics...</div>;
    if (!data) return <div className="p-8 text-red-500">Failed to load data.</div>;

    const { funnel, counts, activation } = data;

    return (
        <div className="max-w-7xl mx-auto py-8 px-6 space-y-8">
            <header>
                <h1 className="text-2xl font-bold mb-2">Product Analytics</h1>
                <p className="text-gray-500 text-sm">Real-time insights on user behavior and activation.</p>
            </header>

            {/* ACTIVATION STATUS */}
            <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
                <h3 className="text-sm font-bold uppercase text-gray-500 mb-4">Activation Checklist</h3>
                <div className="flex flex-wrap gap-4">
                    <ActivationBadge label="Category Selected" active={activation.categorySelected} />
                    <ActivationBadge label="Template Selected" active={activation.templateSelected} />
                    <ActivationBadge label="Product Added" active={activation.firstProductAdded} />
                    <ActivationBadge label="Published" active={activation.storePublished} />
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* FUNNEL CHART */}
                <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm h-[400px]">
                    <h3 className="text-lg font-bold mb-6">Checkout Funnel (30 Days)</h3>
                    <ResponsiveContainer width="100%" height="90%">
                        <BarChart data={funnel}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} />
                            <XAxis dataKey="step" axisLine={false} tickLine={false} />
                            <YAxis axisLine={false} tickLine={false} />
                            <Tooltip cursor={{ fill: '#f3f4f6' }} />
                            <Bar dataKey="count" fill="#4f46e5" radius={[4, 4, 0, 0]} barSize={40} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>

                {/* EVENTS ACTIVITY */}
                <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm max-h-[400px] overflow-y-auto">
                    <h3 className="text-lg font-bold mb-4">Event Activity Breakdown</h3>
                    <table className="w-full text-sm">
                        <thead className="text-gray-500 font-medium border-b border-gray-100">
                            <tr>
                                <th className="text-left py-2">Category</th>
                                <th className="text-left py-2">Action</th>
                                <th className="text-right py-2">Count</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {counts.length === 0 && <tr><td colSpan={3} className="py-4 text-center text-gray-400">No events recorded yet.</td></tr>}
                            {counts.map((c: any, i: number) => (
                                <tr key={i} className="hover:bg-gray-50">
                                    <td className="py-3 font-mono text-xs text-gray-500">{c.category}</td>
                                    <td className="py-3 font-medium text-gray-900">{c.action}</td>
                                    <td className="py-3 text-right">{c.count}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

function ActivationBadge({ label, active }: { label: string, active: boolean }) {
    return (
        <div className={`px-3 py-1.5 rounded-full text-xs font-bold flex items-center gap-2 ${active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-400'
            }`}>
            <Icon name={active ? "CheckCircle" as any : "Circle" as any} size={14} />
            {label}
        </div>
    );
}
