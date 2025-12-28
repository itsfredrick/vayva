'use client';

import React, { useState, useEffect } from 'react';
import { AdminShell } from '@/components/admin-shell';
import { Button, Icon, cn } from '@vayva/ui';
import { motion } from 'framer-motion';
import { api } from '@/services/api';

interface Ticket {
    id: string;
    subscriptionId: string;
    ticketNumber: number;
    subject: string;
    description: string;
    status: string; // OPEN, RESOLVED, CLOSED
    priority: string; // LOW, MEDIUM, HIGH
    createdAt: string;
    customer?: {
        name?: string;
        email?: string;
        phone?: string;
    };
    conversationId?: string;
}

const statusColor = (status: string) => {
    switch (status?.toUpperCase()) {
        case 'OPEN': return 'bg-blue-50 text-blue-700';
        case 'RESOLVED': return 'bg-green-50 text-green-700';
        case 'CLOSED': return 'bg-gray-50 text-gray-700';
        default: return 'bg-gray-50 text-gray-600';
    }
};

const priorityColor = (p: string) => {
    switch (p?.toUpperCase()) {
        case 'HIGH': return 'text-red-600';
        case 'MEDIUM': return 'text-orange-600';
        case 'LOW': return 'text-gray-600';
        default: return 'text-gray-600';
    }
};

export default function TicketsPage() {
    const [tickets, setTickets] = useState<Ticket[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const fetchTickets = async () => {
        try {
            const res = await api.get('/tickets');
            setTickets(res.data);
        } catch (err) {
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchTickets();
    }, []);

    return (
        <AdminShell title="Support Tickets">
            <div className="flex flex-col gap-6">

                {/* Header Actions */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 max-w-md w-full">
                        <div className="relative flex-1">
                            <Icon name="Search" size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search tickets..."
                                className="w-full h-10 pl-10 pr-4 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-black/5"
                            />
                        </div>
                    </div>
                    <Button><Icon name="Plus" size={16} className="mr-2" /> New Ticket</Button>
                </div>

                {/* Table */}
                <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden min-h-[400px]">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-gray-50 border-b border-gray-100 text-xs uppercase text-gray-500 font-medium">
                            <tr>
                                <th className="px-6 py-4">ID</th>
                                <th className="px-6 py-4">Subject</th>
                                <th className="px-6 py-4">Customer</th>
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4">Priority</th>
                                <th className="px-6 py-4">Created</th>
                                <th className="px-6 py-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {isLoading ? (
                                <tr><td colSpan={7} className="p-6 text-center text-gray-400">Loading tickets...</td></tr>
                            ) : tickets.length === 0 ? (
                                <tr><td colSpan={7} className="p-12 text-center text-gray-400">No tickets found.</td></tr>
                            ) : (
                                tickets.map((t) => (
                                    <motion.tr
                                        key={t.id}
                                        whileHover={{ backgroundColor: "#F9FAFB" }}
                                    >
                                        <td className="px-6 py-4 font-mono text-xs text-[#525252]">#{t.ticketNumber}</td>
                                        <td className="px-6 py-4 font-medium text-[#0B0B0B]">{t.subject}</td>
                                        <td className="px-6 py-4 text-[#525252]">{t.customer?.name || t.customer?.phone || 'Guest'}</td>
                                        <td className="px-6 py-4">
                                            <span className={cn("px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider", statusColor(t.status))}>
                                                {t.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-1 font-medium text-xs">
                                                <span className={cn("inline-block w-2 h-2 rounded-full", priorityColor(t.priority).replace('text-', 'bg-'))} />
                                                <span className={priorityColor(t.priority)}>{t.priority}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-[#525252]">{new Date(t.createdAt).toLocaleDateString()}</td>
                                        <td className="px-6 py-4 text-right">
                                            {/* Action column is intentionally empty or minimal to avoid dead links */}
                                            <span className="text-[10px] text-gray-400">Details unavailable</span>
                                        </td>
                                    </motion.tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

            </div>
        </AdminShell>
    );
}
