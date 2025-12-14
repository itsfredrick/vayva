'use client';

import React, { useState } from 'react';
import { AdminShell } from '@/components/admin-shell';
import { GlassPanel } from '@/components/ui/glass-panel';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Icon } from '@/components/ui/icon';

export default function InviteStaffPage() {
    const [email, setEmail] = useState('');
    const [role, setRole] = useState('Staff');
    const [isLoading, setIsLoading] = useState(false);
    const [invited, setInvited] = useState(false);

    const handleInvite = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        await new Promise(resolve => setTimeout(resolve, 1500));
        setIsLoading(false);
        setInvited(true);
    };

    return (
        <AdminShell breadcrumb="Settings / Staff" title="Manage Team">
            <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">

                {/* Main List Column */}
                <div className="md:col-span-2 flex flex-col gap-6">
                    <div className="flex items-center justify-between">
                        <h3 className="font-bold text-white">Team Members</h3>
                        <Button variant="secondary" className="h-8 text-xs">Export List</Button>
                    </div>

                    <GlassPanel className="p-0 overflow-hidden">
                        {[
                            { name: 'John Doe', role: 'Owner', email: 'john@store.com', status: 'Active' },
                            { name: 'Sarah Smith', role: 'Staff', email: 'sarah@store.com', status: 'Active' },
                        ].map((member, i) => (
                            <div key={i} className="flex items-center justify-between p-4 border-b border-border-subtle last:border-0 hover:bg-white/5 transition-colors">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full bg-primary/20 text-primary flex items-center justify-center font-bold text-xs">
                                        {member.name.charAt(0)}
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-white">{member.name}</p>
                                        <p className="text-xs text-text-secondary">{member.email}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4">
                                    <span className="text-xs font-medium px-2 py-0.5 rounded bg-white/10 text-white">{member.role}</span>
                                    <span className="text-xs text-primary">{member.status}</span>
                                </div>
                            </div>
                        ))}
                    </GlassPanel>
                </div>

                {/* Invite Column */}
                <div className="md:col-span-1">
                    <GlassPanel className="p-6 sticky top-6">
                        <h3 className="font-bold text-white mb-4 flex items-center gap-2">
                            <Icon name="person_add" /> Invite Staff
                        </h3>

                        {invited ? (
                            <div className="text-center py-8 animate-fade-in">
                                <div className="w-12 h-12 rounded-full bg-primary/20 text-primary flex items-center justify-center mx-auto mb-4">
                                    <Icon name="check" size={24} />
                                </div>
                                <h4 className="font-bold text-white mb-1">Invite Sent</h4>
                                <p className="text-sm text-text-secondary mb-4">An email has been sent to {email}</p>
                                <Button variant="outline" onClick={() => { setInvited(false); setEmail(''); }} size="sm">
                                    Invite Another
                                </Button>
                            </div>
                        ) : (
                            <form onSubmit={handleInvite} className="flex flex-col gap-4">
                                <Input
                                    label="Email Address"
                                    placeholder="colleague@email.com"
                                    value={email}
                                    onChange={e => setEmail(e.target.value)}
                                />

                                <div>
                                    <label className="text-xs uppercase tracking-widest text-[rgba(255,255,255,0.65)] font-bold mb-2 block">
                                        Role
                                    </label>
                                    <select
                                        className="w-full h-[48px] px-4 rounded-full bg-[rgba(20,34,16,0.6)] border border-[rgba(255,255,255,0.08)] text-white outline-none focus:border-primary"
                                        value={role}
                                        onChange={e => setRole(e.target.value)}
                                    >
                                        <option value="Staff">Staff</option>
                                        <option value="Admin">Admin</option>
                                    </select>
                                </div>

                                <div className="p-3 rounded bg-white/5 text-xs text-text-secondary">
                                    {role === 'Staff' ? 'Can manage orders and products. Cannot change settings.' : 'Full access to all settings and financial data.'}
                                </div>

                                <Button type="submit" disabled={!email} isLoading={isLoading}>
                                    Send Invite
                                </Button>
                            </form>
                        )}
                    </GlassPanel>
                </div>

            </div>
        </AdminShell>
    );
}
