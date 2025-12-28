'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { formatActivityForMerchant } from '@/lib/merchant-activity';

interface ActivityEvent {
    id: string;
    action: string;
    metadata: any;
    createdAt: string;
    actorRole: string;
}

export default function ActivityLogPage() {
    const { user } = useAuth();
    const [events, setEvents] = useState<ActivityEvent[]>([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [actionFilter, setActionFilter] = useState('ALL');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');

    useEffect(() => {
        fetchActivity();
    }, [page, actionFilter, startDate, endDate]);

    const fetchActivity = async () => {
        try {
            setLoading(true);
            const params = new URLSearchParams({
                page: page.toString(),
                limit: '50'
            });

            if (actionFilter !== 'ALL') params.append('action', actionFilter);
            if (startDate) params.append('startDate', startDate);
            if (endDate) params.append('endDate', endDate);

            const res = await fetch(`/api/admin/activity?${params}`);
            if (!res.ok) throw new Error('Failed to fetch activity');

            const data = await res.json();
            setEvents(data.data.events);
            setTotalPages(data.data.pagination.totalPages);
        } catch (error) {
            console.error('Activity fetch error:', error);
        } finally {
            setLoading(false);
        }
    };

    if (!user) {
        return (
            <div className="p-8">
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-800">
                    Please log in to view activity.
                </div>
            </div>
        );
    }

    return (
        <div className="p-8 max-w-7xl mx-auto">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Activity Log</h1>
                <p className="text-gray-600">This log is for your records. Actions shown here are timestamped.</p>
            </div>

            {/* Filters */}
            <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Action Type
                        </label>
                        <select
                            value={actionFilter}
                            onChange={(e) => setActionFilter(e.target.value)}
                            className="w-full border border-gray-300 rounded-lg px-3 py-2"
                        >
                            <option value="ALL">All Actions</option>
                            <option value="ORDER_STATUS_CHANGED">Order Updates</option>
                            <option value="WITHDRAWAL_REQUESTED">Withdrawals</option>
                            <option value="TEAM_INVITE_SENT">Team Changes</option>
                            <option value="EXPORT_CREATED">Exports</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Start Date
                        </label>
                        <input
                            type="date"
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                            className="w-full border border-gray-300 rounded-lg px-3 py-2"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            End Date
                        </label>
                        <input
                            type="date"
                            value={endDate}
                            onChange={(e) => setEndDate(e.target.value)}
                            className="w-full border border-gray-300 rounded-lg px-3 py-2"
                        />
                    </div>
                </div>
            </div>

            {/* Activity Table */}
            {loading ? (
                <div className="bg-white border border-gray-200 rounded-lg p-8 text-center">
                    <div className="animate-pulse">Loading activity...</div>
                </div>
            ) : events.length === 0 ? (
                <div className="bg-white border border-gray-200 rounded-lg p-8 text-center text-gray-600">
                    No activity recorded for this period.
                </div>
            ) : (
                <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50 border-b border-gray-200">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase">Time</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase">Actor Role</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase">Action</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase">Summary</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {events.map((event) => {
                                    const formatted = formatActivityForMerchant(event);
                                    return (
                                        <tr key={event.id} className="hover:bg-gray-50">
                                            <td className="px-6 py-4 text-sm text-gray-900">{formatted.time}</td>
                                            <td className="px-6 py-4 text-sm text-gray-600">{formatted.actor}</td>
                                            <td className="px-6 py-4 text-sm font-medium text-gray-900">{formatted.action}</td>
                                            <td className="px-6 py-4 text-sm text-gray-600">{formatted.summary}</td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    {totalPages > 1 && (
                        <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
                            <button
                                onClick={() => setPage(p => Math.max(1, p - 1))}
                                disabled={page === 1}
                                className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Previous
                            </button>
                            <span className="text-sm text-gray-600">
                                Page {page} of {totalPages}
                            </span>
                            <button
                                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                                disabled={page === totalPages}
                                className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Next
                            </button>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
