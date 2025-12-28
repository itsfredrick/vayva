'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { AppShell, GlassPanel, Button, Icon } from '@vayva/ui';

export default function FinanceSettingsPage() {
    const [isLoading, setIsLoading] = useState(true);
    const [isEditingBank, setIsEditingBank] = useState(false);
    const [payoutData, setPayoutData] = useState<any>(null);
    const [integrations, setIntegrations] = useState<any[]>([]);
    const [bankForm, setBankForm] = useState({
        bankName: '',
        accountNumber: '',
        accountName: ''
    });

    useEffect(() => {
        fetchFinanceData();
    }, []);

    const fetchFinanceData = async () => {
        try {
            const [payoutRes, integrationRes] = await Promise.all([
                fetch('/api/account/payouts'),
                fetch('/api/account/integrations')
            ]);

            const payoutResult = await payoutRes.json();
            const integrationResult = await integrationRes.json();

            setPayoutData(payoutResult.accounts[0] || null);
            setIntegrations(integrationResult.integrations || []);
        } catch (error) {
            console.error('Failed to fetch finance data:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSaveBank = async () => {
        try {
            const response = await fetch('/api/account/payouts', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(bankForm)
            });
            if (response.ok) {
                setIsEditingBank(false);
                fetchFinanceData();
            }
        } catch (error) {
            console.error('Bank save error:', error);
        }
    };

    if (isLoading) return <div className="text-white p-8">Loading finance settings...</div>;

    const paystack = integrations.find(i => i.id === 'paystack');

    return (
        <AppShell sidebar={<></>} header={<></>}>
            <div className="flex flex-col gap-8 max-w-4xl mx-auto pb-20">
                {/* 1. Bank Settings */}
                <div className="space-y-4">
                    <h2 className="text-xl font-bold text-white">Payout Destination</h2>
                    <GlassPanel className="p-6">
                        {!isEditingBank ? (
                            <div className="flex items-start justify-between">
                                <div className="flex gap-4">
                                    <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center text-primary">
                                        <Icon name={"Landmark" as any} size={24} />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-white text-lg">
                                            {payoutData ? `${payoutData.bankName} • ${payoutData.accountNumber}` : 'No Bank Linked'}
                                        </h3>
                                        <p className="text-sm text-text-secondary">{payoutData?.accountName || 'Add your banking details'}</p>
                                        {payoutData && (
                                            <p className="text-xs text-text-secondary mt-1">
                                                Last updated {new Date(payoutData.updatedAt).toLocaleDateString()}
                                            </p>
                                        )}
                                    </div>
                                </div>
                                <Button variant="outline" size="sm" onClick={() => setIsEditingBank(true)}>
                                    {payoutData ? 'Change Account' : 'Add Bank'}
                                </Button>
                            </div>
                        ) : (
                            <div className="space-y-4 animate-in fade-in slide-in-from-top-2">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-xs text-text-secondary uppercase font-bold tracking-wider mb-2 block">Bank Name</label>
                                        <input
                                            className="w-full bg-white/5 border border-white/10 rounded-lg p-2 text-sm text-white focus:outline-none focus:border-primary"
                                            value={bankForm.bankName}
                                            onChange={(e) => setBankForm({ ...bankForm, bankName: e.target.value })}
                                            placeholder="e.g. GTBank"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-xs text-text-secondary uppercase font-bold tracking-wider mb-2 block">Account Number</label>
                                        <input
                                            className="w-full bg-white/5 border border-white/10 rounded-lg p-2 text-sm text-white focus:outline-none focus:border-primary"
                                            value={bankForm.accountNumber}
                                            onChange={(e) => setBankForm({ ...bankForm, accountNumber: e.target.value })}
                                            placeholder="10 digit account number"
                                        />
                                    </div>
                                    <div className="md:col-span-2">
                                        <label className="text-xs text-text-secondary uppercase font-bold tracking-wider mb-2 block">Account Name</label>
                                        <input
                                            className="w-full bg-white/5 border border-white/10 rounded-lg p-2 text-sm text-white focus:outline-none focus:border-primary"
                                            value={bankForm.accountName}
                                            onChange={(e) => setBankForm({ ...bankForm, accountName: e.target.value })}
                                            placeholder="Legal Business Name on Account"
                                        />
                                    </div>
                                </div>
                                <div className="flex gap-3 pt-2">
                                    <Button variant="primary" onClick={handleSaveBank}>Verify & Save</Button>
                                    <Button variant="ghost" onClick={() => setIsEditingBank(false)}>Cancel</Button>
                                </div>
                            </div>
                        )}
                    </GlassPanel>
                </div>

                {/* 2. Payment Providers */}
                <div className="space-y-4">
                    <h2 className="text-xl font-bold text-white">Payment Providers</h2>
                    <GlassPanel className="p-0 overflow-hidden">
                        <div className="p-6 border-b border-white/5 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center">
                                    <span className="text-black font-bold text-xs">P</span>
                                </div>
                                <div>
                                    <h3 className="font-bold text-white">Paystack</h3>
                                    <div className="flex items-center gap-2">
                                        <span className={`w-2 h-2 rounded-full ${paystack?.status === 'CONNECTED' ? 'bg-state-success' : 'bg-state-danger'}`}></span>
                                        <span className="text-xs text-text-secondary">
                                            {paystack?.status || 'DISCONNECTED'}
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <div className="flex gap-2">
                                <Button variant="outline" size="sm" className="text-xs">Test Connection</Button>
                            </div>
                        </div>
                    </GlassPanel>
                </div>

                {/* 3. Tax Settings (Resting on Billing Profile) */}
                <div className="space-y-4">
                    <h2 className="text-xl font-bold text-white">Tax Settings</h2>
                    <GlassPanel className="p-6">
                        <div className="flex items-center justify-between mb-6">
                            <div>
                                <h3 className="font-bold text-white">Tax Collection</h3>
                                <p className="text-sm text-text-secondary">Configure tax calculation in Billing Details.</p>
                            </div>
                            <Link href="/admin/account/billing">
                                <Button variant="outline" size="sm">Manage Billing</Button>
                            </Link>
                        </div>
                    </GlassPanel>
                </div>
            </div>
        </AppShell>
    );
}
