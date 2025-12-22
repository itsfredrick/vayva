'use client';

import React, { useEffect, useState } from 'react';
import { GlassPanel, Button, Icon } from '@vayva/ui';
import { AccountService } from '@/services/account.service';
import { SecurityState } from '@/types/account';
import { Spinner } from '@/components/Spinner';

export default function SecurityPage() {
    const [security, setSecurity] = useState<SecurityState | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const load = async () => {
            const data = await AccountService.getSecurityState();
            setSecurity(data);
            setLoading(false);
        };
        load();
    }, []);

    if (loading || !security) return <div className="text-text-secondary"><Spinner size="sm" /> Loading security settings...</div>;

    return (
        <div className="space-y-6 max-w-2xl">
            <GlassPanel className="p-6">
                <h3 className="text-lg font-bold text-white mb-4">Password</h3>
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-sm text-text-secondary">
                            Last changed {new Date(security.lastPasswordChange).toLocaleDateString()}
                        </p>
                    </div>
                    <Button variant="outline">Change Password</Button>
                </div>
            </GlassPanel>

            <GlassPanel className="p-6">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-bold text-white">Wallet PIN</h3>
                    <span className={`text-xs px-2 py-1 rounded font-bold uppercase ${security.walletPinSet ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'}`}>
                        {security.walletPinSet ? 'Active' : 'Not Set'}
                    </span>
                </div>
                <p className="text-sm text-text-secondary mb-4">
                    Your Wallet PIN is required for withdrawals and sensitive actions.
                </p>
                <div className="flex gap-2">
                    <Button variant="primary">
                        {security.walletPinSet ? 'Change PIN' : 'Set PIN'}
                    </Button>
                </div>
            </GlassPanel>

            <GlassPanel className="p-6">
                <h3 className="text-lg font-bold text-white mb-4">Active Sessions</h3>
                <div className="space-y-4">
                    {security.activeSessions.map(session => (
                        <div key={session.id} className="flex items-center justify-between p-3 rounded bg-white/5">
                            <div className="flex items-center gap-3">
                                <Icon name={"Laptop" as any} className="text-text-secondary" />
                                <div>
                                    <p className="text-white text-sm font-medium">{session.device} {session.isCurrent && <span className="text-green-500 text-xs ml-2">(Current)</span>}</p>
                                    <p className="text-xs text-text-secondary">{session.location} • {session.lastActive}</p>
                                </div>
                            </div>
                            {!session.isCurrent && (
                                <Button variant="ghost" size="sm" className="text-red-500">Revoke</Button>
                            )}
                        </div>
                    ))}
                    <div className="pt-2">
                        <Button variant="outline" className="w-full text-red-500 border-red-500/20 hover:bg-red-500/10">Sign out of all other sessions</Button>
                    </div>
                </div>
            </GlassPanel>
        </div>
    );
}
