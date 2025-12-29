'use client';

import React from 'react';
import { AdminShell } from '@/components/admin-shell';
import { GlassPanel, Icon } from '@vayva/ui';
import { ConversationList } from '@/components/whatsapp/conversation-list';

export default function WhatsAppInboxPage() {
    const [conversations, setConversations] = React.useState<any[]>([]);
    const [loading, setLoading] = React.useState(true);

    React.useEffect(() => {
        fetch('/api/merchant/inbox/conversations')
            .then(res => res.json())
            .then(res => {
                if (res.items) {
                    const mapped = res.items.map((c: any) => ({
                        id: c.id,
                        user: c.contact?.displayName || c.contact?.phoneE164 || 'Unknown Customer',
                        avatarVal: (c.contact?.displayName || '?')[0].toUpperCase(),
                        lastMsg: c.lastMessage?.textBody || 'No messages yet',
                        time: new Date(c.lastMessageAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                        tags: Array.isArray(c.tags) ? c.tags : [],
                        unread: c.unreadCount > 0
                    }));
                    setConversations(mapped);
                }
                setLoading(false);
            })
            .catch(() => setLoading(false));
    }, []);

    return (
        <AdminShell title="Inbox" breadcrumb="WhatsApp / Inbox">
            <div className="h-[calc(100vh-12rem)] flex rounded-xl overflow-hidden border border-white/5 bg-[#0b141a]">
                {/* Left: List */}
                <div className="w-full md:w-[350px] shrink-0">
                    {loading ? (
                        <div className="p-4 space-y-4">
                            {[1, 2, 3].map(i => <div key={i} className="h-16 bg-white/5 animate-pulse rounded-lg" />)}
                        </div>
                    ) : (
                        <ConversationList items={conversations} />
                    )}
                </div>

                {/* Right: Empty State */}
                <div className="hidden md:flex flex-1 flex-col items-center justify-center bg-[url('https://user-images.githubusercontent.com/1500684/233226343-6dfc1266-9c96-444e-b5c6-946401087e35.png')] bg-repeat opacity-50 grayscale relative">
                    <div className="absolute inset-0 bg-[#0b141a]/95" />
                    <div className="relative z-10 text-center p-8">
                        <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-6 text-text-secondary">
                            <Icon name="MessageSquare" size={40} />
                        </div>
                        <h2 className="text-xl font-bold text-white mb-2">WhatsApp Inbox</h2>
                        <p className="text-text-secondary max-w-sm">Select a conversation from the list to view details, reply, or approve AI actions.</p>
                    </div>
                </div>
            </div>
        </AdminShell>
    );
}
