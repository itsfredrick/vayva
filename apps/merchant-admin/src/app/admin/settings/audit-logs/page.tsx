
'use client';

import React, { useState, useEffect } from 'react';
import {
    ClipboardList,
    Search,
    Filter,
    Download,
    User,
    Shield,
    Activity,
    ChevronLeft,
    ChevronRight,
    FileSpreadsheet
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { toast } from '@/components/ui/use-toast';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from '@/components/ui/select';

export default function AuditLogsPage() {
    const [logs, setLogs] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [typeFilter, setTypeFilter] = useState('ALL');
    const [page, setPage] = useState(1);
    const [isExporting, setIsExporting] = useState(false);

    useEffect(() => {
        fetchLogs();
    }, [page, typeFilter]);

    const fetchLogs = async () => {
        try {
            setIsLoading(true);
            const res = await fetch(`/api/audit?page=${page}&type=${typeFilter}&q=${search}`);
            const data = await res.json();
            setLogs(data.logs || []);
        } catch (error) {
            toast({ title: 'Error', description: 'Failed to fetch audit logs', variant: 'destructive' });
        } finally {
            setIsLoading(false);
        }
    };

    const handleExport = async () => {
        try {
            setIsExporting(true);
            const res = await fetch('/api/exports', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ type: 'audit_logs' })
            });

            if (!res.ok) throw new Error('Export failed');

            toast({
                title: 'Export Started',
                description: 'Your export is being generated. You will be notified when it is ready.',
            });
        } catch (error) {
            toast({ title: 'Error', description: 'Failed to initiate export', variant: 'destructive' });
        } finally {
            setIsExporting(false);
        }
    };

    const getActionColor = (action: string) => {
        if (action.includes('FAILED') || action.includes('BLOCKED')) return 'text-destructive';
        if (action.includes('SUCCESS') || action.includes('CREATED')) return 'text-green-600';
        if (action.includes('UPDATE')) return 'text-blue-600';
        return 'text-foreground';
    };

    return (
        <div className="p-6 max-w-6xl mx-auto space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Audit Logs</h1>
                    <p className="text-muted-foreground mt-1">A transparent record of all sensitive actions on your store.</p>
                </div>
                <Button variant="outline" onClick={handleExport} disabled={isExporting}>
                    <FileSpreadsheet className="w-4 h-4 mr-2" />
                    {isExporting ? 'Exporting...' : 'Export to CSV'}
                </Button>
            </div>

            <Card className="p-4 bg-muted/30 border-dashed">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="md:col-span-2 relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input
                            className="pl-10"
                            placeholder="Search by action, actor, or entity..."
                            value={search}
                            onChange={(e: any) => setSearch(e.target.value)}
                            onKeyDown={(e: any) => e.key === 'Enter' && fetchLogs()}
                        />
                    </div>
                    <Select value={typeFilter} onValueChange={setTypeFilter}>
                        <SelectTrigger>
                            <SelectValue placeholder="All Event Types" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="ALL">All Event Types</SelectItem>
                            <SelectItem value="LOGIN">Logins</SelectItem>
                            <SelectItem value="PAYOUT">Payouts & Withdrawals</SelectItem>
                            <SelectItem value="TEAM">Team & Roles</SelectItem>
                            <SelectItem value="SETTINGS">Settings Changes</SelectItem>
                        </SelectContent>
                    </Select>
                    <Button variant="secondary" onClick={fetchLogs}>
                        <Filter className="w-4 h-4 mr-2" /> Apply Filters
                    </Button>
                </div>
            </Card>

            <div className="border rounded-xl overflow-hidden bg-card">
                <table className="w-full text-sm">
                    <thead className="bg-muted/50 border-b">
                        <tr>
                            <th className="text-left p-4 font-semibold">Action</th>
                            <th className="text-left p-4 font-semibold">Actor</th>
                            <th className="text-left p-4 font-semibold">Entity</th>
                            <th className="text-left p-4 font-semibold">IP Address</th>
                            <th className="text-left p-4 font-semibold">Timestamp</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y">
                        {isLoading ? (
                            [1, 2, 3, 4, 5].map(i => (
                                <tr key={i} className="animate-pulse">
                                    <td colSpan={5} className="p-4"><div className="h-4 bg-muted rounded w-full" /></td>
                                </tr>
                            ))
                        ) : logs.length === 0 ? (
                            <tr>
                                <td colSpan={5} className="p-12 text-center text-muted-foreground">
                                    <Activity className="w-12 h-12 mx-auto mb-4 opacity-20" />
                                    No audit logs found matching your criteria.
                                </td>
                            </tr>
                        ) : (
                            logs.map((log) => (
                                <tr key={log.id} className="hover:bg-muted/5 transition-colors">
                                    <td className="p-4">
                                        <div className={`font-mono text-xs font-bold uppercase ${getActionColor(log.action)}`}>
                                            {log.action.replace(/_/g, ' ')}
                                        </div>
                                    </td>
                                    <td className="p-4">
                                        <div className="flex items-center gap-2">
                                            <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-[10px] text-primary font-bold">
                                                {log.actorLabel.charAt(0)}
                                            </div>
                                            <span>{log.actorLabel}</span>
                                        </div>
                                    </td>
                                    <td className="p-4">
                                        {log.entityType ? (
                                            <div className="flex flex-col">
                                                <span className="text-xs font-medium text-muted-foreground uppercase tracking-tighter">{log.entityType}</span>
                                                <span className="font-mono text-[10px] opacity-70">{log.entityId?.slice(0, 8)}...</span>
                                            </div>
                                        ) : '-'}
                                    </td>
                                    <td className="p-4 font-mono text-xs text-muted-foreground">
                                        {log.ipAddress || 'unknown'}
                                    </td>
                                    <td className="p-4 text-muted-foreground whitespace-nowrap">
                                        {new Date(log.createdAt).toLocaleString()}
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            <div className="flex justify-between items-center">
                <p className="text-sm text-muted-foreground">Showing latest activity</p>
                <div className="flex gap-2">
                    <Button
                        variant="outline"
                        size="sm"
                        disabled={page === 1}
                        onClick={() => setPage(p => p - 1)}
                    >
                        <ChevronLeft className="w-4 h-4 mr-1" /> Previous
                    </Button>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setPage(p => p + 1)}
                        disabled={logs.length < 20}
                    >
                        Next <ChevronRight className="w-4 h-4 ml-1" />
                    </Button>
                </div>
            </div>
        </div>
    );
}
