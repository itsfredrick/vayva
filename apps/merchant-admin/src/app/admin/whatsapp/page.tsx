'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { AppShell, GlassPanel, Button, Input, Icon } from '@vayva/ui';
import { WhatsAppService } from '@/services/whatsapp';
import { useAuth } from '@/context/AuthContext';

export default function WhatsAppPage() {
    const router = useRouter();
    const { user } = useAuth();
    const [conversations, setConversations] = useState<any[]>([]);
    const [selectedId, setSelectedId] = useState<string | null>(null);
    const [messages, setMessages] = useState<any[]>([]);
    const [inputText, setInputText] = useState('');

    useEffect(() => {
        WhatsAppService.listConversations().then(setConversations).catch(console.error);
    }, []);

    useEffect(() => {
        if (selectedId) {
            WhatsAppService.listMessages(selectedId).then(setMessages).catch(console.error);
            const interval = setInterval(() => {
                WhatsAppService.listMessages(selectedId).then(setMessages).catch(console.error);
            }, 5000); // Polling for demo
            return () => clearInterval(interval);
        }
    }, [selectedId]);

    const handleSend = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedId || !inputText.trim()) return;

        try {
            await WhatsAppService.sendMessage(selectedId, inputText);
            setInputText('');
            // Optimistic update or fetch
            WhatsAppService.listMessages(selectedId).then(setMessages);
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <AppShell sidebar={<></>} header={<></>}>
            <div className="flex flex-col gap-4 p-4">
                <h1 className="text-2xl font-bold text-white">WhatsApp AI</h1>
            </div>
            <div className="grid grid-cols-3 gap-6 h-[calc(100vh-140px)]">
                {/* Conversation List */}
                <GlassPanel className="col-span-1 p-0 flex flex-col overflow-hidden">
                    <div className="p-4 border-b border-white/10 font-bold text-white">Conversations</div>
                    <div className="flex-1 overflow-y-auto">
                        {conversations.map(c => (
                            <div
                                key={c.id}
                                className={`p-4 border-b border-white/5 cursor-pointer hover:bg-white/5 ${selectedId === c.id ? 'bg-white/10' : ''}`}
                                onClick={() => setSelectedId(c.id)}
                            >
                                <div className="font-medium text-white">{c.customerPhone}</div>
                                <div className="text-sm text-text-secondary truncate">
                                    {c.messages?.[0]?.content || 'Start chatting'}
                                </div>
                            </div>
                        ))}
                    </div>
                </GlassPanel>

                {/* Chat Area */}
                <GlassPanel className="col-span-2 p-0 flex flex-col overflow-hidden relative">
                    {selectedId ? (
                        <>
                            <div className="flex-1 overflow-y-auto p-6 space-y-4">
                                {messages.map(m => (
                                    <div key={m.id} className={`flex ${m.direction === 'OUTBOUND' ? 'justify-end' : 'justify-start'}`}>
                                        <div className={`max-w-[70%] p-3 rounded-lg text-sm ${m.direction === 'OUTBOUND'
                                            ? 'bg-primary text-black rounded-tr-none'
                                            : 'bg-white/10 text-white rounded-tl-none'
                                            }`}>
                                            {m.content}
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <div className="p-4 border-t border-white/10 bg-black/20">
                                <form onSubmit={handleSend} className="flex gap-2">
                                    <Input
                                        value={inputText}
                                        onChange={e => setInputText(e.target.value)}
                                        placeholder="Type a message..."
                                        className="mb-0" // Override margin
                                    />
                                    <Button type="submit">Send</Button>
                                </form>
                            </div>
                        </>
                    ) : (
                        <div className="flex flex-col items-center justify-center h-full text-text-secondary">
                            <Icon name="MessageCircle" className="w-12 h-12 mb-2 opacity-50" />
                            <p>Select a conversation to start chatting</p>
                        </div>
                    )}
                </GlassPanel>
            </div>
        </AppShell>
    );
}
