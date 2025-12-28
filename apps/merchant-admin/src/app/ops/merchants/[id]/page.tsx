'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { OpsShell } from '@/components/ops/ops-shell';
import { RiskChip } from '@/components/ops/risk-chip';
import { Button, Icon, GlassPanel, cn } from '@vayva/ui';

export default function OpsMerchantDetailPage() {
    const { id } = useParams();
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<'OVERVIEW' | 'KYC' | 'INTEGRATIONS' | 'PAYOUTS' | 'AUDIT'>('OVERVIEW');

    useEffect(() => {
        fetch(`/api/ops/merchants/${id}/summary`)
            .then(res => res.json())
            .then(json => {
                setData(json);
                setLoading(false);
            })
            .catch(console.error);
    }, [id]);

    if (loading) return <div className="p-12 text-center text-white">Loading merchant detail...</div>;
    if (!data) return <div className="p-12 text-center text-red-500">Merchant not found</div>;

    const tabs = [
        { id: 'OVERVIEW', label: 'Overview', icon: 'LayoutDashboard' },
        { id: 'KYC', label: 'KYC', icon: 'Shield' },
        { id: 'INTEGRATIONS', label: 'Integrations', icon: 'Link' },
        { id: 'PAYOUTS', label: 'Payouts', icon: 'Wallet' },
        { id: 'AUDIT', label: 'Audit Log', icon: 'Activity' },
    ];

    return (
        <OpsShell
            title={data.name}
            description={`${data.slug}.vayva.store • ${data.ownerEmail}`}
            actions={
                <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="border-red-500/20 text-red-400 hover:bg-red-500/10">Suspend Store</Button>
                    <Button size="sm">Edit Profile</Button>
                </div>
            }
        >
            {/* Health Bar */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                <div className="p-4 bg-white/5 border border-white/10 rounded-xl">
                    <div className="text-[10px] uppercase tracking-widest text-text-secondary font-bold mb-1">Status</div>
                    <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                        <span className="font-bold text-white">Active</span>
                    </div>
                </div>
                <div className="p-4 bg-white/5 border border-white/10 rounded-xl">
                    <div className="text-[10px] uppercase tracking-widest text-text-secondary font-bold mb-1">KYC</div>
                    <div className={cn("font-bold", data.health.kyc === 'VERIFIED' ? "text-emerald-400" : "text-amber-400")}>
                        {data.health.kyc}
                    </div>
                </div>
                <div className="p-4 bg-white/5 border border-white/10 rounded-xl">
                    <div className="text-[10px] uppercase tracking-widest text-text-secondary font-bold mb-1">Payout Readiness</div>
                    <div className={cn("font-bold", data.health.payouts ? "text-emerald-400" : "text-red-400")}>
                        {data.health.payouts ? 'Ready' : 'Blocked'}
                    </div>
                </div>
                <div className="p-4 bg-white/5 border border-white/10 rounded-xl">
                    <div className="text-[10px] uppercase tracking-widest text-text-secondary font-bold mb-1">Plan</div>
                    <div className="font-bold text-indigo-400 uppercase tracking-tighter">
                        {data.health.subscription}
                    </div>
                </div>
            </div>

            {/* Tabs */}
            <div className="flex gap-1 border-b border-white/5 mb-8">
                {tabs.map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id as any)}
                        className={cn(
                            "px-6 py-3 text-sm font-bold transition-all border-b-2",
                            activeTab === tab.id ? "border-primary text-white" : "border-transparent text-text-secondary hover:text-white"
                        )}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* Content Rendering */}
            <div className="space-y-8 animate-in fade-in duration-500">
                {activeTab === 'OVERVIEW' && <OverviewTab data={data} />}
                {activeTab === 'KYC' && <KycTab data={data} />}
                {activeTab === 'INTEGRATIONS' && <IntegrationsTab data={data} />}
                {activeTab === 'PAYOUTS' && <PayoutsTab data={data} />}
                {activeTab === 'AUDIT' && <AuditTab data={data} />}
            </div>
        </OpsShell>
    );
}

function OverviewTab({ data }: { data: any }) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <GlassPanel className="p-6 space-y-4">
                <h3 className="font-bold text-white border-b border-white/5 pb-2">Business Profile</h3>
                <div className="space-y-3">
                    <DetailItem label="Legal Name" value={data.StoreProfile?.businessName} />
                    <DetailItem label="Category" value={data.StoreProfile?.category} />
                    <DetailItem label="Address" value={data.StoreProfile?.address} />
                    <DetailItem label="Onboarding Step" value={data.StoreProfile?.onboardingStep} />
                </div>
            </GlassPanel>

            <GlassPanel className="p-6 space-y-4">
                <h3 className="font-bold text-white border-b border-white/5 pb-2">Technical Summary</h3>
                <div className="space-y-3">
                    <DetailItem label="Subdomain" value={`${data.slug}.vayva.store`} />
                    <DetailItem label="Template" value={data.settings?.template || 'Standard'} />
                    <DetailItem label="Creation Date" value={new Date(data.createdAt).toLocaleString()} />
                </div>
            </GlassPanel>
        </div>
    );
}

function KycTab({ data }: { data: any }) {
    return (
        <div className="space-y-8">
            <GlassPanel className="p-6">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="font-bold text-white uppercase tracking-widest text-sm">KYC History</h3>
                    <div className="flex gap-2">
                        <Button size="sm" variant="outline" className="border-white/10">Retry Sync</Button>
                        <Button size="sm" className="bg-emerald-600 hover:bg-emerald-500">Manual Override</Button>
                    </div>
                </div>
                <div className="space-y-4">
                    {data.KycRecord.length === 0 ? (
                        <div className="text-center py-8 text-text-secondary">No KYC records found.</div>
                    ) : (
                        data.KycRecord.map((rec: any) => (
                            <div key={rec.id} className="p-4 bg-white/5 border border-white/10 rounded-xl flex items-center justify-between">
                                <div>
                                    <div className="font-bold text-white">{rec.method} - {rec.idNumber}</div>
                                    <div className="text-xs text-text-secondary">{rec.provider} • {new Date(rec.createdAt).toLocaleString()}</div>
                                </div>
                                <span className={cn("text-[10px] font-bold px-2 py-0.5 rounded",
                                    rec.status === 'VERIFIED' ? "bg-emerald-500/10 text-emerald-400" : "bg-red-500/10 text-red-400"
                                )}>
                                    {rec.status}
                                </span>
                            </div>
                        ))
                    )}
                </div>
            </GlassPanel>
        </div>
    );
}

function IntegrationsTab({ data }: { data: any }) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <GlassPanel className="p-6 space-y-4">
                <h3 className="font-bold text-white">Connectivity Health</h3>
                <div className="space-y-4">
                    <IntegrationStatus name="WhatsApp Business API" status="Connected" lastActive="3 mins ago" />
                    <IntegrationStatus name="Paystack Checkout" status="Connected" lastActive="1 hour ago" />
                    <IntegrationStatus name="Redelivery Logistics" status="Disconnected" lastActive="Yesterday" />
                </div>
            </GlassPanel>
        </div>
    );
}

function PayoutsTab({ data }: { data: any }) {
    const bank = data.BankBeneficiary?.[0];
    return (
        <div className="space-y-8">
            <GlassPanel className="p-6">
                <h3 className="font-bold text-white mb-6">Primary Bank Account</h3>
                {bank ? (
                    <div className="p-6 bg-emerald-500/5 border border-emerald-500/20 rounded-2xl flex items-center gap-6">
                        <div className="p-4 bg-emerald-500/20 text-emerald-500 rounded-full">
                            <Icon name={"Wallet" as any} size={32} />
                        </div>
                        <div>
                            <div className="text-xl font-bold text-white">{bank.bankName}</div>
                            <div className="text-emerald-500/80 font-mono tracking-widest">{bank.accountNumber} • {bank.accountName}</div>
                        </div>
                    </div>
                ) : (
                    <div className="p-8 text-center bg-red-500/5 border border-red-500/20 rounded-2xl">
                        <div className="text-red-400 font-bold mb-2">No Settlement Account Configured</div>
                        <p className="text-sm text-red-400/60">The merchant has not added a payout destination.</p>
                    </div>
                )}
            </GlassPanel>
        </div>
    );
}

function AuditTab({ data }: { data: any }) {
    return (
        <GlassPanel className="p-6 overflow-hidden">
            <h3 className="font-bold text-white mb-6">Activity Trail</h3>
            <div className="space-y-1">
                {data.AuditLog.map((log: any) => (
                    <div key={log.id} className="p-3 hover:bg-white/5 transition-colors border-l-2 border-white/10 hover:border-primary flex items-center justify-between text-sm">
                        <div className="flex gap-4 items-center">
                            <div className="text-text-secondary w-32 shrink-0">{new Date(log.createdAt).toLocaleString()}</div>
                            <div className="font-bold text-white">{log.action}</div>
                            <div className="text-text-secondary truncate max-w-md">{log.details ? JSON.stringify(log.details) : '-'}</div>
                        </div>
                        <div className="text-[10px] text-white/20 font-mono">IP: {log.ipAddress || 'unknown'}</div>
                    </div>
                ))}
            </div>
        </GlassPanel>
    );
}

function DetailItem({ label, value }: { label: string, value: string }) {
    return (
        <div className="flex justify-between items-center text-sm">
            <span className="text-text-secondary">{label}</span>
            <span className="text-white font-medium">{value || '-'}</span>
        </div>
    );
}

function IntegrationStatus({ name, status, lastActive }: any) {
    return (
        <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg border border-white/10">
            <div className="flex items-center gap-3">
                <div className={cn("w-2 h-2 rounded-full", status === 'Connected' ? "bg-emerald-500" : "bg-red-500")} />
                <span className="text-white font-medium">{name}</span>
            </div>
            <div className="text-xs text-text-secondary">{lastActive}</div>
        </div>
    );
}
