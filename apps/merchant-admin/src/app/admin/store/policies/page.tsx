'use client';

import React, { useState } from 'react';
import { AdminShell } from '@/components/admin-shell';
import { GlassPanel, Button, Icon } from '@vayva/ui';

const POLICIES = ['Returns', 'Shipping', 'Privacy', 'Terms'];

export default function PoliciesPage() {
    const [activeTab, setActiveTab] = useState('Returns');

    return (
        <AdminShell title="Store Policies" breadcrumb="Storefront / Policies">
            <div className="flex flex-col gap-6 max-w-5xl mx-auto pb-20">
                {/* Sticky Header */}
                <div className="flex items-center justify-between sticky top-[80px] z-30 py-4 bg-[#FBFCFC]/95 backdrop-blur-xl border-b border-gray-100 -mx-6 px-6 sm:mx-0 sm:px-0 sm:bg-transparent sm:border-none sm:backdrop-blur-none sm:static">
                    <h1 className="text-2xl font-bold text-black border-none bg-transparent">Policies</h1>
                    <div className="flex items-center gap-3">
                        <a
                            href={`http://localhost:3001/policies/${activeTab.toLowerCase()}`}
                            target="_blank"
                            className="px-4 py-2 border border-gray-200 rounded-lg text-xs font-bold text-gray-400 hover:text-black hover:border-black transition-all flex items-center gap-2"
                        >
                            View on Storefront <Icon name={"ExternalLink" as any} size={12} />
                        </a>
                        <Button className="!bg-black !text-white !rounded-lg !h-9 !px-4 text-xs">Save Policies</Button>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left: Editor */}
                    <div className="lg:col-span-2 flex flex-col gap-6">
                        <div className="bg-white border border-gray-100 rounded-[24px] shadow-sm overflow-hidden">
                            {/* Tabs */}
                            <div className="flex border-b border-gray-50 overflow-x-auto no-scrollbar">
                                {POLICIES.map(policy => (
                                    <button
                                        key={policy}
                                        onClick={() => setActiveTab(policy)}
                                        className={`px-8 py-5 text-sm font-bold border-b-2 transition-all whitespace-nowrap ${activeTab === policy ? 'border-black text-black bg-gray-50/50' : 'border-transparent text-gray-400 hover:text-black hover:bg-gray-50'}`}
                                    >
                                        {policy}
                                    </button>
                                ))}
                            </div>

                            {/* Content */}
                            <div className="p-8">
                                <div className="flex items-center justify-between mb-8">
                                    <h3 className="font-bold text-black text-xl tracking-tight" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>{activeTab} Policy</h3>
                                    <div className="flex items-center gap-3">
                                        <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Enable page</span>
                                        <input type="checkbox" className="w-10 h-5 bg-gray-200 rounded-full appearance-none checked:bg-black transition-colors relative cursor-pointer before:content-[''] before:absolute before:w-4 before:h-4 before:bg-white before:rounded-full before:top-0.5 before:left-0.5 checked:before:translate-x-5 before:transition-transform" defaultChecked />
                                    </div>
                                </div>

                                <textarea
                                    className="w-full bg-gray-50/50 border border-gray-100 rounded-2xl p-8 text-[15px] text-gray-800 resize-none focus:outline-none focus:ring-2 focus:ring-black/5 transition-all min-h-[500px] leading-relaxed font-normal"
                                    placeholder={`Enter your ${activeTab.toLowerCase()} policy here...`}
                                    defaultValue={`This is a sample ${activeTab} policy template.\n\nItems can be returned within 7 days of delivery.\nCustomer covers delivery fees.`}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Right: Info */}
                    <div className="flex flex-col gap-6">
                        <div className="p-8 bg-gray-50 rounded-[32px] border border-gray-100 relative overflow-hidden">
                            <div className="relative z-10">
                                <div className="w-10 h-10 bg-black text-white rounded-xl flex items-center justify-center mb-6">
                                    <Icon name={"MessageSquare" as any} size={18} />
                                </div>
                                <h3 className="font-bold text-black mb-2 text-lg">AI Integration</h3>
                                <p className="text-sm text-gray-500 leading-relaxed">
                                    Your <strong>WhatsApp AI Agent</strong> reads these policies to answer customer questions automatically.
                                </p>
                                <div className="mt-6 p-4 bg-white rounded-2xl text-xs text-gray-400 italic border border-gray-100 border-l-4 border-l-black">
                                    "Do you accept returns?"<br />
                                    <span className="text-black font-medium mt-1 inline-block">"Yes, within 7 days according to our policy."</span>
                                </div>
                            </div>
                        </div>

                        <div className="p-8 bg-white border border-gray-100 rounded-[32px] shadow-sm">
                            <h3 className="font-bold text-black mb-6 text-lg">Templates</h3>
                            <div className="flex flex-col gap-3">
                                <Button variant="ghost" className="!justify-start !text-sm !h-12 !px-4 !rounded-xl hover:!bg-gray-50">
                                    <Icon name={"FileText" as any} size={16} className="mr-3 text-gray-400" />
                                    Standard Template
                                </Button>
                                <Button variant="ghost" className="!justify-start !text-sm !h-12 !px-4 !rounded-xl hover:!bg-gray-50">
                                    <Icon name={"ShieldOff" as any} size={16} className="mr-3 text-gray-400" />
                                    Strict No-Return Policy
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AdminShell>
    );
}
