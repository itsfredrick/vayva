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

export default function PayoutSettingsPage() {
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [accounts, setAccounts] = useState<any[]>([]);
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState<any>({
        bankName: '',
        bankCode: '',
        accountNumber: '',
        accountName: '',
        isDefault: true
    });

    useEffect(() => {
        fetch('/api/settings/payouts')
            .then(res => res.json())
            .then(json => {
                setAccounts(json);
                setLoading(false);
            })
            .catch(console.error);
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        try {
            const res = await fetch('/api/settings/payouts', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });
            if (!res.ok) throw new Error('Failed to add account');
            const newAcc = await res.json();
            setAccounts([...accounts, newAcc]);
            setShowForm(false);
            setFormData({ bankName: '', bankCode: '', accountNumber: '', accountName: '', isDefault: false });
        } catch (err) {
            console.error(err);
            alert('Error adding payout method');
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <div className="p-8 text-white">Loading payout settings...</div>;

    return (
        <div className="max-w-4xl mx-auto py-8 px-4 space-y-8 animate-in fade-in duration-500">
            <div className="flex justify-between items-end">
                <div>
                    <h1 className="text-3xl font-extrabold text-white">Payouts & Settlement</h1>
                    <p className="text-text-secondary font-medium mt-1">Configure where and how you receive your earnings.</p>
                </div>
                {!showForm && <Button onClick={() => setShowForm(true)} size="sm">Add Account</Button>}
            </div>

            {showForm && (
                <GlassPanel className="p-8 space-y-6 animate-in slide-in-from-top-4 duration-300">
                    <div className="flex justify-between items-center border-b border-white/5 pb-4">
                        <h2 className="text-xl font-bold text-white">Add Settlement Account</h2>
                        <Button variant="ghost" size="sm" onClick={() => setShowForm(false)}>Cancel</Button>
                    </div>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <Input
                                label="Bank Name"
                                placeholder="Select Bank"
                                value={formData.bankName}
                                onChange={e => setFormData({ ...formData, bankName: e.target.value })}
                                required
                            />
                            <Input
                                label="Bank Code"
                                placeholder="044"
                                value={formData.bankCode}
                                onChange={e => setFormData({ ...formData, bankCode: e.target.value })}
                                required
                            />
                            <Input
                                label="Account Number"
                                placeholder="10 digits"
                                value={formData.accountNumber}
                                onChange={e => setFormData({ ...formData, accountNumber: e.target.value })}
                                required
                            />
                            <Input
                                label="Account Name"
                                placeholder="As on bank record"
                                value={formData.accountName}
                                onChange={e => setFormData({ ...formData, accountName: e.target.value })}
                                required
                            />
                        </div>
                        <div className="flex items-center gap-3">
                            <input
                                type="checkbox"
                                checked={formData.isDefault}
                                onChange={e => setFormData({ ...formData, isDefault: e.target.checked })}
                                id="is-default"
                                className="accent-primary"
                            />
                            <label htmlFor="is-default" className="text-sm text-text-secondary cursor-pointer">Set as default payout destination</label>
                        </div>
                        <div className="flex justify-end gap-3 pt-4 border-t border-white/5">
                            <Button variant="ghost" type="button" onClick={() => setShowForm(false)}>Discard</Button>
                            <Button type="submit" isLoading={saving}>Save Account</Button>
                        </div>
                    </form>
                </GlassPanel>
            )}

            <div className="grid grid-cols-1 gap-4">
                {accounts.map((acc: any) => (
                    <GlassPanel key={acc.id} className="p-6 flex items-center justify-between group transition-all hover:bg-white/10">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-white/5 rounded-xl text-white">
                                <Icon name="Wallet" size={24} />
                            </div>
                            <div>
                                <div className="text-lg font-bold text-white flex items-center gap-3">
                                    {acc.bankName}
                                    {acc.isDefault && <span className="text-[10px] bg-primary/20 text-primary px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">Default</span>}
                                </div>
                                <div className="text-sm text-text-secondary font-medium italic">
                                    **** {acc.accountNumber.slice(-4)} • {acc.accountName}
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <Button variant="ghost" size="sm">Remove</Button>
                        </div>
                    </GlassPanel>
                ))}
                {accounts.length === 0 && !showForm && (
                    <div className="text-center py-20 bg-white/5 border border-dashed border-white/10 rounded-2xl">
                        <Icon name={"PlusCircle" as any} size={40} className="mx-auto mb-4 text-white/20" />
                        <h3 className="text-lg font-bold text-white">No payout accounts</h3>
                        <p className="text-sm text-text-secondary mb-6">Add a bank account to start receiving settlements.</p>
                        <Button onClick={() => setShowForm(true)}>Add First Account</Button>
                    </div>
                )}
            </div>

            <GlassPanel className="p-6 bg-amber-500/5 border border-amber-500/20">
                <div className="flex items-start gap-3">
                    <Icon name="Info" className="text-amber-500 mt-1" size={20} />
                    <div className="space-y-1">
                        <h4 className="font-bold text-amber-500 text-sm">Payout Readiness</h4>
                        <p className="text-xs text-amber-500/70 leading-relaxed">
                            Settlements are processed weekly. Ensure your KYC verification is complete and you have a default bank account selected.
                        </p>
                    </div>
                </div>
            </GlassPanel>
        </div>
    );
}
