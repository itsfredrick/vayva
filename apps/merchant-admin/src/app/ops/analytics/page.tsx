'use client';

import { useEffect, useState } from 'react';
import { Icon } from '@vayva/ui'; // Assuming Icon is available as per previous files
// Fallback for Icon if not valid import: just use text or svg
// I'll assume usage like other files: <Icon name="BarChart" />

export default function OnboardingAnalyticsPage() {
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchAnalytics();
    }, []);

    const fetchAnalytics = async () => {
        try {
            const res = await fetch('/api/analytics/onboarding/summary');
            if (!res.ok) throw new Error('Failed to fetch data');
            const json = await res.json();
            setData(json);
        } catch (e) {
            setError('Could not load analytics data');
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div className="p-8">Loading analytics...</div>;
    if (error) return <div className="p-8 text-red-600">{error}</div>;

    const { overview, byTemplate, byPlan, byStep, fastPathStats } = data;

    // Helper for colors
    const getRateColor = (rate: number) => {
        if (rate > 0.5) return 'text-green-600';
        if (rate > 0.2) return 'text-yellow-600';
        return 'text-red-600';
    };

    return (
        <div className="p-8 max-w-7xl mx-auto space-y-8">
            <header className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Onboarding Analytics</h1>
                    <p className="text-sm text-gray-500">Real-time funnel performance (Last 30 Days)</p>
                </div>
                <button
                    onClick={fetchAnalytics}
                    className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50"
                >
                    Refresh
                </button>
            </header>

            {/* Overview Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <OverviewCard title="Started" value={overview.started} icon="Users" />
                <OverviewCard title="Completed" value={overview.completed} icon="CheckCircle" />
                <OverviewCard
                    title="Conversion Rate"
                    value={`${(overview.rate * 100).toFixed(1)}%`}
                    icon="TrendingUp"
                    valueClassName={getRateColor(overview.rate)}
                />
                <OverviewCard
                    title="Fast Path Usage"
                    value={`${(fastPathStats.percentFastPath * 100).toFixed(1)}%`}
                    subtext={`${fastPathStats.fastPathCompletes} vs ${fastPathStats.normalCompletes}`}
                    icon="Zap"
                    valueClassName="text-purple-600"
                />
            </div>

            {/* Templates Performance */}
            <section className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
                <div className="p-6 border-b border-gray-200">
                    <h2 className="text-lg font-semibold text-gray-900">Template Performance</h2>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 font-medium text-gray-500">Template</th>
                                <th className="px-6 py-3 font-medium text-gray-500 text-right">Started</th>
                                <th className="px-6 py-3 font-medium text-gray-500 text-right">Completed</th>
                                <th className="px-6 py-3 font-medium text-gray-500 text-right">Conversion</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {byTemplate.map((t: any) => (
                                <tr key={t.slug} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 font-medium text-gray-900">{t.slug}</td>
                                    <td className="px-6 py-4 text-gray-600 text-right">{t.started}</td>
                                    <td className="px-6 py-4 text-gray-600 text-right">{t.completed}</td>
                                    <td className={`px-6 py-4 font-bold text-right ${getRateColor(t.rate)}`}>
                                        {(t.rate * 100).toFixed(1)}%
                                    </td>
                                </tr>
                            ))}
                            {byTemplate.length === 0 && (
                                <tr>
                                    <td colSpan={4} className="px-6 py-8 text-center text-gray-500">No template data yet</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </section>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Steps / Dropoff */}
                <section className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
                    <div className="p-6 border-b border-gray-200">
                        <h2 className="text-lg font-semibold text-gray-900">Step Retention Heatmap</h2>
                    </div>
                    <div className="p-6 space-y-4">
                        {byStep.map((s: any, i: number) => {
                            const maxViews = byStep[0]?.views || 1;
                            const percent = (s.views / maxViews) * 100;
                            // Approximate dropoff from previous step
                            const prevViews = i > 0 ? byStep[i - 1].views : s.views;
                            const dropoff = i > 0 ? ((prevViews - s.views) / prevViews) : 0;

                            return (
                                <div key={s.step} className="space-y-1">
                                    <div className="flex justify-between text-sm">
                                        <span className="font-medium text-gray-700 capitalize">{s.step.replace(/-/g, ' ')}</span>
                                        <div className="flex gap-4">
                                            <span className="text-gray-900">{s.views} views</span>
                                            {i > 0 && dropoff > 0.05 && (
                                                <span className="text-red-500 font-medium">-{Math.round(dropoff * 100)}% drop</span>
                                            )}
                                        </div>
                                    </div>
                                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                                        <div
                                            className={`h-full rounded-full ${i === 0 ? 'bg-blue-500' : 'bg-gray-400'}`}
                                            style={{ width: `${percent}%` }}
                                        />
                                    </div>
                                </div>
                            );
                        })}
                        {byStep.length === 0 && <p className="text-gray-500">No step data recorded yet.</p>}
                    </div>
                </section>

                {/* Plans & Alerts */}
                <div className="space-y-8">
                    <section className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
                        <div className="p-6 border-b border-gray-200">
                            <h2 className="text-lg font-semibold text-gray-900">Conversion by Plan</h2>
                        </div>
                        <div className="p-6 space-y-4">
                            {byPlan.map((p: any) => (
                                <div key={p.plan} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                                    <div className="capitalize font-medium text-gray-900">{p.plan}</div>
                                    <div className="flex items-center gap-6">
                                        <div className="text-sm text-gray-500">
                                            {p.completed} / {p.started}
                                        </div>
                                        <div className={`font-bold ${getRateColor(p.rate)}`}>
                                            {(p.rate * 100).toFixed(1)}%
                                        </div>
                                    </div>
                                </div>
                            ))}
                            {byPlan.length === 0 && <p className="text-gray-500">No plan data yet.</p>}
                        </div>
                    </section>

                    <section className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
                        <div className="p-6 border-b border-gray-200 flex items-center gap-2">
                            <h2 className="text-lg font-semibold text-gray-900">System Alerts</h2>
                            {overview.rate < 0.1 && overview.started > 10 && (
                                <span className="px-2 py-0.5 bg-red-100 text-red-700 text-xs font-bold rounded-full">CRITICAL</span>
                            )}
                        </div>
                        <div className="p-6">
                            {overview.rate < 0.1 && overview.started > 10 ? (
                                <div className="p-4 bg-red-50 text-red-700 rounded-lg text-sm">
                                    <strong>Alert:</strong> Overall conversion is critically low ({(overview.rate * 100).toFixed(1)}%). Check for blockers.
                                </div>
                            ) : (
                                <div className="flex items-center gap-2 text-green-700 p-4 bg-green-50 rounded-lg text-sm">
                                    <span className="text-lg">✅</span>
                                    <span>System healthy. No anomalies detected.</span>
                                </div>
                            )}
                        </div>
                    </section>
                </div>
            </div>
        </div>
    );
}

function OverviewCard({ title, value, subtext, icon, valueClassName = "text-gray-900" }: any) {
    return (
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex flex-col">
            <span className="text-sm font-medium text-gray-500 mb-2">{title}</span>
            <span className={`text-3xl font-bold ${valueClassName}`}>{value}</span>
            {subtext && <span className="text-xs text-gray-400 mt-1">{subtext}</span>}
        </div>
    );
}
