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

export default function SecuritySettingsPage() {

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [data, setData] = useState<any>({
        mfaRequired: false,
        sessionTimeoutMinutes: 720,
        sessions: [],
        auditLogs: []
    });

    useEffect(() => {
        fetch('/api/settings/security')
            .then(res => res.json())
            .then(json => {
                setData(json);
                setLoading(false);
            })
            .catch(console.error);
    }, []);

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        try {
            const res = await fetch('/api/settings/security', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    mfaRequired: data.mfaRequired,
                    sessionTimeoutMinutes: data.sessionTimeoutMinutes
                })
            });
            if (!res.ok) throw new Error('Failed to save');
            alert('Security settings updated');
        } catch (err) {
            console.error(err);
            alert('Error saving security settings');
        } finally {
            setSaving(false);
        }
    };

    // --- Deletion Logic ---
    const [deletionStatus, setDeletionStatus] = useState<any>(null);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [deleteStep, setDeleteStep] = useState<'WARNING' | 'CONFIRM' | 'SCHEDULED'>('WARNING');
    const [deletePassword, setDeletePassword] = useState('');
    const [deleteReason, setDeleteReason] = useState('');
    const [deletePhrase, setDeletePhrase] = useState('');
    const [deleteLoading, setDeleteLoading] = useState(false);

    useEffect(() => {
        // Fetch deletion status on mount
        fetch('/api/account/deletion')
            .then(res => res.json())
            .then(json => {
                if (json.status) {
                    setDeletionStatus(json.status);
                    setDeleteStep('SCHEDULED');
                }
            })
            .catch(console.error);
    }, []);

    const handleInitiateDeletion = () => {
        setDeleteStep('WARNING');
        setShowDeleteModal(true);
    };

    const handleConfirmDeletion = async () => {
        if (deletePhrase !== 'DELETE') return alert('Please type DELETE to confirm.');
        // In a real app, verify password via separate API or re-auth mechanism.
        // For this demo, we assume session is active and user provided "intent" via phrase.

        setDeleteLoading(true);
        try {
            const res = await fetch('/api/account/deletion', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ reason: deleteReason })
            });
            const json = await res.json();

            if (!res.ok) {
                if (json.blockers) {
                    alert(`Cannot delete account:\n${json.blockers.join('\n')}`);
                } else {
                    throw new Error(json.error);
                }
                return;
            }

            setDeletionStatus({ status: 'SCHEDULED', scheduledFor: json.scheduledFor });
            setDeleteStep('SCHEDULED');
            setShowDeleteModal(false);
            alert('Account deletion scheduled.');
        } catch (e: any) {
            console.error(e);
            alert(`Error: ${e.message}`);
        } finally {
            setDeleteLoading(false);
        }
    };

    const handleCancelDeletion = async () => {
        if (!confirm('Are you sure you want to cancel the pending deletion?')) return;
        setDeleteLoading(true);
        try {
            const res = await fetch('/api/account/deletion', { method: 'DELETE' });
            if (!res.ok) throw new Error('Failed to cancel');
            setDeletionStatus(null);
            setDeleteStep('WARNING');
            alert('Deletion cancelled.');
        } catch (e: any) {
            alert(e.message);
        } finally {
            setDeleteLoading(false);
        }
    };

    if (loading) return <div className="p-8 text-white">Loading security settings...</div>;

    return (
        <div className="max-w-4xl mx-auto py-8 px-4 space-y-8 animate-in fade-in duration-500">
            <div>
                <h1 className="text-3xl font-extrabold text-white">Security & Access</h1>
                <p className="text-text-secondary font-medium mt-1">Manage 2FA, active sessions, and account audit logs.</p>
            </div>

            {deletionStatus?.status === 'SCHEDULED' && (
                <div className="bg-red-500/10 border border-red-500/20 p-4 rounded-xl flex items-center justify-between text-red-400">
                    <div className="flex items-center gap-3">
                        <Icon name="TriangleAlert" size={20} />
                        <div>
                            <div className="font-bold">Account Deletion Scheduled</div>
                            <div className="text-sm opacity-80">
                                Your account is scheduled for deletion on {new Date(deletionStatus.scheduledFor).toLocaleDateString()}.
                            </div>
                        </div>
                    </div>
                    <Button variant="outline" className="border-red-500/20 hover:bg-red-500/10 text-red-400" onClick={handleCancelDeletion} isLoading={deleteLoading}>
                        Cancel Deletion
                    </Button>
                </div>
            )}

            <form onSubmit={handleSave} className="space-y-8">
                {/* ... Existing GlassPanels ... */}
                <GlassPanel className="p-8 space-y-6">
                    <div className="flex justify-between items-center border-b border-white/5 pb-4">
                        <h2 className="text-xl font-bold text-white">Identity Protection</h2>
                        <div className="flex items-center gap-2">
                            <span className={cn("text-xs font-bold px-2 py-1 rounded-full", data.mfaRequired ? "bg-emerald-500/10 text-emerald-500" : "bg-white/10 text-white/50")}>
                                {data.mfaRequired ? 'ENFORCED' : 'OPTIONAL'}
                            </span>
                        </div>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/10 transition-all hover:bg-white/10">
                        <div className="space-y-1">
                            <h3 className="font-bold text-white">Two-Factor Authentication (2FA)</h3>
                            <p className="text-xs text-text-secondary pr-8">Require an additional code from your authenticator app to sign in.</p>
                        </div>
                        <div
                            onClick={() => setData({ ...data, mfaRequired: !data.mfaRequired })}
                            className={cn(
                                "w-14 h-8 rounded-full p-1 cursor-pointer transition-all duration-300",
                                data.mfaRequired ? "bg-primary" : "bg-white/10"
                            )}
                        >
                            <div className={cn(
                                "w-6 h-6 bg-white rounded-full transition-all duration-300",
                                data.mfaRequired ? "translate-x-6" : "translate-x-0"
                            )} />
                        </div>
                    </div>
                </GlassPanel>

                <GlassPanel className="p-8 space-y-6">
                    <h2 className="text-xl font-bold text-white border-b border-white/5 pb-4">Active Sessions</h2>
                    <div className="space-y-4">
                        {data.sessions.map((session: any) => (
                            <div key={session.id} className="flex items-center justify-between p-4 border border-white/5 rounded-2xl">
                                <div className="flex items-center gap-4">
                                    <div className="p-2 bg-white/5 rounded-lg">
                                        <Icon name={session.device.includes('iPhone') ? "Smartphone" : "Monitor" as any} size={20} />
                                    </div>
                                    <div>
                                        <div className="text-sm font-bold text-white flex items-center gap-2">
                                            {session.device}
                                            {session.isCurrent && <span className="text-[10px] bg-emerald-500/10 text-emerald-500 px-2 rounded-full">Current</span>}
                                        </div>
                                        <div className="text-xs text-text-secondary">{session.location} • last active {new Date(session.lastActive).toLocaleTimeString()}</div>
                                    </div>
                                </div>
                                {!session.isCurrent && <Button variant="ghost" size="sm">Revoke</Button>}
                            </div>
                        ))}
                    </div>
                </GlassPanel>

                <GlassPanel className="p-8 space-y-6">
                    <h2 className="text-xl font-bold text-white border-b border-white/5 pb-4">Audit Logs (Recent)</h2>
                    <div className="space-y-3">
                        {data.auditLogs.map((log: any) => (
                            <div key={log.id} className="flex items-center justify-between py-2 border-b border-white/5">
                                <div className="space-y-1">
                                    <div className="text-sm font-bold text-white">{log.action.replace(/_/g, ' ')}</div>
                                    <div className="text-[10px] text-text-secondary font-mono">{log.actorLabel} • {log.ipAddress || 'unknown ip'}</div>
                                </div>
                                <div className="text-xs text-text-secondary font-medium">
                                    {new Date(log.createdAt).toLocaleDateString()}
                                </div>
                            </div>
                        ))}
                        {data.auditLogs.length === 0 && <p className="text-sm text-text-secondary py-4 italic">No recent activity found.</p>}
                        <Button variant="ghost" size="sm" className="w-full mt-4" type="button" onClick={() => window.location.href = '/admin/settings/audit-logs'}>
                            View Full History
                        </Button>
                    </div>
                </GlassPanel>

                {/* --- DANGER ZONE --- */}
                <div className="border border-red-900/30 rounded-3xl p-8 bg-red-950/5 space-y-6">
                    <h2 className="text-xl font-bold text-red-500 border-b border-red-900/20 pb-4">Danger Zone</h2>
                    <div className="flex items-center justify-between">
                        <div className="space-y-1">
                            <h3 className="font-bold text-white">Delete Account</h3>
                            <p className="text-sm text-text-secondary">
                                Permanently delete your store, products, and customer data. This action cannot be undone immediately if not cancelled within 7 days.
                            </p>
                        </div>
                        <Button
                            type="button"
                            variant="primary"
                            className="bg-red-600 hover:bg-red-700 text-white border-none"
                            onClick={handleInitiateDeletion}
                            disabled={!!deletionStatus}
                        >
                            {deletionStatus ? 'Deletion Pending' : 'Delete Account'}
                        </Button>
                    </div>
                </div>

                <div className="flex justify-end gap-3 sticky bottom-8 py-4 bg-black/50 backdrop-blur-lg rounded-2xl px-8 border border-white/5">
                    <Button variant="ghost" type="button" onClick={() => window.location.reload()}>Discard</Button>
                    <Button type="submit" isLoading={saving} className="px-12">Save Security Settings</Button>
                </div>
            </form>

            {/* --- DELETION MODAL --- */}
            {showDeleteModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                    <div className="bg-[#0A0A0A] border border-white/10 rounded-2xl w-full max-w-md p-6 space-y-6 animate-in zoom-in-95 duration-200">
                        {deleteStep === 'WARNING' && (
                            <>
                                <div className="space-y-2">
                                    <div className="w-12 h-12 bg-red-500/10 rounded-full flex items-center justify-center text-red-500 mb-4">
                                        <Icon name="TriangleAlert" size={24} />
                                    </div>
                                    <h3 className="text-xl font-bold text-white">Delete your account?</h3>
                                    <p className="text-text-secondary">
                                        This will start a <span className="text-white font-bold">7-day grace period</span>. After 7 days, your data will be permanently removed.
                                        You can cancel anytime before then.
                                    </p>
                                    <div className="p-4 bg-white/5 rounded-xl text-sm text-text-secondary space-y-2">
                                        <p>• Your storefront will go offline immediately.</p>
                                        <p>• Active subscriptions will be cancelled.</p>
                                        <p>• Team members will lose access.</p>
                                    </div>
                                </div>
                                <div className="flex gap-3 pt-2">
                                    <Button variant="ghost" onClick={() => setShowDeleteModal(false)} className="flex-1">Cancel</Button>
                                    <Button variant="primary" className="flex-1 bg-red-600 hover:bg-red-700 border-none" onClick={() => setDeleteStep('CONFIRM')}>
                                        Continue
                                    </Button>
                                </div>
                            </>
                        )}

                        {deleteStep === 'CONFIRM' && (
                            <>
                                <div className="space-y-4">
                                    <h3 className="text-xl font-bold text-white">Final Confirmation</h3>

                                    <div className="space-y-2">
                                        <label className="text-xs uppercase font-bold text-text-secondary">Reason (Optional)</label>
                                        <Input
                                            placeholder="Why are you leaving?"
                                            value={deleteReason}
                                            onChange={(e) => setDeleteReason(e.target.value)}
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-xs uppercase font-bold text-text-secondary">Type "DELETE" to confirm</label>
                                        <Input
                                            placeholder="DELETE"
                                            value={deletePhrase}
                                            onChange={(e) => setDeletePhrase(e.target.value)}
                                            className="border-red-500/50 focus:border-red-500"
                                        />
                                    </div>
                                </div>
                                <div className="flex gap-3 pt-2">
                                    <Button variant="ghost" onClick={() => setDeleteStep('WARNING')} className="flex-1">Back</Button>
                                    <Button
                                        variant="primary"
                                        className="flex-1 bg-red-600 hover:bg-red-700 border-none"
                                        isLoading={deleteLoading}
                                        onClick={handleConfirmDeletion}
                                        disabled={deletePhrase !== 'DELETE'}
                                    >
                                        Delete Account
                                    </Button>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
