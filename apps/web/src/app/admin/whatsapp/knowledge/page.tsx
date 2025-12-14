'use client';

import React from 'react';
import { AdminShell } from '@/components/admin-shell';
import { GlassPanel } from '@/components/ui/glass-panel';
import { Button } from '@/components/ui/button';
import { Icon } from '@/components/ui/icon';

export default function KnowledgeBasePage() {
    return (
        <AdminShell title="Knowledge Base" breadcrumb="WhatsApp / Knowledge Base">
            <div className="h-[calc(100vh-12rem)] max-w-7xl mx-auto flex gap-6">
                {/* Left: Nav & List */}
                <div className="w-[300px] flex flex-col gap-4 shrink-0">
                    <GlassPanel className="p-2 flex flex-col gap-1">
                        <div className="flex items-center gap-2 px-3 py-2 bg-white/10 rounded-lg text-white font-bold text-sm cursor-pointer">
                            <Icon name="quiz" size={18} /> FAQs
                        </div>
                        <div className="flex items-center gap-2 px-3 py-2 text-text-secondary hover:bg-white/5 rounded-lg font-medium text-sm cursor-pointer transition-colors">
                            <Icon name="policy" size={18} /> Store Policies
                        </div>
                        <div className="flex items-center gap-2 px-3 py-2 text-text-secondary hover:bg-white/5 rounded-lg font-medium text-sm cursor-pointer transition-colors">
                            <Icon name="lightbulb" size={18} /> Product Guidance
                        </div>
                    </GlassPanel>

                    <GlassPanel className="flex-1 flex flex-col p-4 overflow-hidden">
                        <div className="relative mb-4">
                            <Icon name="search" size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary" />
                            <input className="w-full bg-white/5 border border-white/5 rounded-full pl-9 pr-4 py-2 text-xs text-white focus:outline-none focus:border-primary" placeholder="Search FAQs..." />
                        </div>

                        <div className="flex-1 overflow-y-auto space-y-2">
                            {['Return Policy', 'Delivery Times Lagos', 'Payment Options', 'Store Hours', 'Size Guide'].map((item, i) => (
                                <div key={i} className={`p-3 rounded-lg border cursor-pointer hover:bg-white/5 transition-colors ${i === 0 ? 'bg-white/5 border-primary/50' : 'border-transparent'}`}>
                                    <div className="text-sm font-bold text-white mb-1">{item}</div>
                                    <div className="text-[10px] text-text-secondary truncate">Last updated 2 days ago</div>
                                </div>
                            ))}
                        </div>

                        <Button size="sm" className="mt-4 w-full bg-white/10 hover:bg-white/20 text-white border-none space-x-2">
                            <Icon name="add" /> <span>Add New Entry</span>
                        </Button>
                    </GlassPanel>
                </div>

                {/* Center: Editor */}
                <GlassPanel className="flex-1 p-8 flex flex-col">
                    <div className="flex justify-between items-start mb-6">
                        <div className="flex-1 mr-6">
                            <input
                                className="w-full bg-transparent text-2xl font-bold text-white placeholder:text-white/20 focus:outline-none mb-2"
                                placeholder="Enter title"
                                defaultValue="Return Policy"
                            />
                            <div className="flex gap-2">
                                <span className="px-2 py-0.5 rounded bg-white/10 text-text-secondary text-[10px] font-bold uppercase">General</span>
                                <span className="px-2 py-0.5 rounded bg-state-success/10 text-state-success text-[10px] font-bold uppercase flex items-center gap-1">
                                    <Icon name="visibility" size={12} /> Live
                                </span>
                            </div>
                        </div>
                        <div className="flex gap-2">
                            <Button variant="ghost">Archive</Button>
                            <Button className="bg-primary text-black">Save Changes</Button>
                        </div>
                    </div>

                    <div className="flex-1 bg-white/5 rounded-xl p-4 border border-white/5 font-mono text-sm text-white/90 leading-relaxed focus-within:border-primary/50 transition-colors cursor-text">
                        <textarea
                            className="w-full h-full bg-transparent resize-none focus:outline-none"
                            defaultValue={`We offer a 7-day return policy for all items that are unworn and in their original packaging. 

To initiate a return:
1. Contact support via WhatsApp or Email.
2. Provide your Order ID.
3. We will schedule a pickup (Lagos only) or provide a drop-off location.

Refunds are processed within 24-48 hours after we receive the item.`}
                        />
                    </div>
                </GlassPanel>

                {/* Right: Guidelines */}
                <div className="w-[280px] shrink-0 space-y-6">
                    <GlassPanel className="p-4 bg-gradient-to-br from-indigo-900/10 to-transparent">
                        <h3 className="font-bold text-white mb-3 text-sm flex items-center gap-2">
                            <Icon name="shield" className="text-indigo-400" size={16} /> AI Safety Rules
                        </h3>
                        <ul className="space-y-2 text-xs text-text-secondary list-disc pl-4">
                            <li>AI will quote this text <strong>exactly</strong> when asked.</li>
                            <li>Do not include internal notes here.</li>
                            <li>Avoid pricing specifics that change frequently.</li>
                        </ul>
                    </GlassPanel>

                    <GlassPanel className="p-4">
                        <h3 className="font-bold text-white mb-3 text-sm">Tone Check</h3>
                        <p className="text-xs text-text-secondary mb-2">Selected Tone: <strong>Friendly</strong></p>
                        <div className="p-3 bg-white/5 rounded-lg border border-white/5">
                            <p className="text-xs text-white italic">"Hey! Just so you know, we have a 7-day return policy for unworn items in original packaging. Let us know if you need to swap something!"</p>
                        </div>
                    </GlassPanel>
                </div>
            </div>
        </AdminShell>
    );
}
