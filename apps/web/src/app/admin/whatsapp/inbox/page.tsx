'use client';

import React from 'react';
import { AdminShell } from '@/components/admin-shell';
import { GlassPanel } from '@/components/ui/glass-panel';
import { Icon } from '@/components/ui/icon';
import { ConversationList } from '@/components/whatsapp/conversation-list';

const MOCK_CONVERSATIONS = [
    { id: '1', user: 'Chidinma Okeke', avatarVal: 'C', lastMsg: 'I haven’t received my refund yet.', time: '2m', tags: ['Escalated'], unread: true },
    { id: '2', user: 'Emeka Johnson', avatarVal: 'E', lastMsg: 'Can I change the delivery address?', time: '15m', tags: ['New'], unread: true },
    { id: '3', user: 'Sarah Kalu', avatarVal: 'S', lastMsg: 'Thanks, that works perfectly!', time: '1h', tags: [], unread: false },
    { id: '4', user: 'Biodun Adeleke', avatarVal: 'B', lastMsg: 'Is the black t-shirt available in XL?', time: '2h', tags: ['Pending'], unread: false },
    { id: '5', user: 'Grace Effiong', avatarVal: 'G', lastMsg: 'Okay, I will wait.', time: '3h', tags: [], unread: false },
    { id: '6', user: 'Samuel K.', avatarVal: 'S', lastMsg: 'How do I return this?', time: '5h', tags: ['New'], unread: false },
    { id: '7', user: 'Fatima B.', avatarVal: 'F', lastMsg: 'Order #12345 status please.', time: '1d', tags: [], unread: false },
];

export default function WhatsAppInboxPage() {
    return (
        <AdminShell title="Inbox" breadcrumb="WhatsApp / Inbox">
            <div className="h-[calc(100vh-12rem)] flex rounded-xl overflow-hidden border border-white/5 bg-[#0b141a]">
                {/* Left: List */}
                <div className="w-full md:w-[350px] shrink-0">
                    <ConversationList items={MOCK_CONVERSATIONS} />
                </div>

                {/* Right: Empty State */}
                <div className="hidden md:flex flex-1 flex-col items-center justify-center bg-[url('https://user-images.githubusercontent.com/1500684/233226343-6dfc1266-9c96-444e-b5c6-946401087e35.png')] bg-repeat opacity-50 grayscale relative">
                    <div className="absolute inset-0 bg-[#0b141a]/95" />
                    <div className="relative z-10 text-center p-8">
                        <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-6 text-text-secondary">
                            <Icon name="chat" size={40} />
                        </div>
                        <h2 className="text-xl font-bold text-white mb-2">WhatsApp Inbox</h2>
                        <p className="text-text-secondary max-w-sm">Select a conversation from the list to view details, reply, or approve AI actions.</p>
                    </div>
                </div>
            </div>
        </AdminShell>
    );
}
