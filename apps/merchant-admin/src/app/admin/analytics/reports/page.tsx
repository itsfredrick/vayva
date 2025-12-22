'use client';

import React, { useState, useEffect } from 'react';
import { AdminShell } from '@/components/admin-shell';
import { Button, Icon, cn } from '@vayva/ui';
import { api } from '@/services/api';

const REPORT_TABS = [
    { key: 'sales', title: 'Sales', icon: 'TrendingUp' },
    { key: 'payments', title: 'Payments', icon: 'CreditCard' },
    { key: 'delivery', title: 'Delivery', icon: 'Truck' },
    { key: 'support', title: 'Support', icon: 'MessageCircle' },
    { key: 'inventory', title: 'Inventory', icon: 'Package' },
];

export default function ReportsPage() {
    const [activeTab, setActiveTab] = useState('sales');
    const [reportData, setReportData] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    const fetchReport = async (reportKey: string) => {
        setIsLoading(true);
        try {
            const res = await api.get(`/analytics/reports/${reportKey}`);
            setReportData(res.data || []);
        } catch (err) {
            console.error(err);
            setReportData([]);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchReport(activeTab);
    }, [activeTab]);

    return (
        <AdminShell title="Reports" breadcrumb="Analytics">
            <div className="flex flex-col gap-8">

                {/* Tabs */}
                <div className="flex gap-2 border-b border-gray-100">
                    {REPORT_TABS.map(tab => (
                        <button
                            key={tab.key}
                            onClick={() => setActiveTab(tab.key)}
                            className={cn(
                                "flex items-center gap-2 px-4 py-3 font-medium text-sm transition-all border-b-2",
                                activeTab === tab.key
                                    ? "border-green-500 text-green-600"
                                    : "border-transparent text-[#525252] hover:text-[#0B1220]"
                            )}
                        >
                            <Icon name={tab.icon as any} size={16} />
                            {tab.title}
                        </button>
                    ))}
                </div>

                {/* Filters */}
                <div className="flex items-center justify-between">
                    <div className="flex gap-2">
                        <input
                            type="date"
                            className="px-3 py-2 border border-gray-200 rounded-lg text-sm"
                            placeholder="From"
                        />
                        <input
                            type="date"
                            className="px-3 py-2 border border-gray-200 rounded-lg text-sm"
                            placeholder="To"
                        />
                    </div>
                    <Button variant="outline" size="sm">
                        <Icon name={"Download" as any} size={16} className="mr-2" />
                        Export CSV
                    </Button>
                </div>

                {/* Table */}
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-gray-50 border-b border-gray-100 text-xs uppercase text-gray-500 font-medium">
                            <tr>
                                <th className="px-6 py-4">Date</th>
                                <th className="px-6 py-4">Metric</th>
                                <th className="px-6 py-4">Value</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {isLoading ? (
                                <tr><td colSpan={3} className="p-12 text-center text-gray-400">Loading...</td></tr>
                            ) : reportData.length === 0 ? (
                                <tr><td colSpan={3} className="p-12 text-center text-gray-400">No data available for this period.</td></tr>
                            ) : (
                                reportData.map((row, i) => (
                                    <tr key={i}>
                                        <td className="px-6 py-4 text-[#525252]">{new Date(row.date).toLocaleDateString()}</td>
                                        <td className="px-6 py-4 font-medium text-[#0B1220]">{activeTab === 'sales' ? 'Net Sales' : 'Count'}</td>
                                        <td className="px-6 py-4 text-[#0B1220]">
                                            {activeTab === 'sales' ? `₦ ${Number(row.netSales || 0).toLocaleString()}` : row.ordersCount || 0}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

            </div>
        </AdminShell>
    );
}
