'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { AdminShell } from '@/components/admin-shell';
import { GlassPanel } from '@/components/ui/glass-panel';
import { Button } from '@/components/ui/button';
import { Icon } from '@/components/ui/icon';
import { ConversationList } from '@/components/whatsapp/conversation-list';
import { ChatTranscript, Message } from '@/components/chat-transcript';
import { ActionApprovalCard } from '@/components/action-approval-card';

const MOCK_CONVERSATIONS = [
    { id: '1', user: 'Chidinma Okeke', avatarVal: 'C', lastMsg: 'I haven’t received my refund yet.', time: '2m', tags: ['Escalated'], unread: true },
    { id: '2', user: 'Emeka Johnson', avatarVal: 'E', lastMsg: 'Can I change the delivery address?', time: '15m', tags: ['New'], unread: true },
    // more items...
];

const MOCK_MESSAGES: Message[] = [
    { id: '1', sender: 'customer', text: 'Hi, I ordered the Black T-Shirt yesterday.', time: '10:30 AM' },
    { id: '2', sender: 'ai', text: 'Hello Chidinma! Yes, I can see your order #ORD-2024-001. How can I help you with it?', time: '10:30 AM' },
    { id: '3', sender: 'customer', text: 'I want to cancel it and get a refund. It is taking too long.', time: '10:31 AM' },
    { id: '4', sender: 'ai', text: 'I understand you want to cancel. Since the order hasn’t shipped yet, I can process a refund for you. A staff member needs to approve this first.', time: '10:31 AM' },
    { id: '5', sender: 'customer', text: 'Okay please do.', time: '10:32 AM' },
];

export default function ConversationDetailPage({ params }: { params: { id: string } }) {
    const router = useRouter();
    const [composerText, setComposerText] = useState('');

    return (
        <AdminShell title="Inbox" breadcrumb={`WhatsApp / Inbox / ${params.id}`}>
            <div className="h-[calc(100vh-12rem)] flex rounded-xl overflow-hidden border border-white/5 bg-[#0b141a]">

                {/* 1. Left: List (Hidden on mobile, visible on lg) */}
                <div className="hidden lg:block w-[300px] shrink-0 border-r border-white/5">
                    <ConversationList items={MOCK_CONVERSATIONS} activeId={params.id} />
                </div>

                {/* 2. Center: Chat Transcript */}
                <div className="flex-1 flex flex-col min-w-0 bg-[url('https://user-images.githubusercontent.com/1500684/233226343-6dfc1266-9c96-444e-b5c6-946401087e35.png')] bg-repeat relative">
                    <div className="absolute inset-0 bg-[#0b141a]/95" />

                    {/* Chat Header */}
                    <div className="relative z-10 p-4 border-b border-white/5 bg-[#202c33]/50 backdrop-blur-sm flex justify-between items-center">
                        <div className="flex items-center gap-3">
                            <Button variant="ghost" size="icon" className="lg:hidden text-text-secondary" onClick={() => router.push('/admin/whatsapp/inbox')}>
                                <Icon name="arrow_back" />
                            </Button>
                            <div className="w-10 h-10 rounded-full bg-purple-500/20 flex items-center justify-center font-bold text-purple-300">C</div>
                            <div>
                                <div className="font-bold text-white">Chidinma Okeke</div>
                                <div className="text-xs text-text-secondary">+234 812 999 9999 • <span className="text-state-success">Online</span></div>
                            </div>
                        </div>
                        <div className="flex gap-2">
                            <Button size="sm" variant="ghost" className="h-8 w-8 p-0"><Icon name="search" size={18} /></Button>
                            <Button size="sm" variant="ghost" className="h-8 w-8 p-0"><Icon name="more_vert" size={18} /></Button>
                        </div>
                    </div>

                    {/* Messages */}
                    <div className="relative z-10 flex-1 overflow-y-auto">
                        <ChatTranscript messages={MOCK_MESSAGES} />
                    </div>

                    {/* Composer */}
                    <div className="relative z-10 p-3 bg-[#202c33] flex items-end gap-2">
                        <Button variant="ghost" size="icon" className="text-text-secondary"><Icon name="add" /></Button>
                        <div className="flex-1 bg-[#2a3942] rounded-lg min-h-[40px] flex items-center px-4">
                            <input
                                className="w-full bg-transparent border-none text-white focus:outline-none py-2 text-sm placeholder:text-text-secondary"
                                placeholder="Type a message"
                                value={composerText}
                                onChange={(e) => setComposerText(e.target.value)}
                            />
                        </div>
                        <Button variant="ghost" size="icon" className="text-text-secondary"><Icon name="mic" /></Button>
                        {composerText && <Button size="icon" className="bg-[#00a884] hover:bg-[#008f6f] text-white border-none rounded-full"><Icon name="send" size={18} /></Button>}
                    </div>
                </div>

                {/* 3. Right: AI & Context Panel */}
                <div className="w-[320px] shrink-0 border-l border-white/5 bg-[#0b141a] flex flex-col overflow-y-auto">

                    {/* AI Suggestions Panel */}
                    <div className="p-4 border-b border-white/5">
                        <div className="flex items-center gap-2 mb-4">
                            <Icon name="smart_toy" className="text-emerald-400" size={18} />
                            <h3 className="font-bold text-white text-sm">AI Suggestions</h3>
                        </div>

                        <div className="space-y-4">
                            {/* Suggested Reply */}
                            <div className="space-y-2">
                                <label className="text-[10px] text-text-secondary uppercase font-bold tracking-wider">Suggested Reply</label>
                                <div className="p-3 rounded-lg bg-white/5 border border-white/5 text-sm text-text-secondary hover:text-white cursor-pointer transition-colors group">
                                    "I have processed the refund request. You should receive a confirmation shortly."
                                    <div className="mt-2 flex justify-end opacity-50 group-hover:opacity-100">
                                        <Button size="sm" className="h-6 text-xs bg-emerald-600/20 text-emerald-400 hover:bg-emerald-600/30 border-none">Use</Button>
                                    </div>
                                </div>
                            </div>

                            {/* Pending Actions */}
                            <div className="space-y-2">
                                <label className="text-[10px] text-text-secondary uppercase font-bold tracking-wider">Pending Approval</label>
                                <ActionApprovalCard
                                    type="refund"
                                    title="Process Refund"
                                    description="Order #ORD-2024-001 • ₦ 12,500"
                                    risk="med"
                                    onApprove={() => alert('Approved')}
                                    onReject={() => alert('Rejected')}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Context Drawer Content */}
                    <div className="p-4 space-y-6">
                        {/* Customer */}
                        <div>
                            <h3 className="text-xs font-bold text-white mb-3 flex justify-between">
                                Customer Info
                                <span className="text-primary cursor-pointer hover:underline">Edit</span>
                            </h3>
                            <div className="space-y-3">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 rounded bg-white/5 text-text-secondary"><Icon name="person" size={16} /></div>
                                    <div className="text-sm">
                                        <div className="text-white">Chidinma Okeke</div>
                                        <div className="text-xs text-text-secondary">Loyal Customer (5 orders)</div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="p-2 rounded bg-white/5 text-text-secondary"><Icon name="location_on" size={16} /></div>
                                    <div className="text-sm">
                                        <div className="text-white">Lekki Phase 1, Lagos</div>
                                        <div className="text-xs text-text-secondary">Delivery Address</div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Linked Order */}
                        <div>
                            <h3 className="text-xs font-bold text-white mb-3">Linked Order</h3>
                            <div className="p-3 rounded-xl bg-white/5 border border-white/5">
                                <div className="flex justify-between items-start mb-2">
                                    <span className="font-bold text-white text-sm">#ORD-2024-001</span>
                                    <span className="px-1.5 py-0.5 rounded bg-state-warning/20 text-state-warning text-[10px] font-bold uppercase">Processing</span>
                                </div>
                                <div className="flex gap-3 mb-3">
                                    <div className="w-12 h-12 bg-white/5 rounded flex items-center justify-center text-[10px]">IMG</div>
                                    <div>
                                        <div className="text-sm text-white">Black T-Shirt</div>
                                        <div className="text-xs text-text-secondary">Size M • Qty 1</div>
                                        <div className="text-xs font-bold text-white mt-0.5">₦ 12,500</div>
                                    </div>
                                </div>
                                <Button size="sm" variant="outline" className="w-full text-xs h-7">View Order Details</Button>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </AdminShell>
    );
}
