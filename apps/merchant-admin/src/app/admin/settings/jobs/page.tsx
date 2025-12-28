
'use client';

import React, { useState, useEffect } from 'react';
import {
    Cpu,
    Terminal,
    Clock,
    Zap,
    Settings,
    Activity,
    AlertCircle,
    CheckCircle2,
    XCircle,
    RefreshCw,
    Search
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';

export default function BackgroundJobsPage() {
    const [jobs, setJobs] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [search, setSearch] = useState('');

    useEffect(() => {
        fetchJobs();
        const interval = setInterval(fetchJobs, 15000); // 15s polling
        return () => clearInterval(interval);
    }, []);

    const fetchJobs = async () => {
        try {
            const res = await fetch(`/api/jobs?q=${search}`);
            const data = await res.json();
            setJobs(data.jobs || []);
        } catch (error) {
            console.error('Jobs fetch error');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="p-6 max-w-5xl mx-auto space-y-8">
            <div className="flex justify-between items-end">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Background Task Monitor</h1>
                    <p className="text-muted-foreground mt-1">Real-time visibility into asynchronous operations and automated workflows.</p>
                </div>
            </div>

            <Card className="p-4 bg-muted/20 border-dashed flex gap-4">
                <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                        className="pl-10"
                        placeholder="Filter by job name or error type..."
                        value={search}
                        onChange={(e: any) => setSearch(e.target.value)}
                        onKeyDown={(e: any) => e.key === 'Enter' && fetchJobs()}
                    />
                </div>
                <Button variant="outline" onClick={fetchJobs}>Refresh</Button>
            </Card>

            <div className="space-y-4">
                {isLoading ? (
                    [1, 2, 3].map(i => <div key={i} className="h-16 bg-muted animate-pulse rounded-lg" />)
                ) : jobs.length === 0 ? (
                    <div className="p-12 border-2 border-dashed rounded-2xl flex flex-col items-center justify-center text-muted-foreground">
                        <Terminal className="w-12 h-12 mb-4 opacity-10" />
                        <p className="text-sm">No active or recent background jobs found.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 gap-2">
                        {jobs.map((job) => (
                            <div key={job.id} className="flex items-center justify-between p-4 border rounded-xl bg-card hover:bg-muted/5 transition-colors">
                                <div className="flex items-center gap-4">
                                    <div className={`p-2 rounded-lg ${job.status === 'COMPLETED' ? 'bg-green-50 text-green-600' :
                                        job.status === 'FAILED' ? 'bg-red-50 text-red-600' :
                                            'bg-blue-50 text-blue-600'
                                        }`}>
                                        <Activity className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <div className="font-bold text-sm">{job.jobName}</div>
                                        <div className="flex items-center gap-3 text-[10px] text-muted-foreground font-medium">
                                            <span className="flex items-center gap-1 uppercase tracking-tighter">
                                                {job.status === 'COMPLETED' && <CheckCircle2 className="w-3 h-3 text-green-500" />}
                                                {job.status === 'FAILED' && <XCircle className="w-3 h-3 text-red-500" />}
                                                {job.status}
                                            </span>
                                            <span className="w-1 h-1 rounded-full bg-border" />
                                            <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {job.duration?.toFixed(2)}ms</span>
                                            <span className="w-1 h-1 rounded-full bg-border" />
                                            <span>{new Date(job.startedAt).toLocaleString()}</span>
                                        </div>
                                    </div>
                                </div>

                                {job.status === 'FAILED' && job.errorType && (
                                    <div className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-[10px] font-bold">
                                        {job.errorType}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <Card className="p-6 bg-slate-900 text-slate-100">
                <div className="flex gap-4">
                    <Terminal className="w-6 h-6 text-green-400 shrink-0" />
                    <div className="space-y-1">
                        <h3 className="font-bold">Operational Context</h3>
                        <p className="text-xs text-slate-400 leading-relaxed">
                            Vayva utilizes a distributed worker cluster for high-volume tasks. Most jobs complete in under 500ms. If you see persistent failures, check the <a href="/admin/status" className="text-green-400 hover:underline">System Status</a> for infrastructure alerts.
                        </p>
                    </div>
                </div>
            </Card>
        </div>
    );
}
