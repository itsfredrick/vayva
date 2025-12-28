'use client';

import React, { useState, useEffect } from 'react';
import { AdminShell } from '@/components/admin-shell';
import { GlassPanel, Button, Icon } from '@vayva/ui';

import { AddDomainModal } from '@/components/domains/AddDomainModal';

export default function DomainsPage() {
    const [isLoading, setIsLoading] = useState(true);
    const [domainData, setDomainData] = useState<any>(null);
    const [isVerifying, setIsVerifying] = useState(false);
    const [showAddModal, setShowAddModal] = useState(false);
    const [isAdding, setIsAdding] = useState(false);

    const fetchDomains = async () => {
        try {
            const response = await fetch('/api/account/domains');
            const data = await response.json();
            setDomainData(data);
        } catch (error) {
            console.error('Failed to fetch domains:', error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchDomains();
    }, []);

    const handleVerify = async () => {
        if (!domainData?.id) return;
        setIsVerifying(true);
        try {
            const res = await fetch('/api/account/domains/verify', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ domainMappingId: domainData.id })
            });
            const result = await res.json();
            if (res.ok) {
                setDomainData({ ...domainData, status: 'pending' });
                // Polling for status update would be nice, but for now we just show pending
            } else {
                alert(result.error || 'Verification failed to start');
            }
        } catch (err) {
            console.error('Verify error:', err);
        } finally {
            setIsVerifying(false);
        }
    };

    const handleAddDomain = async (domain: string) => {
        setIsAdding(true);
        try {
            const res = await fetch('/api/account/domains', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ domain })
            });
            const result = await res.json();
            if (res.ok) {
                // Refresh data
                await fetchDomains();
            } else {
                throw new Error(result.error);
            }
        } finally {
            setIsAdding(false);
            // Modal will be closed by component if success doesn't throw, but we should handle closing here or in component.
            // The modal expects a promise, so if we throw it displays error, if we resolve it closes.
        }
    };

    if (isLoading) return <div className="text-white p-8 font-medium">Loading domains...</div>;

    const needsVerification = domainData?.customDomain && domainData.status !== 'verified';

    return (
        <AdminShell title="Domains" breadcrumb="Storefront / Domains">
            <div className="flex flex-col gap-8 max-w-4xl mx-auto">
                <div className="flex flex-col gap-2">
                    <h1 className="text-2xl font-bold text-white tracking-tight">Domains</h1>
                    <p className="text-text-secondary text-sm">Manage your web address and custom domains.</p>
                </div>

                {/* Vayva Subdomain */}
                <GlassPanel className="p-0 overflow-hidden border border-white/5">
                    <div className="bg-primary/5 p-6 border-b border-white/5">
                        <div className="flex items-start justify-between">
                            <div className="flex gap-4">
                                <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center text-primary shadow-inner">
                                    <Icon name={"Globe" as any} size={24} />
                                </div>
                                <div className="flex flex-col gap-1">
                                    <h3 className="font-bold text-white text-lg tracking-tight">{domainData?.subdomain || 'loading...'}</h3>
                                    <div className="flex items-center gap-2">
                                        <span className="px-2 py-0.5 rounded-full bg-state-success/10 text-state-success text-[10px] font-black uppercase tracking-widest border border-state-success/20">Primary</span>
                                        <span className="text-xs text-text-secondary">Your default Vayva address</span>
                                    </div>
                                </div>
                            </div>
                            <Button variant="outline" size="sm" className="opacity-50 cursor-not-allowed text-[10px] font-bold uppercase tracking-widest">Shared</Button>
                        </div>
                    </div>
                </GlassPanel>

                {/* Custom Domain Section */}
                {domainData?.customDomain ? (
                    <div className="flex flex-col gap-4">
                        <GlassPanel className="p-6 border border-white/5">
                            <div className="flex items-start justify-between">
                                <div className="flex gap-4">
                                    <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center text-white border border-white/10">
                                        <Icon name={domainData.status === 'verified' ? "ShieldCheck" : "AlertCircle" as any} size={24} />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-white text-lg tracking-tight">{domainData.customDomain}</h3>
                                        <div className="flex items-center gap-2 mt-1">
                                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-widest border ${domainData.status === 'verified'
                                                ? 'bg-state-success/10 text-state-success border-state-success/20'
                                                : 'bg-state-warning/10 text-state-warning border-state-warning/20'
                                                }`}>
                                                {domainData.status}
                                            </span>
                                            {domainData.sslEnabled && (
                                                <span className="text-[10px] text-text-secondary flex items-center gap-1 font-bold uppercase tracking-widest bg-white/5 px-2 py-0.5 rounded-full border border-white/5">
                                                    <Icon name={"Lock" as any} size={10} /> SSL Active
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    {needsVerification && (
                                        <Button
                                            onClick={handleVerify}
                                            isLoading={isVerifying}
                                            className="bg-primary text-black hover:bg-primary/90 font-bold px-6 border-0 shadow-lg shadow-primary/20"
                                        >
                                            Verify Now
                                        </Button>
                                    )}
                                    <Button variant="outline" size="sm" className="border-white/10 hover:bg-white/5 font-bold transition-all">Manage</Button>
                                </div>
                            </div>

                            {needsVerification && (
                                <div className="mt-8 p-6 rounded-2xl bg-white/[0.02] border border-white/5">
                                    <h4 className="font-bold text-white mb-4 flex items-center gap-2">
                                        <Icon name={"Settings" as any} size={16} className="text-primary" /> Setup Instructions
                                    </h4>
                                    <p className="text-sm text-text-secondary mb-4 leading-relaxed">
                                        To verify ownership of <strong>{domainData.customDomain}</strong>, add the following TXT record to your DNS settings (Cloudflare, GoDaddy, etc):
                                    </p>
                                    <div className="bg-black/40 p-5 rounded-xl border border-white/10 font-mono text-sm group relative">
                                        <div className="flex justify-between items-center">
                                            <code className="text-primary/90 break-all leading-loose">
                                                Type: <span className="text-white">TXT</span><br />
                                                Name: <span className="text-white">@</span> (or root)<br />
                                                Value: <span className="text-white">vayva-verification={domainData.verificationToken}</span>
                                            </code>
                                            <Button variant="outline" size="sm" className="opacity-0 group-hover:opacity-100 transition-opacity border-primary/20 hover:bg-primary/10">Copy</Button>
                                        </div>
                                    </div>
                                    {domainData.lastError && (
                                        <div className="mt-4 p-4 rounded-xl bg-state-error/5 border border-state-error/10 flex items-start gap-3">
                                            <Icon name={"AlertTriangle" as any} size={16} className="text-state-error mt-0.5" />
                                            <div className="flex flex-col gap-1">
                                                <p className="text-xs font-bold text-state-error uppercase tracking-widest">Last Error</p>
                                                <p className="text-xs text-state-error/80">{domainData.lastError}</p>
                                            </div>
                                        </div>
                                    )}
                                    {domainData.lastCheckedAt && (
                                        <p className="mt-4 text-[10px] text-text-secondary font-bold uppercase tracking-widest opacity-40 text-center">
                                            Last checked: {new Date(domainData.lastCheckedAt).toLocaleString()}
                                        </p>
                                    )}
                                </div>
                            )}
                        </GlassPanel>
                    </div>
                ) : (
                    <GlassPanel className="p-12 text-center flex flex-col items-center justify-center gap-6 border border-white/5 bg-white/[0.01]">
                        <div className="w-20 h-20 rounded-2xl bg-white/5 flex items-center justify-center border border-white/10 shadow-2xl">
                            <Icon name={"Globe" as any} size={40} className="text-primary/80" />
                        </div>
                        <div className="flex flex-col gap-2">
                            <h3 className="text-2xl font-bold text-white tracking-tight">Connect a Custom Domain</h3>
                            <p className="text-text-secondary text-sm max-w-sm mx-auto leading-relaxed">
                                Already own a domain like <strong>mystore.com</strong>? Connect it to Vayva to build trust and professionalize your brand.
                            </p>
                        </div>
                        <Button
                            className="bg-white text-black hover:bg-white/90 font-bold px-8 py-6 h-auto rounded-xl shadow-xl shadow-white/5"
                            onClick={() => setShowAddModal(true)}
                        >
                            Connect Existing Domain
                        </Button>
                    </GlassPanel>
                )}

                <AddDomainModal
                    isOpen={showAddModal}
                    onClose={() => setShowAddModal(false)}
                    onAdd={handleAddDomain}
                    isAdding={isAdding}
                />
            </div>
        </AdminShell>
    );
}
