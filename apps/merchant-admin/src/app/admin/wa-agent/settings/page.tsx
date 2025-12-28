'use client';

import React, { useState, useEffect } from 'react';
import { AdminShell } from '@/components/admin-shell';
import { WaAgentService, WaSettings, AiProfile } from '@/services/wa-agent';
import { Button, Icon, cn } from '@vayva/ui';
import { motion } from 'framer-motion';

export default function WaSettingsPage() {
    const [settings, setSettings] = useState<WaSettings | null>(null);
    const [profile, setProfile] = useState<AiProfile | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [isDirty, setIsDirty] = useState(false);
    const [activeTab, setActiveTab] = useState('settings');
    const [testQuery, setTestQuery] = useState('');
    const [testResponse, setTestResponse] = useState<any>(null);
    const [usage, setUsage] = useState<any>(null);

    useEffect(() => {
        const load = async () => {
            const [s, p, u] = await Promise.all([
                WaAgentService.getSettings(),
                WaAgentService.getProfile(),
                fetch('/api/ai/usage').then(res => res.json())
            ]);
            setSettings(s);
            setProfile(p);
            setUsage(u?.data?.current);
            setIsLoading(false);
        };
        load();
    }, []);

    const updateSettings = (key: keyof WaSettings, value: any) => {
        if (!settings) return;
        setSettings({ ...settings, [key]: value });
        setIsDirty(true);
    };

    const updateProfile = (key: keyof AiProfile, value: any) => {
        if (!profile) return;
        setProfile({ ...profile, [key]: value });
        setIsDirty(true);
    };

    const handleSave = async () => {
        if (!settings || !profile) return;
        setIsSaving(true);
        await Promise.all([
            WaAgentService.updateSettings(settings),
            WaAgentService.updateProfile(profile)
        ]);
        setIsSaving(false);
        setIsDirty(false);
    };

    const handleTest = async () => {
        if (!testQuery) return;
        setTestResponse({ loading: true });
        const res = await WaAgentService.sendTestMessage(testQuery);
        setTestResponse(res.data);
    };

    if (isLoading) return <AdminShell title="Loading..."><div className="p-12 text-center">Configuring your AI...</div></AdminShell>;
    if (!settings || !profile) return null;

    return (
        <AdminShell title="WhatsApp Agent Settings" breadcrumb="AI Engine">
            <div className="flex flex-col lg:flex-row gap-8 items-start max-w-6xl mx-auto pb-24 relative">

                {/* Left: Configuration */}
                <div className="flex-1 w-full flex flex-col gap-6">

                    {/* Starter Branding Notice */}
                    {usage?.planKey === 'STARTER' && (
                        <div className="bg-blue-50 border border-blue-100 p-4 rounded-xl flex items-start gap-3">
                            <Icon name="Info" size={20} className="text-blue-500 mt-0.5" />
                            <div>
                                <p className="text-xs font-bold text-blue-900">Platform Transparency Active</p>
                                <p className="text-[10px] text-blue-700 leading-relaxed mt-1">
                                    Trial accounts include a <span className="font-bold">Powered by Vayva</span> badge on their storefront.
                                    Upgrade to Growth to remove all platform branding.
                                </p>
                            </div>
                        </div>
                    )}

                    {/* Enable Section */}
                    <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm">
                        <div className="flex items-center justify-between">
                            <div>
                                <h3 className="font-bold text-lg text-[#0B0B0B]">Activate AI Agent</h3>
                                <p className="text-sm text-gray-500">When enabled, the AI will reply to WhatsApp customers automatically.</p>
                            </div>
                            <button
                                onClick={() => updateSettings('enabled', !settings.enabled)}
                                className={cn(
                                    "w-12 h-6 rounded-full transition-colors relative",
                                    settings.enabled ? "bg-green-500" : "bg-gray-200"
                                )}
                            >
                                <div className={cn(
                                    "w-5 h-5 bg-white rounded-full absolute top-0.5 transition-all shadow-sm",
                                    settings.enabled ? "left-6.5" : "left-0.5"
                                )} />
                            </button>
                        </div>
                    </div>

                    {/* Tone & Style */}
                    <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm space-y-6 relative overflow-hidden">
                        {usage?.planKey === 'STARTER' && <div className="absolute inset-0 bg-white/40 backdrop-blur-[1px] z-10 flex items-center justify-center">
                            <div className="bg-white shadow-xl border border-gray-100 p-4 rounded-xl text-center max-w-[240px]">
                                <p className="text-[10px] font-bold text-gray-400 uppercase mb-1">Premium Feature</p>
                                <p className="text-xs font-medium text-gray-900 mb-3">Upgrade to Growth to unlock custom Tone & Style settings.</p>
                                <Button size="sm" className="h-7 text-[10px] w-full" onClick={() => window.location.href = '/admin/settings/billing'}>Upgrade Now</Button>
                            </div>
                        </div>}
                        <h4 className="text-sm font-bold text-gray-400 uppercase tracking-widest">Tone & Style</h4>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-gray-600">Tone Preset</label>
                                <select
                                    className="w-full h-10 px-3 border border-gray-200 rounded-lg text-sm bg-white disabled:bg-gray-50"
                                    value={profile.tonePreset}
                                    onChange={(e) => updateProfile('tonePreset', e.target.value)}
                                    disabled={usage?.planKey === 'STARTER'}
                                >
                                    <option value="Friendly">Friendly & Helpful</option>
                                    <option value="Luxury">Professional & High-Luxury</option>
                                    <option value="Playful">Playful & Casual</option>
                                    <option value="Minimal">Minimal & Direct</option>
                                </select>
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-gray-600">Brevity Mode</label>
                                <select
                                    className="w-full h-10 px-3 border border-gray-200 rounded-lg text-sm bg-white disabled:bg-gray-50"
                                    value={profile.brevityMode}
                                    onChange={(e) => updateProfile('brevityMode', e.target.value)}
                                    disabled={usage?.planKey === 'STARTER'}
                                >
                                    <option value="Short">Short (Max 3 sentences)</option>
                                    <option value="Medium">Medium (Detailed replies)</option>
                                </select>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-bold text-gray-600">Persuasion Intensity ({profile.persuasionLevel})</label>
                            <input
                                type="range" min="0" max="3" step="1"
                                className="w-full accent-black disabled:opacity-50"
                                value={profile.persuasionLevel}
                                onChange={(e) => updateProfile('persuasionLevel', parseInt(e.target.value))}
                                disabled={usage?.planKey === 'STARTER'}
                            />
                            <div className="flex justify-between text-[10px] text-gray-400 font-bold">
                                <span>PASSIVE</span>
                                <span>BALANCED</span>
                                <span>ACTIVE</span>
                                <span>AGGRESSIVE</span>
                            </div>
                        </div>
                    </div>

                    {/* Catalog Mode */}
                    <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm space-y-6">
                        <h4 className="text-sm font-bold text-gray-400 uppercase tracking-widest">Knowledge Boundaries</h4>

                        <div className="space-y-4">
                            <button
                                onClick={() => updateSettings('catalogMode', 'StrictCatalogOnly')}
                                className={cn(
                                    "w-full text-left p-4 rounded-xl border transition-all",
                                    settings.catalogMode === 'StrictCatalogOnly' ? "border-black bg-gray-50 bg-opacity-50 ring-1 ring-black" : "border-gray-100 hover:border-gray-200"
                                )}
                            >
                                <div className="flex justify-between items-center">
                                    <span className="font-bold text-sm">Strict Catalog Only</span>
                                    {settings.catalogMode === 'StrictCatalogOnly' && <Icon name="Check" size={16} />}
                                </div>
                                <p className="text-xs text-gray-500 mt-1">AI only answers questions about items in your stock. Best for high-volume stores.</p>
                            </button>

                            <button
                                onClick={() => updateSettings('catalogMode', 'CatalogPlusFAQ')}
                                className={cn(
                                    "w-full text-left p-4 rounded-xl border transition-all",
                                    settings.catalogMode === 'CatalogPlusFAQ' ? "border-black bg-gray-50 bg-opacity-50 ring-1 ring-black" : "border-gray-100 hover:border-gray-200"
                                )}
                            >
                                <div className="flex justify-between items-center">
                                    <span className="font-bold text-sm">Catalog + Policies (FAQ)</span>
                                    {settings.catalogMode === 'CatalogPlusFAQ' && <Icon name="Check" size={16} />}
                                </div>
                                <p className="text-xs text-gray-500 mt-1">AI also explains shipping, returns, and payment methods. Best for comprehensive care.</p>
                            </button>
                        </div>
                    </div>

                    {/* Handoff */}
                    <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm space-y-4 relative overflow-hidden">
                        {usage?.planKey === 'STARTER' && <div className="absolute inset-0 bg-white/40 backdrop-blur-[1px] z-10 flex items-center justify-center">
                            <div className="bg-white shadow-xl border border-gray-100 p-4 rounded-xl text-center max-w-[240px]">
                                <p className="text-[10px] font-bold text-gray-400 uppercase mb-1">Premium Feature</p>
                                <p className="text-xs font-medium text-gray-900 mb-3">Enable Human Handoff to take over chats instantly. Requires Growth.</p>
                                <Button size="sm" className="h-7 text-[10px] w-full" onClick={() => window.location.href = '/admin/settings/billing'}>Upgrade Now</Button>
                            </div>
                        </div>}
                        <h4 className="text-sm font-bold text-gray-400 uppercase tracking-widest">Handoff Rules</h4>
                        <div className="flex items-center justify-between">
                            <span className="text-sm font-medium">Enable Human Handoff</span>
                            <input
                                type="checkbox"
                                checked={settings.humanHandoffEnabled}
                                onChange={e => updateSettings('humanHandoffEnabled', e.target.checked)}
                                className="w-5 h-5 accent-black disabled:opacity-50"
                                disabled={usage?.planKey === 'STARTER'}
                            />
                        </div>
                        {settings.humanHandoffEnabled && (
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-gray-600">Handoff WhatsApp Number / Email</label>
                                <input
                                    className="w-full h-10 px-3 border border-gray-200 rounded-lg text-sm bg-white disabled:bg-gray-50"
                                    placeholder="+234..."
                                    value={settings.handoffDestination}
                                    onChange={e => updateSettings('handoffDestination', e.target.value)}
                                    disabled={usage?.planKey === 'STARTER'}
                                />
                            </div>
                        )}
                    </div>
                </div>

                {/* Right: Preview & Test */}
                <div className="w-full lg:w-96 flex flex-col gap-6 sticky top-24">
                    <div className="bg-[#E5DDD5] rounded-xl overflow-hidden shadow-sm border border-gray-200 flex flex-col">
                        <div className="bg-[#075E54] p-3 flex items-center gap-3 text-white">
                            <Icon name="User" size={24} />
                            <div>
                                <p className="font-bold text-sm">Vayva Assistant</p>
                                <p className="text-[10px] opacity-70">online</p>
                            </div>
                        </div>
                        <div className="p-4 h-[350px] overflow-y-auto flex flex-col gap-4">
                            <div className="self-start bg-white rounded-lg p-2.5 shadow-sm max-w-[85%]">
                                <p className="text-xs leading-relaxed text-[#0B0B0B]">
                                    {profile.greetingTemplate.replace('{customer_name}', 'Amaka')}
                                </p>
                                <p className="text-[9px] text-gray-400 text-right mt-1">10:45 AM</p>
                            </div>

                            {testResponse && (
                                <div className="self-end bg-[#DCF8C6] rounded-lg p-2.5 shadow-sm max-w-[85%]">
                                    <p className="text-xs leading-relaxed text-[#0B0B0B]">{testQuery}</p>
                                </div>
                            )}

                            {testResponse?.loading ? (
                                <div className="self-start bg-white rounded-lg p-3 shadow-sm flex gap-1">
                                    <div className="w-1.5 h-1.5 bg-gray-300 rounded-full animate-bounce" />
                                    <div className="w-1.5 h-1.5 bg-gray-300 rounded-full animate-bounce delay-75" />
                                    <div className="w-1.5 h-1.5 bg-gray-300 rounded-full animate-bounce delay-150" />
                                </div>
                            ) : testResponse?.message && (
                                <div className="self-start bg-white rounded-lg p-2.5 shadow-sm max-w-[85%]">
                                    <p className="text-xs leading-relaxed text-[#0B0B0B]">{testResponse.message}</p>
                                    <p className="text-[9px] text-gray-400 text-right mt-1">Just now</p>
                                </div>
                            )}
                        </div>
                        <div className="bg-white p-3 flex gap-2 border-t border-gray-100">
                            <input
                                className="flex-1 h-9 px-3 bg-gray-100 rounded-full text-xs outline-none focus:ring-1 focus:ring-green-500"
                                placeholder="Test your agent..."
                                value={testQuery}
                                onChange={e => setTestQuery(e.target.value)}
                                onKeyDown={e => e.key === 'Enter' && handleTest()}
                            />
                            <button
                                onClick={handleTest}
                                className="w-9 h-9 bg-[#128C7E] text-white rounded-full flex items-center justify-center hover:bg-[#075E54] transition-colors"
                            >
                                <Icon name="Send" size={16} />
                            </button>
                        </div>
                    </div>

                    {testResponse?.data && (
                        <div className="bg-gray-50 border border-gray-100 rounded-lg p-3">
                            <h5 className="text-[10px] font-bold text-gray-400 uppercase mb-2">Internal AI Trace</h5>
                            <div className="space-y-1">
                                {testResponse.data.suggestedActions?.map((a: string) => (
                                    <div key={a} className="text-[10px] bg-white border border-gray-200 px-2 py-1 rounded text-gray-600">
                                        Suggested Action: {a}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* Sticky Save Bar */}
                <motion.div
                    initial={{ y: 100 }}
                    animate={{ y: isDirty ? 0 : 100 }}
                    className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-[#0B0B0B] text-white px-6 py-3 rounded-full shadow-2xl flex items-center gap-6 z-50 border border-white/10"
                >
                    <span className="text-sm font-medium text-gray-300">Unsaved configuration changes</span>
                    <div className="flex items-center gap-3">
                        <button className="px-3 py-1 hover:bg-white/10 rounded text-sm font-medium transition-colors" onClick={() => setIsDirty(false)}>Discard</button>
                        <Button
                            className="bg-white text-black hover:bg-gray-100 font-bold px-6 py-1.5 rounded-full"
                            onClick={handleSave}
                            isLoading={isSaving}
                        >
                            Save & Deploy
                        </Button>
                    </div>
                </motion.div>

            </div>
        </AdminShell>
    );
}
