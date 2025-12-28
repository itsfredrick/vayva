'use client';

import React, { useState, useEffect } from 'react';
import { AppShell, GlassPanel, Button, Icon } from '@vayva/ui';

interface Integration {
    id: string;
    name: string;
    status: string;
    account: string | null;
    lastSync: string | null;
}

export default function ConnectedServicesPage() {
    const [integrations, setIntegrations] = useState<Integration[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchIntegrations = async () => {
            try {
                const res = await fetch('/api/account/integrations');
                const data = await res.json();
                setIntegrations(data.integrations || []);
            } catch (error) {
                console.error('Failed to load integrations', error);
            } finally {
                setLoading(false);
            }
        };
        fetchIntegrations();
    }, []);

    if (loading) return <div className="text-white p-8">Loading integrations...</div>;

    return (
        <AppShell sidebar={<></>} header={<></>}>
            <div className="max-w-4xl mx-auto space-y-8 pb-12">
                <div>
                    <h1 className="text-2xl font-bold text-white">Connected Services</h1>
                    <p className="text-text-secondary mt-1">Manage your third-party integrations and API connections.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {integrations.map((integration) => (
                        <GlassPanel key={integration.id} className="p-6 hover:border-primary/30 transition-colors">
                            <div className="flex items-start justify-between mb-4">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-primary/10 rounded-lg text-primary">
                                        <Icon name={getIconForService(integration.id)} size={24} />
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-bold text-white">{integration.name}</h3>
                                        <p className="text-sm text-text-secondary">{integration.account || 'Not connected'}</p>
                                    </div>
                                </div>
                                <div className={`w-2 h-2 rounded-full ${integration.status === 'CONNECTED' ? 'bg-state-success' : 'bg-state-danger'}`}></div>
                            </div>

                            <div className="space-y-2 mb-6">
                                <div className="flex justify-between text-xs">
                                    <span className="text-text-secondary uppercase font-bold">Status</span>
                                    <span className={integration.status === 'CONNECTED' ? 'text-state-success' : 'text-state-danger'}>
                                        {integration.status}
                                    </span>
                                </div>
                                {integration.lastSync && (
                                    <div className="flex justify-between text-xs">
                                        <span className="text-text-secondary uppercase font-bold">Last Sync</span>
                                        <span className="text-white font-mono">{new Date(integration.lastSync).toLocaleString()}</span>
                                    </div>
                                )}
                            </div>

                            <Button variant={integration.status === 'CONNECTED' ? 'outline' : 'primary'} className="w-full">
                                {integration.status === 'CONNECTED' ? 'Manage' : 'Connect'}
                            </Button>
                        </GlassPanel>
                    ))}

                    {/* Placeholder for future integrations */}
                    <GlassPanel className="p-6 border-2 border-dashed border-white/5 bg-transparent flex flex-col items-center justify-center text-center opacity-50">
                        <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center mb-3">
                            <Icon name="Plus" size={24} className="text-text-secondary" />
                        </div>
                        <h3 className="font-bold text-white">Add New Service</h3>
                        <p className="text-xs text-text-secondary mt-1">Connect logistics, marketing or analytics tools.</p>
                    </GlassPanel>
                </div>
            </div>
        </AppShell>
    );
}

function getIconForService(id: string): any {
    switch (id) {
        case 'paystack': return 'CreditCard';
        case 'whatsapp': return 'MessageSquare';
        case 'email': return 'Mail';
        default: return 'Plug';
    }
}
