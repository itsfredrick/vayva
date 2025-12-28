
'use client';

import React, { useState, useEffect } from 'react';
import {
    FileSpreadsheet,
    Download,
    Clock,
    AlertCircle,
    Search,
    CheckCircle2,
    XCircle,
    RefreshCw,
    Trash2,
    ChevronRight
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { toast } from '@/components/ui/use-toast';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from '@/components/ui/select';

export default function ExportsPage() {
    const [jobs, setJobs] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [exportType, setExportType] = useState('orders');
    const [isRequesting, setIsRequesting] = useState(false);

    useEffect(() => {
        fetchJobs();
        const interval = setInterval(fetchJobs, 10000); // Polling every 10s
        return () => clearInterval(interval);
    }, []);

    const fetchJobs = async () => {
        try {
            const res = await fetch('/api/exports');
            const data = await res.json();
            setJobs(data.jobs || []);
        } catch (error) {
            console.error('Failed to fetch export jobs');
        } finally {
            setIsLoading(false);
        }
    };

    const handleRequestExport = async () => {
        try {
            setIsRequesting(true);
            const res = await fetch('/api/exports', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ type: exportType })
            });

            if (!res.ok) throw new Error('Export request failed');

            toast({
                title: 'Export Requested',
                description: 'Your export is being prepared. It will appear in the list below shortly.',
            });
            fetchJobs();
        } catch (error) {
            toast({ title: 'Error', description: 'Failed to request export', variant: 'destructive' });
        } finally {
            setIsRequesting(false);
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'COMPLETED': return <CheckCircle2 className="w-4 h-4 text-green-500" />;
            case 'FAILED': return <XCircle className="w-4 h-4 text-red-500" />;
            case 'PROCESSING': return <RefreshCw className="w-4 h-4 text-blue-500 animate-spin" />;
            default: return <Clock className="w-4 h-4 text-muted-foreground" />;
        }
    };

    return (
        <div className="p-6 max-w-5xl mx-auto space-y-8">
            <div className="flex justify-between items-end">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Data Export Center</h1>
                    <p className="text-muted-foreground mt-1">Export your store data to CSV for external reporting and backups.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <Card className="p-6 space-y-6">
                    <div className="space-y-2">
                        <label className="text-sm font-semibold flex items-center gap-2 text-primary">
                            <FileSpreadsheet className="w-4 h-4" /> New Export
                        </label>
                        <p className="text-xs text-muted-foreground">Select the dataset you wish to export. Large datasets may take a few minutes.</p>
                    </div>

                    <div className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest">Dataset</label>
                            <Select value={exportType} onValueChange={setExportType}>
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="orders">Orders (All Time)</SelectItem>
                                    <SelectItem value="customers">Customers</SelectItem>
                                    <SelectItem value="payouts">Payout History</SelectItem>
                                    <SelectItem value="audit_logs">Audit Logs</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <Button className="w-full h-11 transition-all hover:scale-[1.02]" onClick={handleRequestExport} disabled={isRequesting}>
                            {isRequesting ? 'Requesting...' : 'Generate CSV'}
                        </Button>
                    </div>

                    <div className="p-4 bg-blue-50/50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-900 rounded-lg">
                        <div className="flex gap-2">
                            <AlertCircle className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                            <p className="text-[10px] text-blue-700 dark:text-blue-400 font-medium leading-relaxed">
                                Exports are automatically deleted after 7 days for security. Ensure you download important reports promptly.
                            </p>
                        </div>
                    </div>
                </Card>

                <div className="md:col-span-2 space-y-4">
                    <h2 className="text-lg font-bold flex items-center gap-2">
                        <Clock className="w-5 h-5 text-muted-foreground" /> Recent Exports
                    </h2>

                    <div className="space-y-3">
                        {isLoading ? (
                            [1, 2, 3].map(i => <div key={i} className="h-20 bg-muted rounded-xl animate-pulse" />)
                        ) : jobs.length === 0 ? (
                            <div className="p-20 border-2 border-dashed rounded-2xl flex flex-col items-center justify-center text-muted-foreground bg-muted/5">
                                <FileSpreadsheet className="w-12 h-12 mb-4 opacity-10" />
                                <p className="text-sm font-medium">No exports requested yet.</p>
                            </div>
                        ) : (
                            jobs.map((job) => (
                                <div key={job.id} className="flex items-center justify-between p-4 border rounded-xl bg-card hover:border-primary/30 transition-all group">
                                    <div className="flex items-center gap-4">
                                        <div className={`p-2 rounded-lg ${job.status === 'COMPLETED' ? 'bg-green-50 text-green-600' :
                                            job.status === 'FAILED' ? 'bg-red-50 text-red-600' :
                                                'bg-blue-50 text-blue-600'
                                            }`}>
                                            <FileSpreadsheet className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <div className="font-bold text-sm capitalize">{job.type.replace(/_/g, ' ')} Export</div>
                                            <div className="flex items-center gap-3 text-[10px] text-muted-foreground font-medium">
                                                <span className="flex items-center gap-1">{getStatusIcon(job.status)} {job.status}</span>
                                                <span className="w-1 h-1 rounded-full bg-border" />
                                                <span>{new Date(job.createdAt).toLocaleDateString()} at {new Date(job.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        {job.status === 'COMPLETED' ? (
                                            <Button size="sm" variant="primary" className="h-8 gap-2 px-4 shadow-sm" asChild>
                                                <a href={job.fileUrl} download>
                                                    <Download className="w-3.5 h-3.5" /> Download
                                                </a>
                                            </Button>
                                        ) : job.status === 'FAILED' ? (
                                            <div className="text-[10px] text-red-500 font-bold mr-4">RETRY LATER</div>
                                        ) : (
                                            <div className="text-[10px] font-bold text-blue-600 animate-pulse mr-4">PROCESSING</div>
                                        )}
                                        <Button size="icon" variant="ghost" className="h-8 w-8 text-muted-foreground hover:text-destructive transition-colors">
                                            <Trash2 className="w-4 h-4" />
                                        </Button>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
