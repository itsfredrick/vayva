'use client';

import React, { useEffect, useState } from 'react';
import { OpsShell } from '../../components/OpsShell';
import { OpsService } from '../../services/OpsService';
import { Users, AlertTriangle, Receipt, Activity } from 'lucide-react';
import Link from 'next/link';

export default function OpsDashboard() {
    const [stats, setStats] = useState<any>(null);

    useEffect(() => {
        OpsService.getDashboardStats().then(setStats);
    }, []);

    if (!stats) return <OpsShell><div>Loading...</div></OpsShell>;

    const cards = [
        { title: 'Pending KYC', value: stats.pendingKYC, icon: Users, href: '/ops/merchants?status=pending', color: 'text-orange-600', bg: 'bg-orange-50' },
        { title: 'Open Disputes', value: stats.openDisputes, icon: AlertTriangle, href: '/ops/disputes', color: 'text-red-600', bg: 'bg-red-50' },
        { title: 'Refund Requests', value: stats.pendingRefunds, icon: Receipt, href: '/ops/refunds', color: 'text-blue-600', bg: 'bg-blue-50' },
        { title: 'High Risk', value: stats.highRiskMerchants, icon: Activity, href: '/ops/merchants?risk=high', color: 'text-purple-600', bg: 'bg-purple-50' },
    ];

    return (
        <OpsShell>
            <h1 className="text-2xl font-bold mb-6">Dashboard Overview</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {cards.map((card, i) => {
                    const Icon = card.icon;
                    return (
                        <Link key={i} href={card.href} className="block p-6 bg-white border border-gray-200 rounded-xl hover:border-black transition-colors">
                            <div className="flex justify-between items-start mb-4">
                                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${card.bg} ${card.color}`}>
                                    <Icon size={20} />
                                </div>
                                <span className="text-2xl font-bold">{card.value}</span>
                            </div>
                            <h3 className="font-medium text-gray-500">{card.title}</h3>
                        </Link>
                    )
                })}
            </div>

            <div className="bg-white border border-gray-200 rounded-xl p-8 text-center py-20">
                <h3 className="text-lg font-bold mb-2">System Status</h3>
                <p className="text-gray-500">All systems operational. No outages reported.</p>
            </div>
        </OpsShell>
    );
}
