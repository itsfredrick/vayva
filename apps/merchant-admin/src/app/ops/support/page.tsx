'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Icon, Badge, Button } from '@vayva/ui';

interface OpsTicket {
    id: string;
    store: { name: string; category: string };
    type: string;
    category: string;
    status: string;
    priority: string;
    subject: string;
    summary: string;
    slaDueAt: string | null;
    createdAt: string;
}

export default function OpsSupportDashboard() {
    const [tickets, setTickets] = useState<OpsTicket[]>([]);
    const [filter, setFilter] = useState<'ALL' | 'OPEN' | 'RESOLVED'>('OPEN');
    const [isLoading, setIsLoading] = useState(true);

    const [metrics, setMetrics] = useState<any>(null);
    const [range, setRange] = useState<'today' | '7d'>('today');

    useEffect(() => {
        setIsLoading(true);
        Promise.all([
            fetch('/api/ops/support/tickets').then(res => res.json()),
            fetch(`/api/ops/support/metrics?range=${range}`).then(res => res.json())
        ]).then(([ticketsData, metricsData]) => {
            setTickets(ticketsData);
            setMetrics(metricsData);
            setIsLoading(false);
        }).catch(err => {
            console.error(err);
            setIsLoading(false);
        });
    }, [range]);

    const filteredTickets = tickets.filter(t => {
        if (filter === 'ALL') return true;
        if (filter === 'OPEN') return t.status !== 'RESOLVED' && t.status !== 'CLOSED';
        return t.status === filter;
    });

    const getPriorityColor = (p: string) => {
        if (p === 'URGENT') return 'red';
        if (p === 'HIGH') return 'orange';
        return 'blue';
    };

    return (
        <div className="p-8 max-w-7xl mx-auto space-y-6">
            <header className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Platform Support</h1>
                    <p className="text-gray-500 text-sm mt-1">Manage escalations and merchant disputes</p>
                </div>
                <div className="flex gap-2">
                    <Button
                        variant={filter === 'OPEN' ? 'primary' : 'outline'}
                        onClick={() => setFilter('OPEN')}
                        size="sm"
                    >
                        Open
                    </Button>
                    <Button
                        variant={filter === 'RESOLVED' ? 'primary' : 'outline'}
                        onClick={() => setFilter('RESOLVED')}
                        size="sm"
                    >
                        Resolved
                    </Button>
                    <Button
                        variant={filter === 'ALL' ? 'primary' : 'outline'}
                        onClick={() => setFilter('ALL')}
                        size="sm"
                    >
                        All
                    </Button>
                </div>
            </header>

            {/* Metrics Bar */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <MetricCard
                    label="Tickets Created"
                    value={metrics?.ticketsCreated ?? '-'}
                    trend={metrics ? `${metrics.overdueTickets} overdue` : ''}
                    trendColor="red"
                />
                <MetricCard
                    label="Deflection Rate"
                    value={metrics ? `${(metrics.deflectionRate * 100).toFixed(0)}%` : '-'}
                    trend="Bot Resolved"
                    trendColor="green"
                />
                <MetricCard
                    label="Thumbs Up Rate"
                    value={metrics ? `${(metrics.thumbsUpRate * 100).toFixed(0)}%` : '-'}
                    trend="User Satisfaction"
                    trendColor="blue"
                />
                <MetricCard
                    label="Top Trigger"
                    value={metrics?.triggerBreakdown?.[0]?.trigger ?? 'None'}
                    trend={metrics?.triggerBreakdown?.[0]?.count ? `${metrics.triggerBreakdown[0].count} events` : ''}
                    trendColor="gray"
                />
            </div>

            {isLoading ? (
                <div className="text-center py-12 text-gray-400">Loading tickets...</div>
            ) : (
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-gray-50 text-gray-500 font-medium border-b border-gray-200">
                            <tr>
                                <th className="p-4">Ticket</th>
                                <th className="p-4">Merchant</th>
                                <th className="p-4">Trigger/Category</th>
                                <th className="p-4">Priority / SLA</th>
                                <th className="p-4">Status</th>
                                <th className="p-4 text-right">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {filteredTickets.map(ticket => (
                                <tr key={ticket.id} className="hover:bg-gray-50/50 transition-colors">
                                    <td className="p-4">
                                        <div className="font-semibold text-gray-900 line-clamp-1">{ticket.subject}</div>
                                        <div className="text-xs text-gray-400 mt-0.5 line-clamp-1">{ticket.summary}</div>
                                    </td>
                                    <td className="p-4">
                                        <div className="text-gray-900 font-medium">{ticket.store.name}</div>
                                        <div className="text-xs text-gray-400 capitalize">{ticket.store.category.toLowerCase()}</div>
                                    </td>
                                    <td className="p-4">
                                        <div className="flex gap-2">
                                            {/* @ts-ignore */}
                                            <Badge variant="default">{ticket.category}</Badge>
                                        </div>
                                    </td>
                                    <td className="p-4">
                                        <div className="flex flex-col gap-1 items-start">
                                            {/* @ts-ignore */}
                                            <Badge color={getPriorityColor(ticket.priority)} size="sm">{ticket.priority}</Badge>
                                            {ticket.slaDueAt && (
                                                <span className="text-xs text-gray-500">
                                                    Due: {new Date(ticket.slaDueAt).toLocaleString()}
                                                </span>
                                            )}
                                        </div>
                                    </td>
                                    <td className="p-4">
                                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${ticket.status === 'OPEN' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                                            }`}>
                                            {ticket.status}
                                        </span>
                                    </td>
                                    <td className="p-4 text-right">
                                        <Link href={`/ops/support/tickets/${ticket.id}`}>
                                            <Button variant="outline" size="sm">Review</Button>
                                        </Link>
                                    </td>
                                </tr>
                            ))}
                            {filteredTickets.length === 0 && (
                                <tr>
                                    <td colSpan={6} className="p-8 text-center text-gray-400">
                                        No tickets found in this view.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}

function MetricCard({ label, value, trend, trendColor }: any) {
    const colors: any = { red: 'text-red-600', green: 'text-green-600', blue: 'text-blue-600', gray: 'text-gray-500' };
    return (
        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
            <div className="text-gray-500 text-xs font-medium uppercase tracking-wide">{label}</div>
            <div className="mt-1 text-2xl font-bold text-gray-900">{value}</div>
            {trend && <div className={`text-xs mt-1 ${colors[trendColor] || 'text-gray-500'}`}>{trend}</div>}
        </div>
    );
}
