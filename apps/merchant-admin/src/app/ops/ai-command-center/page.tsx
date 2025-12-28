'use client';

import React, { useState, useEffect } from 'react';
import { AdminShell } from '@/components/admin-shell';
import { Icon, Button, cn } from '@vayva/ui';

export default function AiCommandCenter() {
    const [stats, setStats] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Mocking Ops API calls for the Command Center
        setTimeout(() => {
            setStats({
                global: {
                    messagesToday: 12450,
                    avgLatency: '450ms',
                    platformCost: '₦45,200',
                    errorRate: '0.2%'
                },
                spikes: [
                    { store: 'TrendHub Lagos', growth: '+450%', messages: 1200, status: 'review' },
                    { store: 'Zara Local', growth: '+120%', messages: 800, status: 'healthy' }
                ],
                abuse: [
                    { ip: '192.168.1.1', device: 'iPhone 13', email: 'user@temp.com', hits: 3, action: 'BLOCKED' },
                    { ip: '105.112.x.x', device: 'Android 12', email: 'test2@gmail.com', hits: 2, action: 'FLAGGED' }
                ]
            });
            setLoading(false);
        }, 1000);
    }, []);

    if (loading) return <AdminShell title="Loading..."><div className="p-12 text-center">Reading the platform brain...</div></AdminShell>;

    return (
        <AdminShell title="AI Command Center" breadcrumb="Ops Console">
            <div className="max-w-7xl mx-auto space-y-8 pb-24">

                {/* Global Stats */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    {[
                        { label: 'Messages Today', value: stats.global.messagesToday, icon: 'MessageSquare', color: 'text-blue-600' },
                        { label: 'Avg Latency', value: stats.global.avgLatency, icon: 'Clock', color: 'text-green-600' },
                        { label: 'Platform Cost', value: stats.global.platformCost, icon: 'CreditCard', color: 'text-orange-600' },
                        { label: 'Error Rate', value: stats.global.errorRate, icon: 'AlertTriangle', color: 'text-red-600' }
                    ].map(card => (
                        <div key={card.label} className="bg-white border border-gray-100 p-6 rounded-xl shadow-sm">
                            <div className="flex justify-between items-start mb-2">
                                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{card.label}</span>
                                <Icon name={card.icon as any} size={14} className={card.color} />
                            </div>
                            <p className="text-2xl font-bold text-[#0B0B0B]">{card.value}</p>
                        </div>
                    ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

                    {/* Spike Board */}
                    <div className="bg-white border border-gray-100 rounded-xl shadow-sm overflow-hidden">
                        <div className="p-6 border-b border-gray-50 flex justify-between items-center bg-gray-50/50">
                            <h3 className="font-bold text-sm text-[#0B0B0B]">Real-time Spike Detector</h3>
                            <span className="text-[10px] text-gray-400 font-medium">Last 60 Minutes</span>
                        </div>
                        <div className="divide-y divide-gray-50">
                            {stats.spikes.map((s: any) => (
                                <div key={s.store} className="p-4 flex items-center justify-between hover:bg-gray-50 transition-colors">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 bg-orange-100 text-orange-600 rounded-lg flex items-center justify-center font-bold text-xs">
                                            {s.growth}
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold text-[#0B0B0B]">{s.store}</p>
                                            <p className="text-[10px] text-gray-500">{s.messages} messages in last hour</p>
                                        </div>
                                    </div>
                                    <Button size="sm" variant="outline" className="text-[10px] h-7 px-3 border-orange-200 text-orange-700 bg-orange-50">
                                        Surgical Throttle
                                    </Button>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Abuse Signals */}
                    <div className="bg-white border border-gray-100 rounded-xl shadow-sm overflow-hidden">
                        <div className="p-6 border-b border-gray-50 flex justify-between items-center bg-red-50/10">
                            <h3 className="font-bold text-sm text-[#0B0B0B]">Free Trial Abuse Signals</h3>
                            <Icon name="ShieldAlert" size={16} className="text-red-500" />
                        </div>
                        <table className="w-full text-left">
                            <thead className="bg-gray-50 text-[10px] text-gray-400 uppercase font-bold">
                                <tr>
                                    <th className="px-6 py-3">Origin / Device</th>
                                    <th className="px-6 py-3 text-center">Repeats</th>
                                    <th className="px-6 py-3 text-right">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {stats.abuse.map((a: any) => (
                                    <tr key={a.ip} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4">
                                            <p className="text-[11px] font-bold text-[#0B0B0B]">{a.ip}</p>
                                            <p className="text-[9px] text-gray-500">{a.device} • {a.email}</p>
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <span className="bg-gray-100 text-gray-600 text-[10px] font-bold px-2 py-0.5 rounded-full">{a.hits}</span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <span className={cn(
                                                "text-[9px] font-bold px-2 py-0.5 rounded uppercase",
                                                a.action === 'BLOCKED' ? "bg-red-100 text-red-700" : "bg-orange-100 text-orange-700"
                                            )}>
                                                {a.action}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                </div>

                {/* Operations Actions */}
                <div className="bg-[#0B0B0B] text-white p-8 rounded-2xl shadow-xl flex items-center justify-between">
                    <div>
                        <h2 className="text-lg font-bold mb-1">Global AI Emergency Kill-Switch</h2>
                        <p className="text-sm text-gray-400 max-w-xl">In case of a platform-wide model failure or provider attack, use this to immediately disable all merchant AI agents globally. This is an audited action.</p>
                    </div>
                    <Button className="bg-red-600 hover:bg-red-700 text-white font-bold px-8 py-3 rounded-full flex items-center gap-2">
                        <Icon name="Power" size={18} /> Emergency Stop
                    </Button>
                </div>

            </div>
        </AdminShell>
    );
}
