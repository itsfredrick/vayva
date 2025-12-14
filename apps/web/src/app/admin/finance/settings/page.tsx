'use client';

import React, { useState } from 'react';
import { AdminShell } from '@/components/admin-shell';
import { GlassPanel } from '@/components/ui/glass-panel';
import { Button } from '@/components/ui/button';
import { Icon } from '@/components/ui/icon';

export default function FinanceSettingsPage() {
    const [isEditingBank, setIsEditingBank] = useState(false);

    return (
        <AdminShell title="Finance Settings" breadcrumb="Finance / Settings">
            <div className="flex flex-col gap-8 max-w-4xl mx-auto pb-20">
                {/* Bank Settings */}
                <div className="space-y-4">
                    <h2 className="text-xl font-bold text-white">Payout Destination</h2>
                    <GlassPanel className="p-6">
                        {!isEditingBank ? (
                            <div className="flex items-start justify-between">
                                <div className="flex gap-4">
                                    <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center text-primary">
                                        <Icon name="account_balance" size={24} />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-white text-lg">GTBank •••• 1234</h3>
                                        <p className="text-sm text-text-secondary">Vayva Store Ltd</p>
                                        <p className="text-xs text-text-secondary mt-1">Last updated 2 months ago</p>
                                    </div>
                                </div>
                                <Button variant="outline" size="sm" onClick={() => setIsEditingBank(true)}>Change Account</Button>
                            </div>
                        ) : (
                            <div className="space-y-4 animate-in fade-in slide-in-from-top-2">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-xs text-text-secondary uppercase font-bold tracking-wider mb-2 block">Bank Name</label>
                                        <select className="w-full bg-white/5 border border-white/10 rounded-lg p-2 text-sm text-white focus:outline-none focus:border-primary">
                                            <option>Guaranty Trust Bank</option>
                                            <option>Zenith Bank</option>
                                            <option>Access Bank</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="text-xs text-text-secondary uppercase font-bold tracking-wider mb-2 block">Account Number</label>
                                        <input
                                            className="w-full bg-white/5 border border-white/10 rounded-lg p-2 text-sm text-white focus:outline-none focus:border-primary"
                                            placeholder="10 digit account number"
                                        />
                                    </div>
                                </div>
                                <div className="p-3 bg-state-warning/10 border border-state-warning/20 rounded-lg flex gap-3">
                                    <Icon name="lock" className="text-state-warning shrink-0" />
                                    <div>
                                        <p className="text-sm font-bold text-state-warning">Security Verification Required</p>
                                        <p className="text-xs text-text-secondary">You will need to verify this change via OTP sent to the owner's phone.</p>
                                    </div>
                                </div>
                                <div className="flex gap-3 pt-2">
                                    <Button>Verify & Save</Button>
                                    <Button variant="ghost" onClick={() => setIsEditingBank(false)}>Cancel</Button>
                                </div>
                            </div>
                        )}
                    </GlassPanel>
                </div>

                {/* Payment Providers */}
                <div className="space-y-4">
                    <h2 className="text-xl font-bold text-white">Payment Providers</h2>
                    <GlassPanel className="p-0 overflow-hidden">
                        <div className="p-6 border-b border-white/5 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center">
                                    {/* Placeholder for Paystack Logo */}
                                    <span className="text-black font-bold text-xs">P</span>
                                </div>
                                <div>
                                    <h3 className="font-bold text-white">Paystack</h3>
                                    <div className="flex items-center gap-2">
                                        <span className="w-2 h-2 rounded-full bg-state-success"></span>
                                        <span className="text-xs text-text-secondary">Connected</span>
                                    </div>
                                </div>
                            </div>
                            <div className="flex gap-2">
                                <Button variant="outline" size="sm" className="text-xs">Test Connection</Button>
                                <Button variant="outline" size="sm" className="text-xs text-state-danger hover:text-state-danger hover:bg-state-danger/10">Disconnect</Button>
                            </div>
                        </div>
                        <div className="p-6 bg-white/5">
                            <h4 className="text-xs font-bold text-text-secondary uppercase tracking-wider mb-3">Webhook Health</h4>
                            <div className="space-y-2">
                                {[1, 2].map(i => (
                                    <div key={i} className="flex items-center justify-between text-sm">
                                        <span className="text-white">charge.success</span>
                                        <div className="flex items-center gap-2">
                                            <span className="text-text-secondary text-xs">2 mins ago</span>
                                            <span className="px-1.5 py-0.5 rounded bg-state-success/10 text-state-success text-[10px] font-bold">200 OK</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </GlassPanel>
                </div>

                {/* Tax Settings */}
                <div className="space-y-4">
                    <h2 className="text-xl font-bold text-white">Tax Settings</h2>
                    <GlassPanel className="p-6">
                        <div className="flex items-center justify-between mb-6">
                            <div>
                                <h3 className="font-bold text-white">Tax Collection</h3>
                                <p className="text-sm text-text-secondary">Choose how taxes are calculated at checkout.</p>
                            </div>
                            <span className="px-2 py-0.5 rounded bg-white/10 text-xs font-bold uppercase tracking-wider text-text-secondary">Basic Mode</span>
                        </div>

                        <div className="space-y-4">
                            <label className="flex items-center gap-3 p-3 rounded-lg border border-white/10 bg-white/5 cursor-pointer">
                                <input type="radio" name="tax" className="radio radio-primary radio-sm" defaultChecked />
                                <div>
                                    <span className="text-sm font-bold text-white block">No tax collected</span>
                                    <span className="text-xs text-text-secondary">I will include tax in product prices manually.</span>
                                </div>
                            </label>

                            <label className="flex items-center gap-3 p-3 rounded-lg border border-white/10 hover:bg-white/5 cursor-pointer transition-colors">
                                <input type="radio" name="tax" className="radio radio-primary radio-sm" />
                                <div className="flex-1">
                                    <span className="text-sm font-bold text-white block">Flat Percentage</span>
                                    <span className="text-xs text-text-secondary">Add a specific % to the subtotal.</span>
                                </div>
                            </label>
                        </div>

                        <div className="mt-6 pt-4 border-t border-white/5 flex justify-end">
                            <Button>Save Settings</Button>
                        </div>
                    </GlassPanel>
                </div>
            </div>
        </AdminShell>
    );
}
