'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';

interface OpsMetrics {
    withdrawals: {
        byStatus: Record<string, number>;
        stuck: Array<{
            id: string;
            referenceCode: string;
            status: string;
            amountMajor: number;
            stuckDuration: number;
            updatedAt: string;
        }>;
        agingPending?: Array<{ // P11.2
            id: string;
            referenceCode: string;
            status: string;
            amountMajor: number;
            stuckDuration: number;
            updatedAt: string;
            createdAt: string;
        }>;
        avgTimeToPaid: number | null;
    };
    exports: {
        createdToday: number;
        downloaded: number;
        downloadedToday?: number; // P11.2
        expiredUnused: number;
        stuckJobs: Array<{
            id: string;
            type: string;
            status: string;
            createdAt: string;
            expiresAt: string;
        }>;
        expiredUnusedRows?: Array<{ // P11.2
            id: string;
            type: string;
            status: string;
            createdAt: string;
            expiresAt: string;
        }>;
    };
    security: {
        rateLimitBlocks24h: number;
        sudoAttempts: {
            success: number;
            failed: number;
        };
        stepUpRequired: number;
        sudoSuccess24h?: number; // P11.2
        sudoFailed24h?: number; // P11.2
    };
    apiHealth?: { // P11.2
        errors1h: number;
        errors24h: number;
        topFailingRoutes: Array<{ routeKey: string; count: number }>;
    };
    performance?: { // P11.2
        slowPaths: Array<{ routeKey: string; maxDuration: number; count: number; lastSeen: string }>;
    };
    integrations?: { // P11.2
        whatsapp: { status: string; lastSuccess: string | null; lastEvent: string | null };
        paystack: { status: string; lastSuccess: string | null; lastEvent: string | null };
        delivery: { status: string; lastSuccess: string | null; lastEvent: string | null };
    };
}

export default function OpsPage() {
    const { user } = useAuth();
    const [metrics, setMetrics] = useState<OpsMetrics | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const isAdmin = user?.role === 'ADMIN' || user?.role === 'OWNER';

    useEffect(() => {
        if (!isAdmin) return;

        fetchMetrics();
        const interval = setInterval(fetchMetrics, 60000); // Refresh every minute
        return () => clearInterval(interval);
    }, [isAdmin]);

    const fetchMetrics = async () => {
        try {
            const res = await fetch('/api/admin/ops/metrics');
            if (!res.ok) throw new Error('Failed to fetch metrics');
            const data = await res.json();
            setMetrics(data.data);
            setError(null);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    if (!isAdmin) {
        return (
            <div className="p-8">
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-800">
                    ⚠️ Access denied. Admin privileges required.
                </div>
            </div>
        );
    }

    if (loading) {
        return (
            <div className="p-8">
                <div className="animate-pulse space-y-4">
                    <div className="h-8 bg-gray-200 rounded w-1/4"></div>
                    <div className="h-32 bg-gray-200 rounded"></div>
                    <div className="h-32 bg-gray-200 rounded"></div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-8">
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-800">
                    ⚠️ Error: {error}
                </div>
            </div>
        );
    }

    if (!metrics) return null;

    const formatDuration = (ms: number) => {
        const minutes = Math.floor(ms / 60000);
        const hours = Math.floor(minutes / 60);
        if (hours > 0) return `${hours}h ${minutes % 60}m`;
        return `${minutes}m`;
    };

    const stuckCount = metrics.withdrawals.stuck.length +
        metrics.exports.stuckJobs.length +
        (metrics.withdrawals.agingPending?.length || 0);

    const isP112Active = !!metrics.apiHealth;

    return (
        <div className="p-8 max-w-7xl mx-auto">
            {/* Header */}
            <div className="mb-8">
                <div className="flex justify-between items-start">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">Operations Dashboard</h1>
                        <p className="text-gray-600">System health and performance metrics</p>
                    </div>
                    {/* Last Updated Timestamp */}
                    <div className="text-sm text-gray-500">
                        Updated: {new Date().toLocaleTimeString()}
                    </div>
                </div>

                {stuckCount > 0 && (
                    <div className="mt-4 bg-amber-50 border border-amber-200 rounded-lg p-4 flex items-center gap-3">
                        ⚠️ {stuckCount} stuck operation{stuckCount !== 1 ? 's' : ''} detected
                    </div>
                )}

                {/* API Health Warning Badge */}
                {isP112Active && metrics.apiHealth && metrics.apiHealth.errors1h > 0 && (
                    <div className="mt-2 bg-red-50 border border-red-200 rounded-lg p-4 flex items-center gap-3 text-red-800">
                        🚨 {metrics.apiHealth.errors1h} API Error{metrics.apiHealth.errors1h !== 1 ? 's' : ''} in last hour
                    </div>
                )}
            </div>

            {/* Withdrawals Section */}
            <div className="mb-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                    Withdrawals
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                    {['PENDING', 'PROCESSING', 'PAID', 'FAILED'].map(status => (
                        <div key={status} className="bg-white border border-gray-200 rounded-lg p-4">
                            <div className="text-sm text-gray-600 mb-1">{status}</div>
                            <div className="text-2xl font-bold text-gray-900">
                                {metrics.withdrawals.byStatus[status] || 0}
                            </div>
                        </div>
                    ))}
                </div>

                {metrics.withdrawals.avgTimeToPaid && (
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                        <div className="text-sm text-blue-800 mb-1">Average Time to PAID (Last 7 days)</div>
                        <div className="text-xl font-semibold text-blue-900">
                            {formatDuration(metrics.withdrawals.avgTimeToPaid)}
                        </div>
                    </div>
                )}

                {/* Existing Stuck Processing Table */}
                {metrics.withdrawals.stuck.length > 0 && (
                    <div className="bg-white border border-red-300 rounded-lg overflow-hidden mb-6">
                        <div className="bg-red-50 px-4 py-3 border-b border-red-200">
                            <h3 className="font-semibold text-red-900">
                                Stuck in PROCESSING (&gt;30 min)
                            </h3>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-600">Reference</th>
                                        <th className="px-4 py-2 text-right text-xs font-medium text-gray-600">Amount</th>
                                        <th className="px-4 py-2 text-right text-xs font-medium text-gray-600">Stuck For</th>
                                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-600">Last Updated</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                    {metrics.withdrawals.stuck.map(w => (
                                        <tr key={w.id} className="hover:bg-gray-50">
                                            <td className="px-4 py-3 text-sm font-mono text-gray-900">{w.referenceCode}</td>
                                            <td className="px-4 py-3 text-sm text-right text-gray-900">
                                                ₦{w.amountMajor.toLocaleString()}
                                            </td>
                                            <td className="px-4 py-3 text-sm text-right text-red-600 font-medium">
                                                {formatDuration(w.stuckDuration)}
                                            </td>
                                            <td className="px-4 py-3 text-sm text-gray-600">
                                                {new Date(w.updatedAt).toLocaleString()}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {/* P11.2: Aging Pending Table */}
                {isP112Active && metrics.withdrawals.agingPending && metrics.withdrawals.agingPending.length > 0 && (
                    <div className="bg-white border border-amber-300 rounded-lg overflow-hidden">
                        <div className="bg-amber-50 px-4 py-3 border-b border-amber-200">
                            <h3 className="font-semibold text-amber-900">
                                Aging PENDING (&gt;60 min)
                            </h3>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-600">Reference</th>
                                        <th className="px-4 py-2 text-right text-xs font-medium text-gray-600">Amount</th>
                                        <th className="px-4 py-2 text-right text-xs font-medium text-gray-600">Age</th>
                                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-600">Created At</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                    {metrics.withdrawals.agingPending.map(w => (
                                        <tr key={w.id} className="hover:bg-gray-50">
                                            <td className="px-4 py-3 text-sm font-mono text-gray-900">{w.referenceCode}</td>
                                            <td className="px-4 py-3 text-sm text-right text-gray-900">
                                                ₦{w.amountMajor.toLocaleString()}
                                            </td>
                                            <td className="px-4 py-3 text-sm text-right text-amber-600 font-medium">
                                                {formatDuration(w.stuckDuration)}
                                            </td>
                                            <td className="px-4 py-3 text-sm text-gray-600">
                                                {new Date(w.createdAt).toLocaleString()}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>

            {/* Exports Section */}
            <div className="mb-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                    Exports {isP112Active && <span className="text-sm font-normal text-gray-500 ml-2">(Accurate Tracking)</span>}
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <div className="bg-white border border-gray-200 rounded-lg p-4">
                        <div className="text-sm text-gray-600 mb-1">Created Today</div>
                        <div className="text-2xl font-bold text-gray-900">{metrics.exports.createdToday}</div>
                    </div>
                    <div className="bg-white border border-gray-200 rounded-lg p-4">
                        <div className="text-sm text-gray-600 mb-1">Downloaded</div>
                        {isP112Active ? (
                            <div className="text-2xl font-bold text-gray-900">
                                {metrics.exports.downloadedToday ?? metrics.exports.downloaded}
                                <span className="text-xs font-normal text-gray-500 ml-2 block">
                                    (Verified via correct headers)
                                </span>
                            </div>
                        ) : (
                            <div className="text-2xl font-bold text-gray-900">{metrics.exports.downloaded}</div>
                        )}
                    </div>
                    <div className="bg-white border border-gray-200 rounded-lg p-4">
                        <div className="text-sm text-gray-600 mb-1">Expired Unused</div>
                        <div className="text-2xl font-bold text-amber-600">{metrics.exports.expiredUnused}</div>
                    </div>
                </div>

                {/* Combined Stuck/Expired Exports Table */}
                {(metrics.exports.stuckJobs.length > 0 || (metrics.exports.expiredUnusedRows && metrics.exports.expiredUnusedRows.length > 0)) && (
                    <div className="bg-white border border-amber-300 rounded-lg overflow-hidden">
                        <div className="bg-amber-50 px-4 py-3 border-b border-amber-200">
                            <h3 className="font-semibold text-amber-900">
                                Expired Exports (Never Downloaded)
                            </h3>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-600">Type</th>
                                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-600">Created</th>
                                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-600">Expired</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                    {(isP112Active && metrics.exports.expiredUnusedRows ? metrics.exports.expiredUnusedRows : metrics.exports.stuckJobs).map(e => (
                                        <tr key={e.id} className="hover:bg-gray-50">
                                            <td className="px-4 py-3 text-sm text-gray-900 capitalize">{e.type}</td>
                                            <td className="px-4 py-3 text-sm text-gray-600">
                                                {new Date(e.createdAt).toLocaleString()}
                                            </td>
                                            <td className="px-4 py-3 text-sm text-gray-600">
                                                {new Date(e.expiresAt).toLocaleString()}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>

            {/* Security Section */}
            <div className="mb-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                    Security (Last 24h)
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="bg-white border border-gray-200 rounded-lg p-4">
                        <div className="text-sm text-gray-600 mb-1">Rate Limit Blocks</div>
                        <div className="text-2xl font-bold text-gray-900">{metrics.security.rateLimitBlocks24h}</div>
                    </div>
                    <div className="bg-white border border-gray-200 rounded-lg p-4">
                        <div className="text-sm text-gray-600 mb-1">Step-Up Required</div>
                        <div className="text-2xl font-bold text-gray-900">{metrics.security.stepUpRequired}</div>
                    </div>
                    {/* P11.2 Sudo Stats */}
                    {isP112Active && (
                        <>
                            <div className="bg-white border border-gray-200 rounded-lg p-4">
                                <div className="text-sm text-gray-600 mb-1">Sudo Success</div>
                                <div className="text-2xl font-bold text-green-600">{metrics.security.sudoSuccess24h}</div>
                            </div>
                            <div className="bg-white border border-gray-200 rounded-lg p-4">
                                <div className="text-sm text-gray-600 mb-1">Sudo Failed</div>
                                <div className={`text-2xl font-bold ${metrics.security.sudoFailed24h && metrics.security.sudoFailed24h > 0 ? 'text-red-600' : 'text-gray-900'}`}>
                                    {metrics.security.sudoFailed24h}
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </div>

            {/* P11.2: API Health Section */}
            {isP112Active && metrics.apiHealth && (
                <div className="mb-8">
                    <h2 className="text-xl font-semibold text-gray-900 mb-4">API Health</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Error Counts */}
                        <div className="bg-white border border-gray-200 rounded-lg p-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <div className="text-sm text-gray-600 mb-1">Errors Last 1h</div>
                                    <div className={`text-2xl font-bold ${metrics.apiHealth.errors1h > 0 ? 'text-red-600' : 'text-gray-900'}`}>
                                        {metrics.apiHealth.errors1h}
                                    </div>
                                </div>
                                <div>
                                    <div className="text-sm text-gray-600 mb-1">Errors Last 24h</div>
                                    <div className="text-2xl font-bold text-gray-900">
                                        {metrics.apiHealth.errors24h}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Top Failing Routes */}
                        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                            <div className="px-4 py-2 border-b border-gray-100 bg-gray-50 text-xs font-semibold text-gray-500 uppercase">
                                Top Failing Routes (24h)
                            </div>
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <tbody className="divide-y divide-gray-100">
                                        {metrics.apiHealth.topFailingRoutes.length === 0 ? (
                                            <tr><td className="px-4 py-3 text-sm text-gray-500">No errors recorded.</td></tr>
                                        ) : (
                                            metrics.apiHealth.topFailingRoutes.map((r, i) => (
                                                <tr key={i}>
                                                    <td className="px-4 py-2 text-sm font-mono text-gray-700 truncate max-w-xs" title={r.routeKey}>
                                                        {r.routeKey}
                                                    </td>
                                                    <td className="px-4 py-2 text-sm text-right font-medium text-red-600">
                                                        {r.count}
                                                    </td>
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* P11.2: Integrations Section */}
            {isP112Active && metrics.integrations && (
                <div className="mb-8">
                    <h2 className="text-xl font-semibold text-gray-900 mb-4">Integrations Status</h2>
                    <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                        <table className="w-full">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-600 uppercase">Integration</th>
                                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-600 uppercase">Status</th>
                                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-600 uppercase">Last Success</th>
                                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-600 uppercase">Last Event</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {Object.entries(metrics.integrations).map(([key, data]) => (
                                    <tr key={key} className="hover:bg-gray-50">
                                        <td className="px-4 py-3 text-sm font-medium text-gray-900 capitalize">{key}</td>
                                        <td className="px-4 py-3">
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                                                ${data.status === 'OK' ? 'bg-green-100 text-green-800' :
                                                    data.status === 'FAIL' ? 'bg-red-100 text-red-800' :
                                                        data.status === 'WARNING' ? 'bg-amber-100 text-amber-800' :
                                                            'bg-gray-100 text-gray-800'}`}>
                                                {data.status.replace('_', ' ')}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 text-sm text-gray-500">
                                            {data.lastSuccess ? new Date(data.lastSuccess).toLocaleString() : '-'}
                                        </td>
                                        <td className="px-4 py-3 text-sm text-gray-500">
                                            {data.lastEvent ? new Date(data.lastEvent).toLocaleString() : '-'}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* P11.2: Performance Section */}
            {isP112Active && metrics.performance && (
                <div className="mb-8">
                    <h2 className="text-xl font-semibold text-gray-900 mb-4">Performance <span className="text-sm font-normal text-gray-500">(Instance Local)</span></h2>
                    <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-600 uppercase">Route</th>
                                        <th className="px-4 py-2 text-right text-xs font-medium text-gray-600 uppercase">Max Duration</th>
                                        <th className="px-4 py-2 text-right text-xs font-medium text-gray-600 uppercase">Hits</th>
                                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-600 uppercase">Last Seen</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                    {metrics.performance.slowPaths.length === 0 ? (
                                        <tr><td colSpan={4} className="px-4 py-4 text-sm text-gray-500 text-center">No slow paths detected (&gt;3s) recently.</td></tr>
                                    ) : (
                                        metrics.performance.slowPaths.map((p, i) => (
                                            <tr key={i} className="hover:bg-gray-50">
                                                <td className="px-4 py-3 text-sm font-mono text-gray-700 max-w-md truncate" title={p.routeKey}>{p.routeKey}</td>
                                                <td className="px-4 py-3 text-sm text-right font-medium text-amber-600">{p.maxDuration}ms</td>
                                                <td className="px-4 py-3 text-sm text-right text-gray-600">{p.count}</td>
                                                <td className="px-4 py-3 text-sm text-gray-600">{new Date(p.lastSeen).toLocaleTimeString()}</td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            )}

            {/* Auto-refresh indicator */}
            <div className="text-center text-sm text-gray-500 mt-8 mb-4">
                🔄 Auto-refreshing every minute
            </div>
        </div>
    );
}
