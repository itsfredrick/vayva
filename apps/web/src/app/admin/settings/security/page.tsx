'use client';

import React from 'react';
import { AdminShell } from '@/components/admin-shell';
import { GlassPanel } from '@/components/ui/glass-panel';
import { Button } from '@/components/ui/button';
import { Icon } from '@/components/ui/icon';

export default function TwoFactorPage() {
    return (
        <AdminShell breadcrumb="Settings / Security" title="Two-Factor Authentication">
            <div className="max-w-2xl">
                <GlassPanel className="p-8 flex flex-col gap-6">
                    <div className="flex items-start justify-between">
                        <div>
                            <h2 className="text-xl font-bold text-white flex items-center gap-3">
                                Two-Factor Authentication (2FA)
                                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-white/5 text-text-secondary uppercase tracking-widest border border-white/10">Coming Soon</span>
                            </h2>
                            <p className="text-text-secondary mt-2 max-w-lg">
                                Add an extra layer of security to your account by requiring more than just a password to log in.
                            </p>
                        </div>
                        <div className="px-3 py-1 rounded bg-white/5 text-text-secondary text-sm font-medium border border-white/10">
                            Not Enabled
                        </div>
                    </div>

                    <div className="grid gap-4 mt-4">
                        <div className="p-4 rounded-xl border border-white/10 bg-white/5 opacity-50 cursor-not-allowed flex items-center gap-4">
                            <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center">
                                <Icon name="smartphone" />
                            </div>
                            <div className="flex-1">
                                <h3 className="font-bold text-white">Authenticator App</h3>
                                <p className="text-sm text-text-secondary">Use Google Authenticator or similar</p>
                            </div>
                            <Button variant="ghost" disabled size="sm">Setup</Button>
                        </div>

                        <div className="p-4 rounded-xl border border-white/10 bg-white/5 opacity-50 cursor-not-allowed flex items-center gap-4">
                            <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center">
                                <Icon name="sms" />
                            </div>
                            <div className="flex-1">
                                <h3 className="font-bold text-white">SMS Message</h3>
                                <p className="text-sm text-text-secondary">Receive code via text message</p>
                            </div>
                            <Button variant="ghost" disabled size="sm">Setup</Button>
                        </div>
                    </div>

                    <Button disabled className="w-full mt-2" title="Available soon">
                        Enable 2FA
                    </Button>
                </GlassPanel>
            </div>
        </AdminShell>
    );
}
