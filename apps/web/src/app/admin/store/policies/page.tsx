'use client';

import React, { useState } from 'react';
import { AdminShell } from '@/components/admin-shell';
import { GlassPanel } from '@/components/ui/glass-panel';
import { Button } from '@/components/ui/button';

const POLICIES = ['Returns', 'Shipping', 'Privacy', 'Terms'];

export default function PoliciesPage() {
    const [activeTab, setActiveTab] = useState('Returns');

    return (
        <AdminShell title="Store Policies" breadcrumb="Storefront / Policies">
            <div className="flex flex-col gap-6 max-w-5xl mx-auto pb-20">
                {/* Sticky Header */}
                <div className="flex items-center justify-between sticky top-[80px] z-30 py-4 bg-[#142210]/95 backdrop-blur-xl border-b border-white/5 -mx-6 px-6 sm:mx-0 sm:px-0 sm:bg-transparent sm:border-none sm:backdrop-blur-none sm:static">
                    <h1 className="text-2xl font-bold text-white">Policies</h1>
                    <Button>Save Policies</Button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left: Editor */}
                    <div className="lg:col-span-2 flex flex-col gap-6">
                        <GlassPanel className="p-0 overflow-hidden">
                            {/* Tabs */}
                            <div className="flex border-b border-white/5 overflow-x-auto no-scrollbar">
                                {POLICIES.map(policy => (
                                    <button
                                        key={policy}
                                        onClick={() => setActiveTab(policy)}
                                        className={`px-6 py-4 text-sm font-bold border-b-2 transition-colors whitespace-nowrap ${activeTab === policy ? 'border-primary text-white bg-white/5' : 'border-transparent text-text-secondary hover:text-white hover:bg-white/5'}`}
                                    >
                                        {policy}
                                    </button>
                                ))}
                            </div>

                            {/* Content */}
                            <div className="p-6">
                                <div className="flex items-center justify-between mb-6">
                                    <h3 className="font-bold text-white text-lg">{activeTab} Policy</h3>
                                    <div className="flex items-center gap-3">
                                        <span className="text-sm text-text-secondary">Enable page</span>
                                        <input type="checkbox" className="toggle toggle-sm toggle-primary" defaultChecked />
                                    </div>
                                </div>

                                <textarea
                                    className="w-full bg-black/20 border border-white/10 rounded-xl p-6 text-sm text-white resize-none focus:outline-none focus:border-primary transition-colors min-h-[400px] font-mono leading-relaxed"
                                    placeholder={`Enter your ${activeTab.toLowerCase()} policy here...`}
                                >{`This is a sample ${activeTab} policy template.\n\nItems can be returned within 7 days of delivery.\nCustomer covers delivery fees.`}</textarea>
                            </div>
                        </GlassPanel>
                    </div>

                    {/* Right: Info */}
                    <div className="flex flex-col gap-6">
                        <GlassPanel className="p-6 bg-primary/5 border-primary/20">
                            <h3 className="font-bold text-white mb-2">AI Integration</h3>
                            <p className="text-sm text-text-secondary">
                                Your <strong>WhatsApp AI Agent</strong> reads these policies to answer customer questions automatically.
                            </p>
                            <div className="mt-4 p-3 bg-black/20 rounded-lg text-xs text-white/70 italic border-l-2 border-primary">
                                "Do you accept returns?"<br />
                                "Yes, within 7 days according to our policy."
                            </div>
                        </GlassPanel>

                        <GlassPanel className="p-6">
                            <h3 className="font-bold text-white mb-4">Templates</h3>
                            <div className="flex flex-col gap-3">
                                <Button variant="outline" className="justify-start text-xs">Replace with Standard Template</Button>
                                <Button variant="outline" className="justify-start text-xs">Strict No-Return Policy</Button>
                            </div>
                        </GlassPanel>
                    </div>
                </div>
            </div>
        </AdminShell>
    );
}
