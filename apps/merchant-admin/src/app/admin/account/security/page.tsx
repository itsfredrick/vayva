'use client';

import React, { useState, useEffect } from 'react';
import { AdminShell } from '@/components/admin-shell';
import { GlassPanel, Button, Icon } from '@vayva/ui';
import { toast } from 'sonner';

export default function SecurityPage() {
    const [isLoading, setIsLoading] = useState(true);
    const [securityData, setSecurityData] = useState<any>(null);
    const [changingPassword, setChangingPassword] = useState(false);
    const [passwords, setPasswords] = useState({ current: '', next: '', confirm: '' });

    useEffect(() => {
        fetchSecurity();
    }, []);

    const fetchSecurity = async () => {
        try {
            const res = await fetch('/api/account/security');
            const data = await res.json();
            setSecurityData(data);
        } catch (error) {
            console.error('Security fetch error:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handlePasswordChange = async (e: React.FormEvent) => {
        e.preventDefault();

        if (passwords.next !== passwords.confirm) {
            toast.error('New passwords do not match');
            return;
        }

        setChangingPassword(true);
        try {
            const res = await fetch('/api/account/security/change-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    currentPassword: passwords.current,
                    newPassword: passwords.next,
                    confirmPassword: passwords.confirm
                })
            });

            const data = await res.json();
            if (res.ok) {
                toast.success('Password updated successfully');
                setPasswords({ current: '', next: '', confirm: '' });
            } else {
                toast.error(data.error || 'Failed to update password');
            }
        } catch (error) {
            toast.error('An unexpected error occurred');
        } finally {
            setChangingPassword(false);
        }
    };

    if (isLoading) return <div className="text-white p-8">Loading security settings...</div>;

    return (
        <AdminShell title="Security" breadcrumb="Account / Security">
            <div className="max-w-4xl mx-auto space-y-8 pb-12">
                <div className="flex flex-col gap-1">
                    <h1 className="text-2xl font-bold text-white tracking-tight">Security Settings</h1>
                    <p className="text-text-secondary text-sm">Protect your account with advanced security controls.</p>
                </div>

                {/* 1. Password Management */}
                <GlassPanel className="p-8 border border-white/5 bg-white/[0.02]">
                    <div className="flex items-center gap-4 mb-8">
                        <div className="p-3 bg-primary/10 rounded-2xl text-primary border border-primary/20 shadow-inner">
                            <Icon name="Lock" size={24} />
                        </div>
                        <div>
                            <h3 className="text-lg font-bold text-white tracking-tight">Change Password</h3>
                            <p className="text-xs text-text-secondary font-medium">Update your password to keep your store secure.</p>
                        </div>
                    </div>

                    <form onSubmit={handlePasswordChange} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="md:col-span-2">
                            <label className="text-[10px] text-text-secondary uppercase font-black tracking-widest mb-2 block opacity-70">Current Password</label>
                            <input
                                type="password"
                                required
                                className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/50 transition-all placeholder:text-white/20"
                                placeholder="Your current password"
                                value={passwords.current}
                                onChange={(e) => setPasswords({ ...passwords, current: e.target.value })}
                            />
                        </div>
                        <div>
                            <label className="text-[10px] text-text-secondary uppercase font-black tracking-widest mb-2 block opacity-70">New Password</label>
                            <input
                                type="password"
                                required
                                minLength={8}
                                className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/50 transition-all placeholder:text-white/20"
                                placeholder="Minimum 8 characters"
                                value={passwords.next}
                                onChange={(e) => setPasswords({ ...passwords, next: e.target.value })}
                            />
                        </div>
                        <div>
                            <label className="text-[10px] text-text-secondary uppercase font-black tracking-widest mb-2 block opacity-70">Confirm New Password</label>
                            <input
                                type="password"
                                required
                                className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/50 transition-all placeholder:text-white/20"
                                placeholder="Repeat your new password"
                                value={passwords.confirm}
                                onChange={(e) => setPasswords({ ...passwords, confirm: e.target.value })}
                            />
                        </div>
                        <div className="md:col-span-2 pt-4">
                            <Button
                                type="submit"
                                className="bg-primary text-black hover:bg-primary/90 font-bold px-8 h-12 rounded-xl shadow-lg shadow-primary/10 transition-all active:scale-95"
                                disabled={changingPassword}
                                isLoading={changingPassword}
                            >
                                Update Security Credentials
                            </Button>
                        </div>
                    </form>
                </GlassPanel>

                {/* 2. Two-Factor Authentication */}
                <GlassPanel className="p-8 border border-white/5 bg-white/[0.02]">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-state-warning/10 rounded-2xl text-state-warning border border-state-warning/20 shadow-inner">
                                <Icon name="Smartphone" size={24} />
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-white tracking-tight">Two-Factor Authentication</h3>
                                <div className="flex items-center gap-2 mt-0.5">
                                    <span className={`w-2 h-2 rounded-full animate-pulse ${securityData.mfaEnabled ? 'bg-state-success shadow-[0_0_8px_rgba(34,197,94,0.5)]' : 'bg-state-danger'}`}></span>
                                    <span className="text-[10px] text-text-secondary font-black uppercase tracking-widest">
                                        Status: {securityData.mfaEnabled ? 'Protected' : 'Unprotected'}
                                    </span>
                                </div>
                            </div>
                        </div>
                        <Button variant="outline" className="border-white/10 hover:bg-white/5 font-bold px-6 rounded-xl transition-all">
                            {securityData.mfaEnabled ? 'Manage MFA' : 'Set Up MFA'}
                        </Button>
                    </div>
                </GlassPanel>

                {/* 3. Active Sessions */}
                <GlassPanel className="p-8 border border-white/5 bg-white/[0.02]">
                    <div className="flex items-center justify-between mb-8">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-blue-500/10 rounded-2xl text-blue-400 border border-blue-500/20 shadow-inner">
                                <Icon name="Shield" size={24} />
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-white tracking-tight">Active Sessions</h3>
                                <p className="text-xs text-text-secondary font-medium">Recent security activity and login history.</p>
                            </div>
                        </div>
                        <Button variant="ghost" className="text-state-danger hover:bg-state-danger/10 font-bold px-4 rounded-xl transition-all">
                            Revoke Other Sessions
                        </Button>
                    </div>

                    <div className="space-y-4">
                        {(securityData.sessions || []).map((session: any) => (
                            <div key={session.id} className="flex items-center justify-between p-5 bg-white/[0.02] rounded-2xl border border-white/5 hover:border-white/10 transition-all group">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-text-secondary group-hover:bg-primary/10 group-hover:text-primary transition-all">
                                        <Icon name={session.device.includes('iPhone') || session.device.includes('Android') ? "Smartphone" : "Monitor"} size={20} />
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <p className="text-white font-bold tracking-tight">{session.device.split(' (')[0]}</p>
                                            {session.isCurrent && (
                                                <span className="px-2 py-0.5 rounded-full bg-state-success/10 text-state-success text-[10px] font-black uppercase tracking-widest border border-state-success/20">Active Now</span>
                                            )}
                                        </div>
                                        <p className="text-[10px] text-text-secondary font-medium uppercase tracking-widest mt-0.5 opacity-60">
                                            {session.location} • Login: {new Date(session.lastActive).toLocaleString()}
                                        </p>
                                    </div>
                                </div>
                                <Icon name="ChevronRight" size={16} className="text-white/10" />
                            </div>
                        ))}
                    </div>
                </GlassPanel>
            </div>
        </AdminShell>
    );
}
