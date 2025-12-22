'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { AppShell } from '@vayva/ui';
import { GlassPanel } from '@vayva/ui';
import { Button } from '@vayva/ui';
import { Input } from '@vayva/ui';
import { Icon } from '@vayva/ui';

export default function RefundPage() {
    const params = useParams();
    const router = useRouter();
    const id = params.id as string;
    const [refundType, setRefundType] = useState<'full' | 'partial'>('full');

    const handleRefund = (e: React.FormEvent) => {
        e.preventDefault();
        router.push(`/admin/orders/${id}`);
    };

    return (
        <AppShell sidebar={<></>} header={<></>}>
            <div className="flex flex-col gap-6 max-w-4xl mx-auto">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-white">Refund for Order {id}</h1>
                        <p className="text-text-secondary">Review details carefully before verifying.</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Left: Form */}
                    <GlassPanel className="md:col-span-2 p-8 border-l-4 border-l-state-warning">
                        <form onSubmit={handleRefund} className="flex flex-col gap-6">
                            <div>
                                <label className="text-xs text-text-secondary uppercase font-bold tracking-wider mb-3 block">Refund Type</label>
                                <div className="flex gap-4">
                                    <label className="flex items-center gap-2 cursor-pointer group">
                                        <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${refundType === 'full' ? 'border-primary bg-primary' : 'border-white/20 bg-transparent'}`}>
                                            {refundType === 'full' && <Icon name={"Check" as any} size={12} className="text-black" />}
                                        </div>
                                        <input type="radio" className="hidden" checked={refundType === 'full'} onChange={() => setRefundType('full')} />
                                        <span className="text-white group-hover:text-primary transition-colors">Full Refund</span>
                                    </label>
                                    <label className="flex items-center gap-2 cursor-pointer group">
                                        <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${refundType === 'partial' ? 'border-primary bg-primary' : 'border-white/20 bg-transparent'}`}>
                                            {refundType === 'partial' && <Icon name={"Check" as any} size={12} className="text-black" />}
                                        </div>
                                        <input type="radio" className="hidden" checked={refundType === 'partial'} onChange={() => setRefundType('partial')} />
                                        <span className="text-white group-hover:text-primary transition-colors">Partial Refund</span>
                                    </label>
                                </div>
                            </div>

                            <div>
                                <label className="text-xs text-text-secondary uppercase font-bold tracking-wider mb-2 block">Refund Amount (₦)</label>
                                <Input
                                    defaultValue="51,500"
                                    readOnly={refundType === 'full'}
                                    className={`text-lg font-mono font-bold ${refundType === 'full' ? 'bg-white/5 text-white/50 cursor-not-allowed' : 'bg-transparent border-primary'}`}
                                />
                                {refundType === 'partial' && <p className="text-xs text-text-secondary mt-1">Max available: ₦ 51,500</p>}
                            </div>

                            <div>
                                <label className="text-xs text-text-secondary uppercase font-bold tracking-wider mb-2 block">Reason</label>
                                <select className="h-12 w-full rounded-full bg-white/5 border border-white/10 px-4 text-white outline-none focus:border-primary">
                                    <option>Select a reason...</option>
                                    <option>Customer returned item</option>
                                    <option>Out of stock</option>
                                    <option>Fraud suspected</option>
                                    <option>Other</option>
                                </select>
                            </div>

                            <div className="flex items-center justify-between p-4 rounded-xl bg-white/5">
                                <div>
                                    <span className="text-white font-bold block">Notify Customer</span>
                                    <span className="text-xs text-text-secondary">Send an email update to Chinedu</span>
                                </div>
                                <input type="checkbox" className="toggle toggle-primary" defaultChecked />
                            </div>

                            <div className="pt-4 flex gap-4 border-t border-white/5">
                                <Button type="submit" variant="destructive" className="flex-1 bg-state-danger hover:bg-red-600 text-white">Process Refund</Button>
                                <Button type="button" variant="ghost" onClick={() => router.back()}>Cancel</Button>
                            </div>
                        </form>
                    </GlassPanel>

                    {/* Right: Summary */}
                    <div className="flex flex-col gap-6">
                        <GlassPanel className="p-6">
                            <h3 className="font-bold text-white mb-4">Original Payment</h3>
                            <div className="flex justify-between text-sm mb-2">
                                <span className="text-text-secondary">Amount</span>
                                <span className="text-white font-mono">₦ 51,500</span>
                            </div>
                            <div className="flex justify-between text-sm mb-2">
                                <span className="text-text-secondary">Date</span>
                                <span className="text-white">Today</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-text-secondary">Via</span>
                                <span className="text-white">Paystack</span>
                            </div>
                        </GlassPanel>

                        <div className="p-4 rounded-xl bg-primary/10 border border-primary/20 text-xs text-primary/80">
                            <Icon name={"Info" as any} size={16} className="inline mr-1 mb-0.5" />
                            Processing fees from Paystack may not be returned depending on their policy.
                        </div>
                    </div>
                </div>
            </div>
        </AppShell>
    );
}
