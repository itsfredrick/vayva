'use client';

import React from 'react';
import { AdminShell } from '@/components/admin-shell';
import { Icon } from '@vayva/ui';

export default function RiskPage() {
    return (
        <AdminShell title="Risk & Safety" breadcrumb="Overview">
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-[#0B0B0B]">Risk Overview</h1>
                        <p className="text-sm text-gray-500">Monitor your account health and safety signals.</p>
                    </div>
                </div>

                {/* Status Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-white border border-gray-100 p-6 rounded-xl shadow-sm">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-sm font-medium text-gray-500">Account Status</h3>
                            <Icon name="ShieldCheck" className="text-green-500" size={20} />
                        </div>
                        <p className="text-2xl font-bold text-[#0B0B0B]">Healthy</p>
                        <p className="text-xs text-gray-400 mt-1">No active restrictions</p>
                    </div>

                    <div className="bg-white border border-gray-100 p-6 rounded-xl shadow-sm">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-sm font-medium text-gray-500">Risk Score</h3>
                            <div className="h-2 w-24 bg-gray-100 rounded-full overflow-hidden">
                                <div className="h-full w-[10%] bg-green-500"></div>
                            </div>
                        </div>
                        <p className="text-2xl font-bold text-[#0B0B0B]">10 <span className="text-sm text-gray-400 font-normal">/ 100</span></p>
                        <p className="text-xs text-green-600 mt-1">Low Risk</p>
                    </div>

                    <div className="bg-white border border-gray-100 p-6 rounded-xl shadow-sm">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-sm font-medium text-gray-500">Active Signals</h3>
                            <Icon name="Activity" className="text-blue-500" size={20} />
                        </div>
                        <p className="text-2xl font-bold text-[#0B0B0B]">2</p>
                        <p className="text-xs text-gray-400 mt-1">Last 30 days</p>
                    </div>
                </div>

                {/* Signals Table */}
                <div className="bg-white border border-gray-100 rounded-xl overflow-hidden shadow-sm">
                    <div className="px-6 py-4 border-b border-gray-100 font-medium">Recent Activity</div>
                    <table className="w-full text-sm text-left">
                        <tbody className="divide-y divide-gray-100">
                            <tr>
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4">
                                            <Icon name={"AlertTriangle" as any} className="text-text-secondary" />
                                        </div>
                                        <div>
                                            <p className="font-medium text-[#0B0B0B]">High Refund Rate Warning</p>
                                            <p className="text-xs text-gray-500">Your refund rate exceeded 3% this week.</p>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-right text-gray-500">2 days ago</td>
                            </tr>
                            <tr>
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center">
                                            <Icon name="Info" size={14} />
                                        </div>
                                        <div>
                                            <p className="font-medium text-[#0B0B0B]">New Device Login</p>
                                            <p className="text-xs text-gray-500">Verified login from Lagos, NG.</p>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-right text-gray-500">5 days ago</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </AdminShell>
    );
}
