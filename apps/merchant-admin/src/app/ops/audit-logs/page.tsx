
'use client';

import React, { useState, useEffect } from 'react';
import {
    History,
    Search,
    Filter,
    Eye,
    ArrowLeft,
    Server,
    User,
    Activity
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { toast } from '../../../components/ui/use-toast';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from '../../../components/ui/select';
import Link from 'next/link';

export default function OpsAuditLogsPage() {
    const [logs, setLogs] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [page, setPage] = useState(1);

    useEffect(() => {
        fetchLogs();
    }, [page]);

    const fetchLogs = async () => {
        try {
            setIsLoading(true);
            const res = await fetch(`/api/ops/audit?page=${page}&q=${search}`);
            const data = await res.json();
            setLogs(data.logs || []);
        } catch (error) {
            toast({ title: 'Error', description: 'Failed to fetch global logs', variant: 'destructive' });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="p-8 space-y-6">
            <div className="flex items-center gap-4 mb-4">
                <Link href="/ops">
                    <Button variant="ghost" size="icon"><ArrowLeft className="w-5 h-5" /></Button>
                </Link>
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">System Audit Explorer</h1>
                    <p className="text-muted-foreground mt-1">Global activity monitor across all merchants and operations.</p>
                </div>
            </div>

            <Card className="p-4 flex gap-4">
                <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                        className="pl-10"
                        placeholder="Search global logs..."
                        value={search}
                        onChange={(e: any) => setSearch(e.target.value)}
                        onKeyDown={(e: any) => e.key === 'Enter' && fetchLogs()}
                    />
                </div>
                <Button onClick={fetchLogs}>Search</Button>
            </Card>

            <div className="border rounded-xl overflow-hidden bg-white shadow-sm">
                <table className="w-full text-sm">
                    <thead className="bg-slate-50 border-b">
                        <tr>
                            <th className="text-left p-4 font-semibold">Store ID</th>
                            <th className="text-left p-4 font-semibold">Action</th>
                            <th className="text-left p-4 font-semibold">Actor</th>
                            <th className="text-left p-4 font-semibold">Timestamp</th>
                            <th className="text-right p-4 font-semibold">Trace</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y">
                        {isLoading ? (
                            [1, 2, 3, 4, 5].map(i => (
                                <tr key={i} className="animate-pulse">
                                    <td colSpan={5} className="p-4"><div className="h-4 bg-slate-100 rounded w-full" /></td>
                                </tr>
                            ))
                        ) : (
                            logs.map((log) => (
                                <tr key={log.id} className="hover:bg-slate-50 transition-colors">
                                    <td className="p-4 font-mono text-xs text-blue-600">
                                        <Link href={`/ops/merchants/${log.storeId}`} className="hover:underline">
                                            {log.storeId?.slice(0, 8) || 'SYSTEM'}
                                        </Link>
                                    </td>
                                    <td className="p-4">
                                        <div className="font-semibold text-slate-700">{log.action}</div>
                                    </td>
                                    <td className="p-4">
                                        <span className="text-xs px-2 py-0.5 rounded bg-slate-100 text-slate-600 mr-2">{log.actorType}</span>
                                        {log.actorLabel}
                                    </td>
                                    <td className="p-4 text-slate-400">
                                        {new Date(log.createdAt).toLocaleString()}
                                    </td>
                                    <td className="p-4 text-right">
                                        <Button variant="ghost" size="sm" title="View Trace Data">
                                            <Eye className="w-4 h-4" />
                                        </Button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
