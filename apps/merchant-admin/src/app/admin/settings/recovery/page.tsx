
'use client';

import React, { useState } from 'react';
import {
    Wrench,
    RefreshCcw,
    UserCog,
    ShieldAlert,
    History,
    AlertTriangle,
    ArrowRight,
    CheckCircle2,
    Lock
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { toast } from '@/components/ui/use-toast';

export default function RecoveryToolsPage() {
    const [isSyncing, setIsSyncing] = useState(false);
    const [isFixing, setIsFixing] = useState(false);

    const handleWebhookSync = async () => {
        try {
            setIsSyncing(true);
            const res = await fetch('/api/recovery/webhook-sync', { method: 'POST' });
            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.error || 'Sync failed');
            }
            toast({ title: 'Success', description: 'Webhook synchronization initiated.' });
        } catch (error: any) {
            toast({ title: 'Rate Limit', description: error.message, variant: 'destructive' });
        } finally {
            setIsSyncing(false);
        }
    };

    const handleFixPerms = async () => {
        try {
            setIsFixing(true);
            const res = await fetch('/api/recovery/fix-perms', { method: 'POST' });
            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.error || 'Repair failed');
            }
            toast({ title: 'Success', description: 'Permissions repaired successfully. Please refresh.' });
        } catch (error: any) {
            toast({ title: 'Error', description: error.message, variant: 'destructive' });
        } finally {
            setIsFixing(false);
        }
    };

    return (
        <div className="p-6 max-w-4xl mx-auto space-y-8">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Recovery Tools</h1>
                <p className="text-muted-foreground mt-1">Self-serve utilities to resolve common account and integration issues.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="p-6 space-y-4 border-l-4 border-l-primary">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-primary/10 rounded-lg">
                            <RefreshCcw className="w-5 h-5 text-primary" />
                        </div>
                        <h2 className="text-lg font-bold">Sync Missing Webhooks</h2>
                    </div>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                        If an order is paid but stuck on "Pending", use this tool to re-scan payment providers for unprocessed webhooks from the last 24 hours.
                    </p>
                    <div className="pt-2 flex flex-col gap-2">
                        <div className="flex items-center gap-2 text-[10px] text-muted-foreground mb-2">
                            <Lock className="w-3 h-3" /> Rate limited to 1 call per hour
                        </div>
                        <Button className="w-full h-10 gap-2" variant="outline" onClick={handleWebhookSync} disabled={isSyncing}>
                            {isSyncing ? <RefreshCcw className="w-4 h-4 animate-spin" /> : <ArrowRight className="w-4 h-4" />}
                            Run Webhook Sync
                        </Button>
                    </div>
                </Card>

                <Card className="p-6 space-y-4 border-l-4 border-l-amber-500">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-amber-500/10 rounded-lg">
                            <UserCog className="w-5 h-5 text-amber-600" />
                        </div>
                        <h2 className="text-lg font-bold">Repair Permissions</h2>
                    </div>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                        Experiencing "Forbidden" errors when accessing pages you should have access to? This will reset your role-to-store linkage.
                    </p>
                    <div className="pt-2">
                        <Button className="w-full h-10 gap-2" variant="outline" onClick={handleFixPerms} disabled={isFixing}>
                            {isFixing ? <RefreshCcw className="w-4 h-4 animate-spin" /> : <ArrowRight className="w-4 h-4" />}
                            Fix Account Link
                        </Button>
                    </div>
                </Card>
            </div>

            <Card className="p-6 bg-amber-50/50 dark:bg-amber-950/20 border-amber-200 dark:border-amber-900">
                <div className="flex gap-4">
                    <ShieldAlert className="w-8 h-8 text-amber-600 shrink-0" />
                    <div>
                        <h3 className="font-bold text-lg mb-1">Safety First</h3>
                        <p className="text-sm text-amber-700 dark:text-amber-400 mb-4 leading-relaxed">
                            These tools perform real mutations on your account state. Use them only when directed by support or when you observe specific desync issues. All recovery actions are logged in your <a href="/admin/settings/audit-logs" className="underline font-bold">Audit History</a>.
                        </p>
                        <div className="flex items-center gap-6">
                            <div className="flex items-center gap-2 text-xs font-medium">
                                <CheckCircle2 className="w-4 h-4 text-green-600" /> Audited Action
                            </div>
                            <div className="flex items-center gap-2 text-xs font-medium">
                                <CheckCircle2 className="w-4 h-4 text-green-600" /> Rate Limited
                            </div>
                        </div>
                    </div>
                </div>
            </Card>

            <div className="text-center">
                <Button variant="ghost" className="text-muted-foreground text-xs gap-2" asChild>
                    <a href="https://docs.vayva.com/recovery" target="_blank">
                        Learn how these tools work <ArrowRight className="w-3 h-3" />
                    </a>
                </Button>
            </div>
        </div>
    );
}

import Link from 'next/link';
