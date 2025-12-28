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

export default function ProfileSettingsPage() {
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [data, setData] = useState({
        store: { name: '', category: '', contacts: { phone: '', email: '', whatsapp: '' } },
        profile: { displayName: '', bio: '', state: '', city: '', whatsappNumberE164: '', websiteUrl: '' }
    });

    useEffect(() => {
        fetch('/api/settings/profile')
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
            const res = await fetch('/api/settings/profile', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });
            if (!res.ok) throw new Error('Failed to save');
            alert('Profile updated successfully');
        } catch (err) {
            console.error(err);
            alert('Error saving profile');
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <div className="p-8 animate-pulse space-y-4 text-white">Loading profile settings...</div>;

    return (
        <div className="max-w-4xl mx-auto py-8 px-4 space-y-8 animate-in fade-in duration-500">
            <div>
                <h1 className="text-3xl font-extrabold text-white">Business Profile</h1>
                <p className="text-text-secondary font-medium mt-1">Manage your business identity and public information.</p>
            </div>

            <form onSubmit={handleSave} className="space-y-8">
                <GlassPanel className="p-8 space-y-6">
                    <h2 className="text-xl font-bold text-white border-b border-white/5 pb-4">Identity</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Input
                            label="Business Name"
                            value={data.store.name}
                            onChange={e => setData({ ...data, store: { ...data.store, name: e.target.value } })}
                            required
                        />
                        <Input
                            label="Legal Display Name"
                            value={data.profile.displayName}
                            onChange={e => setData({ ...data, profile: { ...data.profile, displayName: e.target.value } })}
                        />
                        <div className="md:col-span-2">
                            <Input
                                label="Business Bio"
                                value={data.profile.bio || ''}
                                onChange={e => setData({ ...data, profile: { ...data.profile, bio: e.target.value } })}
                                placeholder="A brief description of your business..."
                            />
                        </div>
                    </div>
                </GlassPanel>

                <GlassPanel className="p-8 space-y-6">
                    <h2 className="text-xl font-bold text-white border-b border-white/5 pb-4">Location & Online</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Input
                            label="State"
                            value={data.profile.state || ''}
                            onChange={e => setData({ ...data, profile: { ...data.profile, state: e.target.value } })}
                        />
                        <Input
                            label="City"
                            value={data.profile.city || ''}
                            onChange={e => setData({ ...data, profile: { ...data.profile, city: e.target.value } })}
                        />
                        <Input
                            label="Website URL"
                            value={data.profile.websiteUrl || ''}
                            onChange={e => setData({ ...data, profile: { ...data.profile, websiteUrl: e.target.value } })}
                            placeholder="https://yourstore.com"
                        />
                        <Input
                            label="Category"
                            value={data.store.category}
                            onChange={e => setData({ ...data, store: { ...data.store, category: e.target.value } })}
                        />
                    </div>
                </GlassPanel>

                <GlassPanel className="p-8 space-y-6">
                    <h2 className="text-xl font-bold text-white border-b border-white/5 pb-4">Contact Channels</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <Input
                            label="Email"
                            value={(data.store.contacts as any)?.email || ''}
                            onChange={e => setData({ ...data, store: { ...data.store, contacts: { ...(data.store.contacts as any), email: e.target.value } } })}
                        />
                        <Input
                            label="Phone"
                            value={(data.store.contacts as any)?.phone || ''}
                            onChange={e => setData({ ...data, store: { ...data.store, contacts: { ...(data.store.contacts as any), phone: e.target.value } } })}
                        />
                        <Input
                            label="WhatsApp"
                            value={data.profile.whatsappNumberE164 || ''}
                            onChange={e => setData({ ...data, profile: { ...data.profile, whatsappNumberE164: e.target.value } })}
                            placeholder="+234..."
                        />
                    </div>
                </GlassPanel>

                <div className="flex justify-end gap-3 sticky bottom-8 py-4 bg-black/50 backdrop-blur-lg rounded-2xl px-8 border border-white/5">
                    <Button variant="ghost" type="button" onClick={() => window.location.reload()}>Discard</Button>
                    <Button type="submit" isLoading={saving} className="px-12">Save Business Profile</Button>
                </div>
            </form>
        </div>
    );
}
