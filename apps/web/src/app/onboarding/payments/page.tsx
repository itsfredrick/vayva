'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { AdminShell } from '@/components/admin-shell';
import { GlassPanel } from '@/components/ui/glass-panel';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Stepper } from '@/components/ui/stepper';
import { Icon } from '@/components/ui/icon';

export default function PaymentsPage() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);

    const [isConnected, setIsConnected] = useState(false);
    const [account, setAccount] = useState({ name: '', number: '', bank: '' });

    const handleConnect = () => {
        // Simulate Paystack popup
        setTimeout(() => setIsConnected(true), 1500);
    };

    const handleSave = async () => {
        setIsLoading(true);
        await new Promise(r => setTimeout(r, 1000));
        setIsLoading(false);
        router.push('/onboarding/delivery');
    };

    return (
        <AdminShell mode="onboarding" breadcrumb="Onboarding / Payments">
            <div className="flex flex-col gap-6 max-w-5xl mx-auto">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-white">Set up payments</h1>
                        <p className="text-text-secondary">Connect a provider to accept payments.</p>
                    </div>
                    <Stepper currentStep={5} />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Provider */}
                    <GlassPanel className="p-8 flex flex-col gap-6">
                        <h3 className="font-bold text-white">Payment Provider</h3>

                        <div className="p-6 rounded-xl border border-white/10 bg-white/5 flex flex-col gap-4">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded bg-[#09A5DB] flex items-center justify-center font-bold text-white text-xs">P</div>
                                    <h4 className="font-bold text-white">Paystack</h4>
                                </div>
                                {isConnected ? (
                                    <span className="text-[10px] font-bold bg-primary/20 text-primary px-2 py-0.5 rounded pill">CONNECTED</span>
                                ) : (
                                    <span className="text-[10px] font-bold bg-white/10 text-text-secondary px-2 py-0.5 rounded pill">RECOMMENDED</span>
                                )}
                            </div>
                            <p className="text-sm text-text-secondary">Accept cards, bank transfers, and USSD.</p>

                            {!isConnected ? (
                                <Button onClick={handleConnect}>Connect Paystack</Button>
                            ) : (
                                <Button variant="outline" className="border-state-success text-state-success bg-state-success/10">Connected</Button>
                            )}
                        </div>

                        <div className="p-6 rounded-xl border border-white/5 bg-white/5 opacity-50 cursor-not-allowed">
                            <div className="flex items-center gap-3 mb-2">
                                <div className="w-10 h-10 rounded bg-[#F5A623] flex items-center justify-center font-bold text-white text-xs">F</div>
                                <h4 className="font-bold text-white">Flutterwave</h4>
                            </div>
                            <p className="text-sm text-text-secondary">Coming soon</p>
                        </div>
                    </GlassPanel>

                    {/* Payout Details */}
                    <GlassPanel className="p-8 flex flex-col gap-6">
                        <h3 className="font-bold text-white">Payout Details</h3>
                        <p className="text-sm text-text-secondary -mt-4">Where should we send your money?</p>

                        <div className="flex flex-col gap-4">
                            <Input
                                label="Account Holder Name"
                                placeholder="e.g. Amina Yusuf"
                                value={account.name}
                                onChange={e => setAccount({ ...account, name: e.target.value })}
                            />

                            <Input
                                label="Bank"
                                placeholder="Select Bank..."
                                value={account.bank}
                                onChange={e => setAccount({ ...account, bank: e.target.value })}
                            />

                            <Input
                                label="Account Number"
                                placeholder="0000 0000 00"
                                value={account.number}
                                onChange={e => setAccount({ ...account, number: e.target.value })}
                            />

                            <div className="text-xs text-text-secondary p-3 bg-white/5 rounded-lg border border-white/5">
                                Settlement schedule: <span className="text-white font-medium">Next Day (T+1)</span>
                            </div>
                        </div>
                    </GlassPanel>
                </div>

                <div className="flex justify-between">
                    <Button variant="ghost" onClick={() => router.back()}>Back</Button>
                    <Button onClick={handleSave} disabled={!isConnected && !account.number} isLoading={isLoading}>Save & Continue</Button>
                </div>
            </div>
        </AdminShell>
    );
}
