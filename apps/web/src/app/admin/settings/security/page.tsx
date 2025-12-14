'use client';

import React, { useState } from 'react';
import { AdminShell } from '@/components/admin-shell';
import { GlassPanel } from '@/components/ui/glass-panel';
import { Button } from '@/components/ui/button';
import { Icon } from '@/components/ui/icon';

export default function SecurityPage() {
    const [passwordData, setPasswordData] = useState({ current: '', new: '', confirm: '' });

    return (
        <AdminShell breadcrumb="Settings / Security" title="Security">
            <div className="max-w-4xl mx-auto space-y-6 pb-24">

                {/* 1. Password Change */}
                <GlassPanel className="p-6">
                    <h2 className="font-bold text-white text-lg mb-6">Change Password</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                            <div>
                                <label className="text-xs text-text-secondary uppercase font-bold tracking-wider mb-2 block">Current Password</label>
                                <input
                                    type="password"
                                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-primary"
                                    onChange={(e) => setPasswordData({ ...passwordData, current: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="text-xs text-text-secondary uppercase font-bold tracking-wider mb-2 block">New Password</label>
                                <input
                                    type="password"
                                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-primary"
                                    onChange={(e) => setPasswordData({ ...passwordData, new: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="text-xs text-text-secondary uppercase font-bold tracking-wider mb-2 block">Confirm Password</label>
                                <input
                                    type="password"
                                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-primary"
                                    onChange={(e) => setPasswordData({ ...passwordData, confirm: e.target.value })}
                                />
                            </div>
                            <Button className="bg-primary text-black hover:bg-primary/90" disabled={!passwordData.current || !passwordData.new}>Update Password</Button>
                        </div>
                        <div className="p-4 bg-white/5 rounded-xl border border-white/5">
                            <h3 className="font-bold text-white text-sm mb-2">Password Requirements</h3>
                            <ul className="text-xs text-text-secondary space-y-2 list-disc pl-4">
                                <li>Minimum 8 characters long</li>
                                <li>At least one uppercase letter</li>
                                <li>At least one number</li>
                                <li>At least one special character</li>
                            </ul>
                        </div>
                    </div>
                </GlassPanel>

                {/* 2. Active Sessions */}
                <GlassPanel className="p-6">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="font-bold text-white text-lg">Active Sessions</h2>
                        <Button variant="outline" size="sm" className="text-state-danger border-state-danger/20 hover:bg-state-danger/10">Sign out of all devices</Button>
                    </div>
                    <div className="space-y-4">
                        {[
                            { device: 'MacBook Pro', location: 'Lagos, Nigeria', time: 'Active now', current: true },
                            { device: 'iPhone 13', location: 'Lagos, Nigeria', time: 'Active 2h ago', current: false },
                            { device: 'Chrome on Windows', location: 'Abuja, Nigeria', time: 'Active 2d ago', current: false },
                        ].map((session, i) => (
                            <div key={i} className="flex items-center justify-between p-4 bg-white/5 rounded-lg border border-white/5">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-text-secondary">
                                        <Icon name={session.device.includes('iPhone') ? 'smartphone' : 'laptop'} />
                                    </div>
                                    <div>
                                        <div className="font-bold text-white flex items-center gap-2">
                                            {session.device}
                                            {session.current && <span className="px-1.5 py-0.5 rounded bg-state-success/10 text-state-success text-[10px] uppercase font-bold tracking-wider">Current</span>}
                                        </div>
                                        <div className="text-xs text-text-secondary">{session.location} • {session.time}</div>
                                    </div>
                                </div>
                                {!session.current && <Button variant="ghost" size="sm" className="text-text-secondary hover:text-white">Sign Out</Button>}
                            </div>
                        ))}
                    </div>
                </GlassPanel>

                {/* 3. Two Factor (Existing content wrapped) */}
                <GlassPanel className="p-6 flex flex-col gap-6 opacity-80">
                    <div className="flex items-start justify-between">
                        <div>
                            <h2 className="text-xl font-bold text-white flex items-center gap-3">
                                Two-Factor Authentication (2FA)
                                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-white/5 text-text-secondary uppercase tracking-widest border border-white/10">Coming Soon</span>
                            </h2>
                            <p className="text-text-secondary mt-2 max-w-lg">
                                Add an extra layer of security to your account.
                            </p>
                        </div>
                    </div>
                </GlassPanel>

            </div>
        </AdminShell>
    );
}
