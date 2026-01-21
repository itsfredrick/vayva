"use client";

import { useState, useEffect, use } from "react";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { ChatWindow } from "@/components/whatsapp/ChatWindow";
import { WhatsAppConversation, WhatsAppMessage } from "@vayva/shared";

export default function ConversationPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const [loading, setLoading] = useState(true);
    const [conversation, setConversation] = useState<WhatsAppConversation | null>(null);
    const [messages, setMessages] = useState<WhatsAppMessage[]>([]);

    useEffect(() => {
        fetchData();
        // Poll for new messages every 5 seconds
        const interval = setInterval(() => {
            fetchMessages();
        }, 5000);
        return () => clearInterval(interval);
    }, [id]);

    const fetchData = async () => {
        try {
            await Promise.all([fetchConversation(), fetchMessages()]);
        } catch (error) {
            console.error(error);
            toast.error("Failed to load conversation");
        } finally {
            setLoading(false);
        }
    };

    const fetchConversation = async () => {
        const res = await fetch(`/api/support/conversations/${id}`);
        if (!res.ok) throw new Error("Failed to load conversation details");
        const data = await res.json();
        setConversation(data);
    };

    const fetchMessages = async () => {
        const res = await fetch(`/api/support/conversations/${id}/messages`);
        if (!res.ok) throw new Error("Failed to load messages");
        const data = await res.json();
        setMessages(data.data || []);
    };

    const handleSendMessage = async (content: string) => {
        try {
            const res = await fetch(`/api/support/conversations/${id}/messages`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ content })
            });

            if (!res.ok) throw new Error("Failed to send message");

            // Refresh messages immediately
            fetchMessages();
        } catch (error) {
            toast.error("Failed to send message");
            throw error;
        }
    };

    if (loading) {
        return (
            <div className="h-[calc(100vh-120px)] flex items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-slate-400" />
            </div>
        );
    }

    if (!conversation) return <div>Conversation not found</div>;

    return (
        <div className="h-[calc(100vh-120px)] border rounded-xl overflow-hidden shadow-sm bg-white">
            <ChatWindow
                conversation={conversation}
                messages={messages}
                onSendMessage={handleSendMessage}
                isLoadingMessages={false}
            />
        </div>
    );
}
