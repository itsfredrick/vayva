'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { AppShell, Button, GlassPanel, Input, Icon } from '@vayva/ui';
import { useAuth } from '@/context/AuthContext';
import { StoreService } from '@/services/store';
import Cookies from 'js-cookie';

export default function SettingsPage() {
    const router = useRouter();
    const { user } = useAuth();
    const [activeTab, setActiveTab] = useState('general');
    const storeId = Cookies.get('vayva_store_id');

    // Form States
    const [storeName, setStoreName] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (storeId) {
            StoreService.get(storeId).then(store => {
                setStoreName(store.name);
            }).catch(console.error);
        }
    }, [storeId]);

    const handleSaveStore = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!storeId) return;
        setLoading(true);
        try {
            await StoreService.update(storeId, { name: storeName });
            // Show toast (mock)
            alert('Store settings saved');
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <AppShell sidebar={<></>} header={<></>}>
            <div className="max-w-4xl mx-auto flex flex-col gap-4 p-4">
                <h1 className="text-2xl font-bold text-white">Settings</h1>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 max-w-6xl mx-auto">
                {/* Sidebar */}
                <GlassPanel className="col-span-1 p-4 space-y-2">
                    <button
                        onClick={() => setActiveTab('general')}
                        className={`w-full text-left px-4 py-2 rounded-lg transition-colors ${activeTab === 'general' ? 'bg-white/10 text-white' : 'text-text-secondary hover:bg-white/5'}`}
                    >
                        General
                    </button>
                    <button
                        onClick={() => setActiveTab('team')}
                        className={`w-full text-left px-4 py-2 rounded-lg transition-colors ${activeTab === 'team' ? 'bg-white/10 text-white' : 'text-text-secondary hover:bg-white/5'}`}
                    >
                        Team
                    </button>
                    <button
                        onClick={() => setActiveTab('billing')}
                        className={`w-full text-left px-4 py-2 rounded-lg transition-colors ${activeTab === 'billing' ? 'bg-white/10 text-white' : 'text-text-secondary hover:bg-white/5'}`}
                    >
                        Billing
                    </button>
                    <button
                        onClick={() => setActiveTab('delivery')}
                        className={`w-full text-left px-4 py-2 rounded-lg transition-colors ${activeTab === 'delivery' ? 'bg-white/10 text-white' : 'text-text-secondary hover:bg-white/5'}`}
                    >
                        Delivery
                    </button>
                </GlassPanel>

                {/* Content */}
                <div className="col-span-3">
                    {activeTab === 'general' && (
                        <GlassPanel className="p-8">
                            <h2 className="text-xl font-bold text-white mb-6">Store Settings</h2>
                            <form onSubmit={handleSaveStore} className="space-y-6 max-w-lg">
                                <Input
                                    label="Store Name"
                                    value={storeName}
                                    onChange={e => setStoreName(e.target.value)}
                                />
                                <Button type="submit" disabled={loading}>
                                    {loading ? 'Saving...' : 'Save Changes'}
                                </Button>
                            </form>
                        </GlassPanel>
                    )}

                    {activeTab === 'team' && (
                        <GlassPanel className="p-8">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-xl font-bold text-white">Team Members</h2>
                                <Button variant="secondary" size="sm">Invite Member</Button>
                            </div>
                            <div className="space-y-4">
                                <div className="flex items-center justify-between p-4 border border-white/10 rounded-lg">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">
                                            {(user as any)?.firstName ? (user as any).firstName.charAt(0) : user?.email?.charAt(0) || 'U'}
                                        </div>
                                        <div>
                                            <div className="text-white font-medium">{(user as any)?.firstName} {(user as any)?.lastName}</div>
                                            <div className="text-sm text-text-secondary">{user?.email}</div>
                                        </div>
                                    </div>
                                    <div className="text-sm text-text-secondary">Owner</div>
                                </div>
                                {/* Mock Member */}
                                <div className="flex items-center justify-between p-4 border border-white/10 rounded-lg opacity-50">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white font-bold">
                                            M
                                        </div>
                                        <div>
                                            <div className="text-white font-medium">Manager</div>
                                            <div className="text-sm text-text-secondary">manager@example.com</div>
                                        </div>
                                    </div>
                                    <div className="text-sm text-text-secondary">Manager</div>
                                </div>
                            </div>
                        </GlassPanel>
                    )}

                    {activeTab === 'billing' && (
                        <GlassPanel className="p-8 text-center py-20">
                            <Icon name={"CreditCard" as any} className="w-16 h-16 mx-auto mb-4 text-text-secondary opacity-50" />
                            <h3 className="text-lg font-medium text-white mb-2">Billing & Plans</h3>
                            <p className="text-text-secondary mb-6">Manage your subscription and payment methods.</p>
                            <Button variant="secondary" disabled>Coming in V2</Button>
                        </GlassPanel>
                    )}

                    {activeTab === 'delivery' && (
                        <div className="space-y-6">
                            <iframe
                                src="/admin/settings/delivery"
                                className="w-full h-[800px] border-none"
                                title="Delivery Settings"
                            />
                            {/* Note: Embedding via iframe is a quick hack to reuse the page file I created. 
                                 Ideally I should import the component. 
                                 Let's do this properly in the next step by moving the component.
                                 For now, I'll direct user to the page or just render a placeholder 
                                 until I refactor the page into a component.
                             */}
                            <GlassPanel className="p-8">
                                <h2 className="text-xl font-bold text-white mb-6">Delivery Configuration</h2>
                                <p className="text-text-secondary mb-4">Click below to manage your pickup address and delivery partners.</p>
                                <Button onClick={() => router.push('/admin/settings/delivery')}>
                                    Open Delivery Settings
                                </Button>
                            </GlassPanel>
                        </div>
                    )}
                </div>
            </div>
        </AppShell>
    );
}
