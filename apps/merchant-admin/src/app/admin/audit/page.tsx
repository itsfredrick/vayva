
"use client";

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { apiClient } from '@/lib/apiClient';
import { Icon } from '@vayva/ui';

interface AuditEvent {
    id: string;
    userId: string;
    eventType: string;
    metadata: any;
    createdAt: string;
}

export default function AuditLogPage() {
    const { merchant, user: sessionUser } = useAuth(); // Need to check if user is admin if implementing frontend guards
    const [events, setEvents] = useState<AuditEvent[]>([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);

    // Filters
    const [typeFilter, setTypeFilter] = useState('ALL');

    useEffect(() => {
        const load = async () => {
            setLoading(true);
            try {
                // Fetch audit logs (assuming backend route is ready or using direct Prisma call if server component - but this is client page)
                // We need to create the GET route first. For now, we simulate or stub.
                const res = await apiClient.get(`/api/admin/audit?page=${page}&type=${typeFilter}`);
                setEvents(res.events || []);
            } catch (e) {
                console.error(e);
            } finally {
                setLoading(false);
            }
        };
        load();
    }, [page, typeFilter]);

    return (
        <div className="max-w-6xl mx-auto py-8">
            <h1 className="text-3xl font-bold mb-2">Audit Log</h1>
            <p className="text-gray-500 mb-8">Track important actions and changes in your store.</p>

            {/* Filters */}
            <div className="bg-white p-4 rounded-xl border border-gray-200 mb-6 flex gap-4">
                <select
                    className="border border-gray-200 rounded-lg px-3 py-2"
                    value={typeFilter}
                    onChange={(e) => setTypeFilter(e.target.value)}
                >
                    <option value="ALL">All Event Types</option>
                    <option value="ORDER_BULK_STATUS_CHANGED">Bulk Status Update</option>
                    <option value="ORDER_EXPORTED">Data Export</option>
                    <option value="WITHDRAWAL_REQUESTED">Withdrawal</option>
                    <option value="TEAM_INVITE_SENT">Team Invite</option>
                </select>
            </div>

            {/* Table */}
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-gray-50 border-b border-gray-100 text-xs font-bold text-gray-500 uppercase">
                        <tr>
                            <th className="p-4">Time</th>
                            <th className="p-4">Actor</th>
                            <th className="p-4">Action</th>
                            <th className="p-4">Details</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                        {loading && (
                            <tr><td colSpan={4} className="p-8 text-center text-gray-400">Loading audit trail...</td></tr>
                        )}
                        {!loading && events.length === 0 && (
                            <tr><td colSpan={4} className="p-8 text-center text-gray-400">No events found.</td></tr>
                        )}
                        {events.map((evt) => (
                            <tr key={evt.id} className="hover:bg-gray-50/50">
                                <td className="p-4 text-sm whitespace-nowrap text-gray-600">
                                    {new Date(evt.createdAt).toLocaleString()}
                                </td>
                                <td className="p-4 font-mono text-sm">
                                    {evt.userId?.slice(-6) || 'System'}
                                </td>
                                <td className="p-4">
                                    <span className="px-2 py-1 bg-gray-100 rounded text-xs font-bold text-gray-700 font-mono">
                                        {evt.eventType}
                                    </span>
                                </td>
                                <td className="p-4 text-sm text-gray-600 font-mono">
                                    <pre className="text-xs">{JSON.stringify(evt.metadata, null, 2)}</pre>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Pagination Controls */}
            <div className="flex justify-end gap-2 mt-4">
                <button
                    disabled={page === 1}
                    onClick={() => setPage(p => Math.max(1, p - 1))}
                    className="px-4 py-2 border rounded-lg bg-white disabled:opacity-50"
                >
                    Previous
                </button>
                <button
                    onClick={() => setPage(p => p + 1)}
                    className="px-4 py-2 border rounded-lg bg-white hover:bg-gray-50"
                >
                    Next
                </button>
            </div>
        </div>
    );
}
