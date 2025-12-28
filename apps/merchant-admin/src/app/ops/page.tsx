
'use client';

import { useEffect, useState } from 'react';
import { OpsMetrics } from '@/lib/ops-metrics';
import {
    AlertTriangle,
    CheckCircle,
    Clock,
    ShieldAlert,
    Activity,
    Server,
    Database,
    Download,
    RefreshCw
} from 'lucide-react';

export default function OpsDashboard() {
    const [metrics, setMetrics] = useState<OpsMetrics | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [lastUpdated, setLastUpdated] = useState<Date>(new Date());

    useEffect(() => {
        fetchMetrics();
        const interval = setInterval(fetchMetrics, 60000);
        return () => clearInterval(interval);
    }, []);

    const fetchMetrics = async () => {
        try {
            const res = await fetch('/api/ops/metrics');
            if (res.status === 401) {
                window.location.href = '/ops/login';
                return;
            }
            if (!res.ok) throw new Error('Failed to fetch metrics');
            const data = await res.json();
            setMetrics(data); // API returns metrics object directly
            setLastUpdated(new Date());
            setError(null);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const formatDuration = (ms: number) => {
        const minutes = Math.floor(ms / 60000);
        const hours = Math.floor(minutes / 60);
        if (hours > 0) return `${hours}h ${minutes % 60}m`;
        return `${minutes}m`;
    };

    if (loading) return <DashboardSkeleton />;
    if (error) return <DashboardError message={error} onRetry={fetchMetrics} />;
    if (!metrics) return null;

    const stuckCount = metrics.withdrawals.stuck.length +
        metrics.exports.stuckJobs.length +
        (metrics.withdrawals.agingPending?.length || 0);

    const isP112Active = !!metrics.apiHealth;

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex justify-between items-start">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-1">Operations Dashboard</h1>
                    <p className="text-gray-500 flex items-center gap-2">
                        <Activity className="h-4 w-4" />
                        System Health Monitor
                    </p>
                </div>
                <div className="text-right">
                    <div className="text-sm text-gray-500 mb-1">Last Updated</div>
                    <div className="font-mono text-gray-900">{lastUpdated.toLocaleTimeString()}</div>
                </div>
            </div>

            {/* Warnings */}
            <div className="space-y-4">
                {stuckCount > 0 && (
                    <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 flex items-center gap-3 shadow-sm">
                        <AlertTriangle className="h-5 w-5 text-amber-600" />
                        <div>
                            <span className="font-semibold text-amber-900">{stuckCount} stuck operation(s) detected.</span>
                            <span className="text-amber-700 text-sm ml-2">Requires manual review.</span>
                        </div>
                    </div>
                )}
                {isP112Active && metrics.apiHealth && metrics.apiHealth.errors1h > 0 && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center gap-3 shadow-sm animation-pulse">
                        <ShieldAlert className="h-5 w-5 text-red-600" />
                        <div>
                            <span className="font-semibold text-red-900">{metrics.apiHealth.errors1h} API Error(s) in last hour.</span>
                            <span className="text-red-700 text-sm ml-2">Investigate Top Failing Routes below.</span>
                        </div>
                    </div>
                )}
            </div>

            {/* Money Operations */}
            <section>
                <div className="flex items-center gap-2 mb-4">
                    <h2 className="text-xl font-bold text-gray-900">Money Operations</h2>
                    <span className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded text-xs font-mono">Withdrawals</span>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                    {['PENDING', 'PROCESSING', 'PAID', 'FAILED'].map(status => (
                        <Card key={status} label={status} value={metrics.withdrawals.byStatus[status] || 0} />
                    ))}
                </div>

                {/* Stuck Withdrawals Table */}
                {metrics.withdrawals.stuck.length > 0 && (
                    <TableCard title="Stuck in PROCESSING (>30 min)" color="red">
                        <table className="w-full">
                            <thead className="bg-gray-50 sticky top-0">
                                <tr>
                                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Ref</th>
                                    <th className="px-4 py-3 text-right text-xs font-semibold text-gray-500 uppercase">Amount</th>
                                    <th className="px-4 py-3 text-right text-xs font-semibold text-gray-500 uppercase">Duration</th>
                                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Updated</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {metrics.withdrawals.stuck.map(w => (
                                    <tr key={w.id} className="hover:bg-gray-50">
                                        <td className="px-4 py-3 text-sm font-mono">{w.referenceCode}</td>
                                        <td className="px-4 py-3 text-sm text-right">₦{w.amountMajor.toLocaleString()}</td>
                                        <td className="px-4 py-3 text-sm text-right text-red-600 font-medium">{formatDuration(w.stuckDuration)}</td>
                                        <td className="px-4 py-3 text-sm text-gray-500">{new Date(w.updatedAt).toLocaleString()}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </TableCard>
                )}

                {/* Aging Pending Table */}
                {isP112Active && metrics.withdrawals.agingPending && metrics.withdrawals.agingPending.length > 0 && (
                    <TableCard title="Aging PENDING (>60 min)" color="amber">
                        <table className="w-full">
                            <thead className="bg-gray-50 sticky top-0">
                                <tr>
                                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Ref</th>
                                    <th className="px-4 py-3 text-right text-xs font-semibold text-gray-500 uppercase">Amount</th>
                                    <th className="px-4 py-3 text-right text-xs font-semibold text-gray-500 uppercase">Age</th>
                                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Created</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {metrics.withdrawals.agingPending.map(w => (
                                    <tr key={w.id} className="hover:bg-gray-50">
                                        <td className="px-4 py-3 text-sm font-mono">{w.referenceCode}</td>
                                        <td className="px-4 py-3 text-sm text-right">₦{w.amountMajor.toLocaleString()}</td>
                                        <td className="px-4 py-3 text-sm text-right text-amber-600 font-medium">{formatDuration(w.stuckDuration)}</td>
                                        <td className="px-4 py-3 text-sm text-gray-500">{new Date(w.createdAt).toLocaleString()}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </TableCard>
                )}
            </section>

            {/* API Health & Performance */}
            {isP112Active && metrics.apiHealth && metrics.performance && (
                <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div>
                        <div className="flex items-center gap-2 mb-4">
                            <h2 className="text-xl font-bold text-gray-900">API Health</h2>
                            <Server className="h-4 w-4 text-gray-400" />
                        </div>
                        <div className="grid grid-cols-2 gap-4 mb-4">
                            <Card label="Errors 1h" value={metrics.apiHealth.errors1h} color={metrics.apiHealth.errors1h > 0 ? 'red' : 'gray'} />
                            <Card label="Errors 24h" value={metrics.apiHealth.errors24h} />
                        </div>
                        <TableCard title="Top Failing Routes (24h)">
                            <table className="w-full">
                                <thead className="bg-gray-50 sticky top-0">
                                    <tr>
                                        <th className="px-4 py-2 text-left text-xs font-semibold text-gray-500">Route</th>
                                        <th className="px-4 py-2 text-right text-xs font-semibold text-gray-500">Errors</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {metrics.apiHealth.topFailingRoutes.length === 0 ? <EmptyRow cols={2} /> :
                                        metrics.apiHealth.topFailingRoutes.map((r, i) => (
                                            <tr key={i}>
                                                <td className="px-4 py-2 text-sm font-mono text-gray-600 truncate max-w-[200px]" title={r.routeKey}>{r.routeKey}</td>
                                                <td className="px-4 py-2 text-sm text-right text-red-600 font-medium">{r.count}</td>
                                            </tr>
                                        ))
                                    }
                                </tbody>
                            </table>
                        </TableCard>
                    </div>

                    <div>
                        <div className="flex items-center gap-2 mb-4">
                            <h2 className="text-xl font-bold text-gray-900">Performance</h2>
                            <Clock className="h-4 w-4 text-gray-400" />
                        </div>
                        <TableCard title="Slow Paths (>3s) - Instance Local">
                            <table className="w-full">
                                <thead className="bg-gray-50 sticky top-0">
                                    <tr>
                                        <th className="px-4 py-2 text-left text-xs font-semibold text-gray-500">Route</th>
                                        <th className="px-4 py-2 text-right text-xs font-semibold text-gray-500">Max</th>
                                        <th className="px-4 py-2 text-right text-xs font-semibold text-gray-500">Hits</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {metrics.performance.slowPaths.length === 0 ? <EmptyRow cols={3} text="No slow paths detected" /> :
                                        metrics.performance.slowPaths.map((p, i) => (
                                            <tr key={i}>
                                                <td className="px-4 py-2 text-sm font-mono text-gray-600 truncate max-w-[150px]" title={p.routeKey}>{p.routeKey}</td>
                                                <td className="px-4 py-2 text-sm text-right text-amber-600">{p.maxDuration}ms</td>
                                                <td className="px-4 py-2 text-sm text-right text-gray-500">{p.count}</td>
                                            </tr>
                                        ))
                                    }
                                </tbody>
                            </table>
                        </TableCard>
                    </div>
                </section>
            )}

            {/* Exports & Integrations Grid */}
            <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                    <div className="flex items-center gap-2 mb-4">
                        <h2 className="text-xl font-bold text-gray-900">Data Exports</h2>
                        <Download className="h-4 w-4 text-gray-400" />
                    </div>
                    <div className="grid grid-cols-3 gap-3 mb-4">
                        <Card label="Created" value={metrics.exports.createdToday} />
                        <Card
                            label="Downloads"
                            value={metrics.exports.downloadedToday ?? metrics.exports.downloaded}
                            subtext={isP112Active ? "Verified Headers" : undefined}
                        />
                        <Card label="Expired" value={metrics.exports.expiredUnused} color={metrics.exports.expiredUnused > 0 ? 'amber' : 'gray'} />
                    </div>
                    {/* Failed Exports List */}
                    <TableCard title="Expired/Stuck Exports">
                        <table className="w-full">
                            <thead className="bg-gray-50 sticky top-0">
                                <tr>
                                    <th className="px-4 py-2 text-left text-xs font-semibold text-gray-500">Type</th>
                                    <th className="px-4 py-2 text-left text-xs font-semibold text-gray-500">Created</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {(!metrics.exports.stuckJobs.length && (!metrics.exports.expiredUnusedRows?.length)) ? <EmptyRow cols={2} /> :
                                    (metrics.exports.expiredUnusedRows || metrics.exports.stuckJobs).map(e => (
                                        <tr key={e.id}>
                                            <td className="px-4 py-2 text-sm capitalize">{e.type}</td>
                                            <td className="px-4 py-2 text-sm text-gray-500">{new Date(e.createdAt).toLocaleDateString()}</td>
                                        </tr>
                                    ))
                                }
                            </tbody>
                        </table>
                    </TableCard>
                </div>

                {isP112Active && metrics.integrations && (
                    <div>
                        <div className="flex items-center gap-2 mb-4">
                            <h2 className="text-xl font-bold text-gray-900">Integrations</h2>
                            <Activity className="h-4 w-4 text-gray-400" />
                        </div>
                        <TableCard title="Partner Status">
                            <table className="w-full">
                                <thead className="bg-gray-50 sticky top-0">
                                    <tr>
                                        <th className="px-4 py-2 text-left text-xs font-semibold text-gray-500">Service</th>
                                        <th className="px-4 py-2 text-left text-xs font-semibold text-gray-500">Status</th>
                                        <th className="px-4 py-2 text-left text-xs font-semibold text-gray-500">Last Success</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {Object.entries(metrics.integrations).map(([key, data]) => (
                                        <tr key={key}>
                                            <td className="px-4 py-3 text-sm font-medium capitalize">{key}</td>
                                            <td className="px-4 py-3">
                                                <Badge status={data.status} />
                                            </td>
                                            <td className="px-4 py-3 text-sm text-gray-500 text-xs">
                                                {data.lastSuccess ? new Date(data.lastSuccess).toLocaleTimeString() : '-'}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </TableCard>
                    </div>
                )}
            </section>

            {/* Security */}
            <section>
                <div className="flex items-center gap-2 mb-4">
                    <h2 className="text-xl font-bold text-gray-900">Security</h2>
                    <ShieldAlert className="h-4 w-4 text-gray-400" />
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <Card label="Rate Limits (24h)" value={metrics.security.rateLimitBlocks24h} />
                    <Card label="Step-Up Req" value={metrics.security.stepUpRequired} />
                    {isP112Active && (
                        <>
                            <Card label="Sudo Success" value={metrics.security.sudoSuccess24h} color="green" />
                            <Card label="Sudo Failed" value={metrics.security.sudoFailed24h} color={metrics.security.sudoFailed24h && metrics.security.sudoFailed24h > 0 ? 'red' : 'gray'} />
                        </>
                    )}
                </div>
            </section>
        </div>
    );
}

// --- Components ---

function Card({ label, value, subtext, color = 'gray' }: { label: string, value: any, subtext?: string, color?: 'gray' | 'red' | 'amber' | 'green' | 'blue' }) {
    const colors = {
        gray: 'border-gray-200 text-gray-900',
        red: 'border-red-200 text-red-600 bg-red-50',
        amber: 'border-amber-200 text-amber-600 bg-amber-50',
        green: 'border-green-200 text-green-600 bg-green-50',
        blue: 'border-blue-200 text-blue-600 bg-blue-50'
    };

    return (
        <div className={`bg-white border rounded-lg p-4 shadow-sm ${colors[color] ? '' : 'border-gray-200'}`}>
            <div className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">{label}</div>
            <div className={`text-2xl font-bold ${colors[color].split(' ')[1] || 'text-gray-900'}`}>{value}</div>
            {subtext && <div className="text-xs text-gray-400 mt-1">{subtext}</div>}
        </div>
    );
}

function TableCard({ title, children, color = 'gray' }: { title: string, children: React.ReactNode, color?: string }) {
    const borderColor = color === 'red' ? 'border-red-200' : color === 'amber' ? 'border-amber-200' : 'border-gray-200';
    return (
        <div className={`bg-white border ${borderColor} rounded-lg overflow-hidden shadow-sm flex flex-col h-full`}>
            <div className={`px-4 py-3 border-b ${borderColor} bg-gray-50/50`}>
                <h3 className={`font-semibold text-sm ${color === 'red' ? 'text-red-900' : color === 'amber' ? 'text-amber-900' : 'text-gray-900'}`}>
                    {title}
                </h3>
            </div>
            <div className="overflow-x-auto flex-1">
                {children}
            </div>
        </div>
    );
}

function EmptyRow({ cols, text = "Nothing to review right now." }: { cols: number, text?: string }) {
    return (
        <tr>
            <td colSpan={cols} className="px-4 py-8 text-center text-sm text-gray-400 italic">
                {text}
            </td>
        </tr>
    );
}

function Badge({ status }: { status: string }) {
    const styles = {
        OK: 'bg-green-100 text-green-800',
        FAIL: 'bg-red-100 text-red-800',
        WARNING: 'bg-amber-100 text-amber-800',
        UNKNOWN: 'bg-gray-100 text-gray-800'
    };
    const s = styles[status as keyof typeof styles] || styles.UNKNOWN;
    return (
        <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${s}`}>
            {status}
        </span>
    );
}

function DashboardSkeleton() {
    return (
        <div className="space-y-8 animate-pulse">
            <div className="h-12 bg-gray-200 rounded w-1/3"></div>
            <div className="grid grid-cols-4 gap-4">
                {[1, 2, 3, 4].map(i => <div key={i} className="h-24 bg-gray-200 rounded"></div>)}
            </div>
            <div className="h-64 bg-gray-200 rounded"></div>
        </div>
    );
}

function DashboardError({ message, onRetry }: { message: string, onRetry: () => void }) {
    return (
        <div className="p-8 text-center">
            <div className="inline-flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
                <AlertTriangle className="h-6 w-6 text-red-600" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Failed to load dashboard</h3>
            <p className="text-gray-500 mb-4">{message}</p>
            <button onClick={onRetry} className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">
                <RefreshCw className="h-4 w-4" /> Retry
            </button>
        </div>
    );
}
