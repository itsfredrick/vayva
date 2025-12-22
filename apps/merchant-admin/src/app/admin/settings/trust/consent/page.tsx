'use client';

import React, { useState, useEffect } from 'react';
import { AdminShell } from '@/components/admin-shell';
import { Button, Icon, cn } from '@vayva/ui';
import { api } from '@/services/api';

export default function ConsentPage() {
    const [stats, setStats] = useState({ optIns: 0, optOuts: 0 });
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const res = await api.get('/compliance/consent/stats');
                setStats(res.data);
            } catch (err) {
                console.error(err);
            } finally {
                setIsLoading(false);
            }
        };
        fetchStats();
    }, []);

    return (
        <AdminShell title="Consent & Messaging" breadcrumb="Trust Center">
            <div className="max-w-4xl mx-auto flex flex-col gap-8">

                {/* Analytics */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-[#525252]">Active Opt-ins</p>
                            <h3 className="text-3xl font-bold text-green-600 mt-1">{stats.optIns}</h3>
                        </div>
                        <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center text-green-600">
                            <Icon name={"CheckCircle" as any} size={24} />
                        </div>
                    </div>
                    <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-[#525252]">Opt-outs</p>
                            <h3 className="text-3xl font-bold text-red-600 mt-1">{stats.optOuts}</h3>
                        </div>
                        <div className="w-12 h-12 bg-red-50 rounded-xl flex items-center justify-center text-red-600">
                            <Icon name={"XCircle" as any} size={24} />
                        </div>
                    </div>
                </div>

                {/* Settings */}
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                    <div className="p-6 border-b border-gray-50 font-bold text-[#0B0B0B]">
                        Checkout Consent Settings
                    </div>
                    <div className="divide-y divide-gray-50">
                        <div className="p-6 flex items-center justify-between">
                            <div>
                                <h4 className="font-medium text-[#0B0B0B]">WhatsApp Transactional Consent</h4>
                                <p className="text-sm text-[#525252]">Ask customers if they want to receive order updates on WhatsApp.</p>
                            </div>
                            <div className="w-12 h-6 bg-green-500 rounded-full relative">
                                <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full" />
                            </div>
                        </div>
                        <div className="p-6 flex items-center justify-between">
                            <div>
                                <h4 className="font-medium text-[#0B0B0B]">WhatsApp Marketing Opt-in</h4>
                                <p className="text-sm text-[#525252]">Include a checkbox for promotional messages at checkout.</p>
                            </div>
                            <div className="w-12 h-6 bg-gray-200 rounded-full relative">
                                <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Opt-out Keywords */}
                <div className="bg-[#0B1220] text-white p-8 rounded-2xl flex items-center justify-between">
                    <div>
                        <h3 className="text-lg font-bold mb-1">WhatsApp Opt-out Keywords</h3>
                        <p className="text-white/60 text-sm">Customers can text these keywords to manage their preferences.</p>
                        <div className="flex gap-2 mt-4">
                            {['STOP', 'UNSUBSCRIBE', 'QUIT', 'HELP'].map(k => (
                                <span key={k} className="bg-white/10 px-3 py-1 rounded-lg text-xs font-mono font-bold tracking-wider">
                                    {k}
                                </span>
                            ))}
                        </div>
                    </div>
                    <Icon name="MessageCircle" size={48} className="text-green-400 opacity-20" />
                </div>

            </div>
        </AdminShell>
    );
}
