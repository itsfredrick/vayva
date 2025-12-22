'use client';

import React from 'react';
import Link from 'next/link';
import { AppShell } from '@vayva/ui';
import { GlassPanel } from '@vayva/ui';
import { Button } from '@vayva/ui';
import { Icon } from '@vayva/ui';

const MOCK_TASKS = [
    { id: 'DT-204', order: 'VV-1024', customer: 'Chinedu Okafor', type: 'Delivery', window: 'Today, 2pm - 4pm', status: 'Scheduled', assignee: 'Unassigned' },
    { id: 'DT-203', order: 'VV-1022', customer: 'John Doe', type: 'Pickup', window: 'Tomorrow, 10am', status: 'Pending', assignee: 'Unassigned' },
    { id: 'DT-201', order: 'VV-1018', customer: 'Sarah Mike', type: 'Delivery', window: 'Yesterday', status: 'Failed', assignee: 'Mike Driver' },
];

export default function DeliveryTasksPage() {
    return (
        <AppShell sidebar={<></>} header={<></>}>
            <div className="flex flex-col gap-6">
                {/* KPI Row */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {[
                        { label: 'Tasks Today', value: '12', icon: 'Truck', color: 'text-white' },
                        { label: 'Pending', value: '5', icon: 'Clock', color: 'text-state-warning' },
                        { label: 'Overdue', value: '1', icon: 'AlertTriangle', color: 'text-state-danger' },
                    ].map((stat, i) => (
                        <GlassPanel key={i} className="p-4 flex flex-col gap-2">
                            <div className="flex items-center gap-2 text-text-secondary text-xs font-bold uppercase tracking-wider">
                                <Icon name={stat.icon as any} size={16} />
                                {stat.label}
                            </div>
                            <div className={`text-xl font-bold ${stat.color}`}>{stat.value}</div>
                        </GlassPanel>
                    ))}
                </div>

                {/* Filters */}
                <GlassPanel className="p-4 flex flex-col md:flex-row gap-4 justify-between items-center">
                    <div className="w-full md:w-auto relative">
                        <Icon name={"Search" as any} size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary" />
                        <input
                            className="bg-white/5 border border-white/5 rounded-full pl-10 pr-4 py-2 text-sm text-white focus:outline-none focus:border-primary w-full md:w-64"
                            placeholder="Search by Order ID, Address..."
                        />
                    </div>
                    <div className="flex gap-2 w-full md:w-auto overflow-x-auto pb-2 md:pb-0">
                        {['All', 'Scheduled', 'In Progress', 'Delivered', 'Failed'].map((status, i) => (
                            <button key={status} className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap ${i === 0 ? 'bg-white text-background-dark' : 'bg-white/5 text-text-secondary hover:bg-white/10'}`}>
                                {status}
                            </button>
                        ))}
                    </div>
                </GlassPanel>

                {/* Table */}
                <GlassPanel className="overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm">
                            <thead className="bg-white/5 text-text-secondary uppercase text-xs font-bold border-b border-white/5">
                                <tr>
                                    <th className="p-4">Task ID</th>
                                    <th className="p-4">Order</th>
                                    <th className="p-4">Customer</th>
                                    <th className="p-4">Type</th>
                                    <th className="p-4">Window</th>
                                    <th className="p-4">Status</th>
                                    <th className="p-4">Assignee</th>
                                    <th className="p-4"></th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {MOCK_TASKS.map((task) => (
                                    <tr key={task.id} className="group hover:bg-white/5 transition-colors cursor-pointer">
                                        <td className="p-4 font-bold text-white font-mono text-xs">{task.id}</td>
                                        <td className="p-4 text-primary hover:underline font-mono text-xs">
                                            <Link href={`/admin/orders/${task.order}`}>{task.order}</Link>
                                        </td>
                                        <td className="p-4 text-white">{task.customer}</td>
                                        <td className="p-4">
                                            <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider ${task.type === 'Delivery' ? 'bg-indigo-500/10 text-indigo-400' : 'bg-amber-500/10 text-amber-400'
                                                }`}>
                                                {task.type}
                                            </span>
                                        </td>
                                        <td className="p-4 text-text-secondary text-xs">{task.window}</td>
                                        <td className="p-4">
                                            <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider ${task.status === 'Scheduled' ? 'bg-white/10 text-white' :
                                                task.status === 'Failed' ? 'bg-state-danger/10 text-state-danger' :
                                                    task.status === 'Delivered' ? 'bg-state-success/10 text-state-success' : 'bg-white/10 text-text-secondary'
                                                }`}>
                                                {task.status}
                                            </span>
                                        </td>
                                        <td className="p-4 text-text-secondary text-xs italic">{task.assignee}</td>
                                        <td className="p-4 text-right">
                                            <Link href={`/admin/delivery/tasks/${task.id}`}>
                                                <Button size="icon" variant="ghost" className="h-8 w-8 text-text-secondary hover:text-white">
                                                    <Icon name={"ChevronRight" as any} size={20} />
                                                </Button>
                                            </Link>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </GlassPanel>
            </div>
        </AppShell>
    );
}
