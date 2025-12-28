'use client';

import React, { useState, useEffect } from 'react';
import {
    AppShell,
    Button,
    GlassPanel,
    Input,
    Icon,
    cn
} from '@vayva/ui';

export default function IntegrationsPage() {
    const [loading, setLoading] = useState(true);
    const [health, setHealth] = useState<any>(null);
    const [checking, setChecking] = useState(false);

    const checkHealth = async () => {
        setChecking(true);
        try {
            const res = await fetch('/api/settings/integrations');
            const data = await res.json();
            setHealth(data);
        } catch (err) {
            console.error(err);
        } finally {
            setChecking(false);
            setLoading(false);
        }
    };

    useEffect(() => {
        checkHealth();
    }, []);

    if (loading) return <div className="p-8 text-white">Checking integration health...</div>;

    const providers = [
        { id: 'whatsapp', name: 'WhatsApp Business', desc: 'Direct order communication with customers.', icon: 'MessageSquare' },
        { id: 'paystack', name: 'Paystack Payment Gateway', desc: 'Accept credit cards and bank transfers.', icon: 'CreditCard' },
        { id: 'email', name: 'Email Delivery (Resend)', desc: 'Transactional store emails and receipts.', icon: 'Mail' as any },
        { id: 'logistics', name: 'Logistics Aggregator', desc: 'Automated delivery booking and tracking.', icon: 'Truck' as any }
    ];

    return (
        <div className="max-w-4xl mx-auto py-8 px-4 space-y-8 animate-in fade-in duration-500">
            <div className="flex justify-between items-end">
                <div>
                    <h1 className="text-3xl font-extrabold text-white">Integrations Health</h1>
                    <p className="text-text-secondary font-medium mt-1">Monitor connectivity of your third-party business tools.</p>
                </div>
                <Button onClick={checkHealth} isLoading={checking} size="sm">Refresh Health</Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {providers.map(p => {
                    const status = (health as any)[p.id]?.status || 'DISCONNECTED';
                    const isOk = status === 'CONNECTED';

                    return (
                        <GlassPanel key={p.id} className="p-6 space-y-4 flex flex-col justify-between group transition-all hover:bg-white/10">
                            <div className="space-y-4">
                                <div className="flex justify-between items-start">
                                    <div className="p-3 bg-white/5 rounded-xl text-white">
                                        <Icon name={p.icon} size={24} />
                                    </div>
                                    <div className={cn(
                                        "px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-widest",
                                        isOk ? "bg-emerald-500/10 text-emerald-500" : "bg-red-500/10 text-red-500"
                                    )}>
                                        {status}
                                    </div>
                                </div>
                                <div>
                                    <h3 className="font-bold text-white text-lg">{p.name}</h3>
                                    <p className="text-xs text-text-secondary line-clamp-2">{p.desc}</p>
                                </div>
                            </div>

                            <div className="pt-4 border-t border-white/5 mt-4">
                                {isOk ? (
                                    <div className="flex justify-between items-center">
                                        <div className="text-[10px] text-text-secondary">Latency: {(health as any)[p.id].latency}</div>
                                        <Button variant="ghost" size="sm">Settings</Button>
                                    </div>
                                ) : (
                                    <Button variant="secondary" size="sm" className="w-full">Reconnect</Button>
                                )}
                            </div>
                        </GlassPanel>
                    );
                })}
            </div>

            <GlassPanel className="p-8 border border-white/5">
                <div className="flex items-center gap-4">
                    <div className="p-4 bg-white/5 rounded-full text-white/50">
                        <Icon name={"PlusCircle" as any} size={32} />
                    </div>
                    <div>
                        <h3 className="font-bold text-white">Marketplace coming soon</h3>
                        <p className="text-sm text-text-secondary">Soon you'll be able to browse and install 50+ business apps directly from Vayva.</p>
                    </div>
                </div>
            </GlassPanel>
        </div>
    );
}
