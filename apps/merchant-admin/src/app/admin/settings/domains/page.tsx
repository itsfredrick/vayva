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

export default function DomainSettingsPage() {
    const [loading, setLoading] = useState(true);
    const [mapping, setMapping] = useState<any>(null);
    const [domainInput, setDomainInput] = useState('');
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        fetch('/api/settings/domains')
            .then(res => res.json())
            .then(json => {
                setMapping(json);
                setLoading(false);
            })
            .catch(console.error);
    }, []);

    const handleConnect = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        try {
            const res = await fetch('/api/settings/domains', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ domain: domainInput })
            });
            const data = await res.json();
            setMapping(data);
        } catch (err) {
            console.error(err);
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <div className="p-8 text-white">Loading domain settings...</div>;

    return (
        <div className="max-w-4xl mx-auto py-8 px-4 space-y-8 animate-in fade-in duration-500">
            <div>
                <h1 className="text-3xl font-extrabold text-white">Domains & URL</h1>
                <p className="text-text-secondary font-medium mt-1">Configure your custom brand domain and SSL security.</p>
            </div>

            <div className="grid grid-cols-1 gap-8">
                {/* Current Subdomain */}
                <GlassPanel className="p-8 space-y-6">
                    <h2 className="text-xl font-bold text-white border-b border-white/5 pb-4">Vayva Subdomain</h2>
                    <div className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/10">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-emerald-500/10 text-emerald-500 rounded-xl">
                                <Icon name={"CheckCircle" as any} size={24} />
                            </div>
                            <div>
                                <div className="text-lg font-bold text-white capitalize tracking-wide">Active</div>
                                <div className="text-sm font-mono text-text-secondary">yourstore.vayva.store</div>
                            </div>
                        </div>
                        <Button variant="ghost" size="sm" onClick={() => window.open('https://yourstore.vayva.store')}>Visit Store</Button>
                    </div>
                </GlassPanel>

                {/* Custom Domain */}
                <GlassPanel className="p-8 space-y-6">
                    <h2 className="text-xl font-bold text-white border-b border-white/5 pb-4">Custom Domain</h2>

                    {!mapping || mapping.status === 'none' ? (
                        <form onSubmit={handleConnect} className="space-y-4">
                            <p className="text-sm text-text-secondary">Connect your own domain name (e.g. www.yourbrand.com) to your Vayva store.</p>
                            <div className="flex gap-3">
                                <div className="flex-1">
                                    <Input
                                        placeholder="myshopify.xyz"
                                        value={domainInput}
                                        onChange={e => setDomainInput(e.target.value)}
                                        required
                                    />
                                </div>
                                <Button type="submit" isLoading={saving}>Connect Domain</Button>
                            </div>
                        </form>
                    ) : (
                        <div className="space-y-6">
                            <div className="flex items-center justify-between p-6 bg-white/5 rounded-2xl border border-white/10">
                                <div>
                                    <div className="text-lg font-bold text-white">{mapping.domain}</div>
                                    <div className={cn(
                                        "text-xs font-bold px-2 py-0.5 rounded-full mt-1 inline-block uppercase tracking-widest",
                                        mapping.status === 'active' ? "bg-emerald-500/10 text-emerald-500" : "bg-amber-500/10 text-amber-500"
                                    )}>
                                        {mapping.status}
                                    </div>
                                </div>
                                <Button variant="ghost" size="sm" onClick={() => setMapping({ status: 'none' })}>Disconnect</Button>
                            </div>

                            {mapping.status === 'pending' && (
                                <div className="p-6 bg-white/5 border border-white/10 rounded-2xl space-y-4 animate-in fade-in zoom-in-95 duration-500">
                                    <h3 className="font-bold text-white">DNS Configuration Required</h3>
                                    <p className="text-xs text-text-secondary">Login to your domain provider and add the following records:</p>

                                    <div className="space-y-2">
                                        <div className="grid grid-cols-3 gap-2 p-3 bg-black/40 rounded-lg border border-white/5 text-[10px] uppercase tracking-widest font-bold text-white/40">
                                            <span>Type</span>
                                            <span>Host</span>
                                            <span>Value</span>
                                        </div>
                                        <div className="grid grid-cols-3 gap-2 p-3 bg-white/5 rounded-lg border border-white/10 text-xs font-mono text-white">
                                            <span>A</span>
                                            <span>@</span>
                                            <span>76.76.21.21</span>
                                        </div>
                                        <div className="grid grid-cols-3 gap-2 p-3 bg-white/5 rounded-lg border border-white/10 text-xs font-mono text-white">
                                            <span>TXT</span>
                                            <span>_vayva</span>
                                            <span className="truncate">{mapping.verificationToken}</span>
                                        </div>
                                    </div>

                                    <div className="pt-4">
                                        <Button variant="secondary" className="w-full" size="sm">Verify Configuration</Button>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </GlassPanel>
            </div>
        </div>
    );
}
