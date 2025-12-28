'use client';

import { useState, useEffect } from 'react';
import { Button, Input, GlassPanel, AppShell } from '@vayva/ui';
import { CheckCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function DeliveryControlCenter() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [settings, setSettings] = useState<any>(null);
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        fetchSettings();
    }, []);

    const fetchSettings = async () => {
        setLoading(true);
        try {
            const res = await fetch('/api/settings/delivery');
            if (res.ok) {
                const data = await res.json();
                setSettings(data);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        setIsSaving(true);
        try {
            const res = await fetch('/api/settings/delivery', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(settings)
            });
            if (!res.ok) {
                const err = await res.json();
                alert(err.error || 'Failed to save');
            } else {
                alert('Settings saved!');
            }
        } catch (error) {
            console.error(error);
            alert('Error saving settings');
        } finally {
            setIsSaving(false);
        }
    };

    if (loading || !settings) return <div className="p-8 text-white">Loading...</div>;

    const isKwik = settings.provider === 'KWIK';

    return (
        <AppShell sidebar={<></>} header={<></>}>
            <div className="p-8 max-w-4xl mx-auto space-y-6">
                <div>
                    <h1 className="text-2xl font-bold text-white">Delivery Control Center</h1>
                    <p className="text-gray-400">Manage your fulfillment providers and pickup locations.</p>
                </div>

                <GlassPanel className="p-6">
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h2 className="text-lg font-bold text-white">Enable Delivery</h2>
                            <p className="text-sm text-gray-400">Allow customers to choose delivery at checkout.</p>
                        </div>
                        <div className="flex items-center gap-2">
                            <input
                                type="checkbox"
                                className="toggle checkbox checkbox-primary"
                                checked={settings.isEnabled}
                                onChange={e => setSettings({ ...settings, isEnabled: e.target.checked })}
                            />
                            <span className={settings.isEnabled ? 'text-green-400 font-bold' : 'text-gray-500'}>
                                {settings.isEnabled ? 'ON' : 'OFF'}
                            </span>
                        </div>
                    </div>

                    {/* Auto-Dispatch Settings */}
                    {settings.isEnabled && (
                        <div className="mb-8 p-4 bg-white/5 rounded-xl border border-white/10">
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <h3 className="font-bold text-white flex items-center gap-2">
                                        ⚡ Auto-Dispatch
                                        <span className="text-[10px] bg-purple-500 text-white px-2 rounded-full">BETA</span>
                                    </h3>
                                    <p className="text-xs text-gray-400">Automatically create delivery jobs when orders are paid.</p>
                                </div>
                                <div className="flex items-center gap-2">
                                    <input
                                        type="checkbox"
                                        className="toggle toggle-sm checkbox-secondary"
                                        disabled={!settings.isEnabled || (settings.provider === 'KWIK' && !settings.isKwikConfigured)}
                                        checked={settings.autoDispatchEnabled}
                                        onChange={e => setSettings({ ...settings, autoDispatchEnabled: e.target.checked })}
                                    />
                                </div>
                            </div>

                            {settings.autoDispatchEnabled && (
                                <div className="space-y-4 pt-2 border-t border-white/10">
                                    {/* Mode Selection */}
                                    <div className="grid grid-cols-2 gap-4">
                                        <label className={`cursor-pointer p-3 rounded-lg border flex items-center gap-3 ${settings.autoDispatchMode === 'CONFIRM' ? 'bg-purple-500/10 border-purple-500' : 'border-gray-600'}`}>
                                            <input
                                                type="radio"
                                                name="dispatchMode"
                                                className="radio radio-xs radio-primary"
                                                checked={settings.autoDispatchMode === 'CONFIRM'}
                                                onChange={() => setSettings({ ...settings, autoDispatchMode: 'CONFIRM' })}
                                            />
                                            <div>
                                                <div className="text-sm font-bold text-white">Confirm First</div>
                                                <div className="text-[10px] text-gray-400">Mark as "Pending Dispatch" for admin review.</div>
                                            </div>
                                        </label>
                                        <label className={`cursor-pointer p-3 rounded-lg border flex items-center gap-3 ${settings.autoDispatchMode === 'AUTO' ? 'bg-green-500/10 border-green-500' : 'border-gray-600'}`}>
                                            <input
                                                type="radio"
                                                name="dispatchMode"
                                                className="radio radio-xs radio-success"
                                                checked={settings.autoDispatchMode === 'AUTO'}
                                                onChange={() => setSettings({ ...settings, autoDispatchMode: 'AUTO' })}
                                            />
                                            <div>
                                                <div className="text-sm font-bold text-white">Fully Automatic</div>
                                                <div className="text-[10px] text-gray-400">Dispatch via provider immediately after payment.</div>
                                            </div>
                                        </label>
                                    </div>

                                    {/* Channel Toggles */}
                                    <div className="flex gap-6">
                                        <label className="flex items-center gap-2 cursor-pointer">
                                            <input
                                                type="checkbox"
                                                className="checkbox checkbox-xs"
                                                checked={settings.autoDispatchWhatsapp}
                                                onChange={e => setSettings({ ...settings, autoDispatchWhatsapp: e.target.checked })}
                                            />
                                            <span className="text-sm text-gray-300">WhatsApp Orders</span>
                                        </label>
                                        <label className="flex items-center gap-2 cursor-pointer">
                                            <input
                                                type="checkbox"
                                                className="checkbox checkbox-xs"
                                                checked={settings.autoDispatchStorefront}
                                                onChange={e => setSettings({ ...settings, autoDispatchStorefront: e.target.checked })}
                                            />
                                            <span className="text-sm text-gray-300">Storefront Orders</span>
                                        </label>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* Provider Selection */}
                        <div className="space-y-4">
                            <label className="text-sm font-medium text-gray-300">Delivery Provider</label>
                            <div className="grid grid-cols-1 gap-2">
                                <div
                                    onClick={() => setSettings({ ...settings, provider: 'CUSTOM' })}
                                    className={`cursor-pointer p-4 rounded-xl border-2 transition-all ${!isKwik ? 'border-green-500 bg-white/5' : 'border-white/10 hover:border-white/20'}`}
                                >
                                    <div className="flex justify-between items-center text-white">
                                        <span className="font-bold">Custom Courier</span>
                                        {!isKwik && <CheckCircle className="text-green-500 w-5 h-5" />}
                                    </div>
                                    <p className="text-xs text-gray-400 mt-1">Handle deliveries yourself or use your own logistics partners. You manually update status order-by-order.</p>
                                </div>

                                <div
                                    onClick={() => setSettings({ ...settings, provider: 'KWIK' })}
                                    className={`cursor-pointer p-4 rounded-xl border-2 transition-all ${isKwik ? 'border-blue-500 bg-blue-500/10' : 'border-white/10 hover:border-white/20'}`}
                                >
                                    <div className="flex justify-between items-center text-white">
                                        <span className="font-bold flex items-center gap-2">
                                            Kwik Delivery <span className="text-[10px] bg-blue-500 text-white px-2 py-0.5 rounded-full">BETA</span>
                                        </span>
                                        {isKwik && <CheckCircle className="text-blue-500 w-5 h-5" />}
                                    </div>
                                    <p className="text-xs text-gray-400 mt-1">Automated dispatch with Kwik. Requires integration.</p>
                                    {isKwik && (
                                        <div className={`mt-2 text-xs p-2 rounded ${settings.isKwikConfigured ? 'bg-green-500/20 text-green-300' : 'bg-yellow-500/20 text-yellow-300'}`}>
                                            {settings.isKwikConfigured
                                                ? '✅ Kwik API Connected. Dispatch enabled.'
                                                : '⚠ Kwik API Key missing. Set KWIK_API_KEY in environment to enable.'}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Pickup Address */}
                        <div className="space-y-4">
                            <div className="flex justify-between items-center">
                                <label className="text-sm font-medium text-gray-300">Pickup Location (Required)</label>
                                {!settings.pickup?.addressLine1 && settings.isEnabled && (
                                    <span className="text-xs text-red-400 font-bold">⚠ Missing</span>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Input
                                    placeholder="Store/Contact Name"
                                    value={settings.pickup.name || ''}
                                    onChange={e => setSettings({ ...settings, pickup: { ...settings.pickup, name: e.target.value } })}
                                />
                                <Input
                                    placeholder="Phone Number"
                                    value={settings.pickup.phone || ''}
                                    onChange={e => setSettings({ ...settings, pickup: { ...settings.pickup, phone: e.target.value } })}
                                />
                                <Input
                                    placeholder="Address Line 1"
                                    value={settings.pickup.addressLine1 || ''}
                                    onChange={e => setSettings({ ...settings, pickup: { ...settings.pickup, addressLine1: e.target.value } })}
                                />
                                <Input
                                    placeholder="Address Line 2 (Optional)"
                                    value={settings.pickup.addressLine2 || ''}
                                    onChange={e => setSettings({ ...settings, pickup: { ...settings.pickup, addressLine2: e.target.value } })}
                                />
                                <div className="grid grid-cols-2 gap-2">
                                    <Input
                                        placeholder="City"
                                        value={settings.pickup.city || ''}
                                        onChange={e => setSettings({ ...settings, pickup: { ...settings.pickup, city: e.target.value } })}
                                    />
                                    <Input
                                        placeholder="State"
                                        value={settings.pickup.state || ''}
                                        onChange={e => setSettings({ ...settings, pickup: { ...settings.pickup, state: e.target.value } })}
                                    />
                                </div>
                                <Input
                                    placeholder="Landmark (Optional)"
                                    value={settings.pickup.landmark || ''}
                                    onChange={e => setSettings({ ...settings, pickup: { ...settings.pickup, landmark: e.target.value } })}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="mt-8 flex justify-end">
                        <Button onClick={handleSave} isLoading={isSaving} size="lg">Save Changes</Button>
                    </div>
                </GlassPanel>
            </div>
        </AppShell>
    );
}
