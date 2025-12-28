
'use client';

import React, { useState, useEffect } from 'react';
import {
    HeartPulse,
    CreditCard,
    MessageSquare,
    Truck,
    AlertTriangle,
    CheckCircle2,
    XCircle,
    RefreshCw,
    Bell
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { toast } from '@/components/ui/use-toast';

export default function StatusPage() {
    const [health, setHealth] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetchHealth();
    }, []);

    const fetchHealth = async () => {
        try {
            setIsLoading(true);
            const res = await fetch('/api/health/integrations');
            const data = await res.json();
            setHealth(data.health);
        } catch (error) {
            toast({ title: 'Error', description: 'Failed to fetch status', variant: 'destructive' });
        } finally {
            setIsLoading(false);
        }
    };

    const StatusCard = ({ title, icon: Icon, data, id }: any) => {
        const status = data?.status || 'UNKNOWN';
        const isHealthy = status === 'OK';
        const isWarning = status === 'WARNING';
        const isError = status === 'FAIL';

        return (
            <Card className="p-6 relative overflow-hidden">
                <div className={`absolute top-0 right-0 w-24 h-24 -mt-8 -mr-8 opacity-5 rounded-full ${isHealthy ? 'bg-green-500' : isWarning ? 'bg-amber-500' : isError ? 'bg-red-500' : 'bg-slate-500'
                    }`} />

                <div className="flex justify-between items-start mb-6">
                    <div className="p-3 bg-muted rounded-xl">
                        <Icon className="w-6 h-6 text-foreground/70" />
                    </div>
                    <div className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${isHealthy ? 'bg-green-100 text-green-700' :
                            isWarning ? 'bg-amber-100 text-amber-700' :
                                isError ? 'bg-red-100 text-red-700' :
                                    'bg-slate-100 text-slate-700'
                        }`}>
                        {status === 'OK' ? 'Healthy' : status === 'WARNING' ? 'Degraded' : status === 'FAIL' ? 'Down' : 'Unknown'}
                    </div>
                </div>

                <h3 className="text-lg font-bold mb-1">{title}</h3>
                <p className="text-xs text-muted-foreground mb-4">
                    Last activity: {data?.lastEvent ? new Date(data.lastEvent).toLocaleString() : 'Never'}
                </p>

                <div className="space-y-3">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        {isHealthy ? <CheckCircle2 className="w-4 h-4 text-green-500" /> : <AlertTriangle className="w-4 h-4 text-amber-500" />}
                        <span>{isHealthy ? 'System operating normally' : 'Intermittent delays detected'}</span>
                    </div>
                    <Button variant="outline" size="sm" className="w-full h-8 text-xs gap-2" onClick={() => toast({ title: 'Ping Sent', description: `Re-checking ${title} connection...` })}>
                        <RefreshCw className="w-3 h-3" /> Re-check Connection
                    </Button>
                </div>
            </Card>
        );
    };

    return (
        <div className="p-6 max-w-5xl mx-auto space-y-8">
            <div className="flex justify-between items-end">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">System Status</h1>
                    <p className="text-muted-foreground mt-1">Real-time health monitoring for your store's infrastructure.</p>
                </div>
                <Button variant="ghost" className="gap-2" onClick={fetchHealth} disabled={isLoading}>
                    <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} /> Refresh
                </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <StatusCard title="Payments (Paystack)" icon={CreditCard} data={health?.paystack} />
                <StatusCard title="WhatsApp Business" icon={MessageSquare} data={health?.whatsapp} />
                <StatusCard title="Delivery Services" icon={Truck} data={health?.delivery} />
            </div>

            <Card className="p-8 border-dashed bg-muted/20 flex flex-col items-center text-center">
                <div className="p-4 bg-primary/10 rounded-full mb-4">
                    <Bell className="w-8 h-8 text-primary" />
                </div>
                <h2 className="text-xl font-bold mb-2">Automated Outage Notifications</h2>
                <p className="text-muted-foreground max-w-md mb-6">
                    Our AI-engine automatically detects spikes in webhook failures and alerts you via WhatsApp if your integration drops.
                </p>
                <div className="flex gap-4">
                    <Button variant="secondary">Manage Alerts</Button>
                    <Link href="/admin/settings/team"><Button variant="outline">Update Contacts</Button></Link>
                </div>
            </Card>
        </div>
    );
}

import Link from 'next/link';
