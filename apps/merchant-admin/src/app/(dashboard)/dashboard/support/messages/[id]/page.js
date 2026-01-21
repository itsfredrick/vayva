"use client";
import { jsx as _jsx } from "react/jsx-runtime";
import { useState, useEffect, use } from "react";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { ChatWindow } from "@/components/whatsapp/ChatWindow";
export default function ConversationPage({ params }) {
    const { id } = use(params);
    const [loading, setLoading] = useState(true);
    const [conversation, setConversation] = useState(null);
    const [messages, setMessages] = useState([]);
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
        }
        catch (error) {
            console.error(error);
            toast.error("Failed to load conversation");
        }
        finally {
            setLoading(false);
        }
    };
    const fetchConversation = async () => {
        const res = await fetch(`/api/support/conversations/${id}`);
        if (!res.ok)
            throw new Error("Failed to load conversation details");
        const data = await res.json();
        setConversation(data);
    };
    const fetchMessages = async () => {
        const res = await fetch(`/api/support/conversations/${id}/messages`);
        if (!res.ok)
            throw new Error("Failed to load messages");
        const data = await res.json();
        setMessages(data.data || []);
    };
    const handleSendMessage = async (content) => {
        try {
            const res = await fetch(`/api/support/conversations/${id}/messages`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ content })
            });
            if (!res.ok)
                throw new Error("Failed to send message");
            // Refresh messages immediately
            fetchMessages();
        }
        catch (error) {
            toast.error("Failed to send message");
            throw error;
        }
    };
    if (loading) {
        return (_jsx("div", { className: "h-[calc(100vh-120px)] flex items-center justify-center", children: _jsx(Loader2, { className: "h-8 w-8 animate-spin text-slate-400" }) }));
    }
    if (!conversation)
        return _jsx("div", { children: "Conversation not found" });
    return (_jsx("div", { className: "h-[calc(100vh-120px)] border rounded-xl overflow-hidden shadow-sm bg-white", children: _jsx(ChatWindow, { conversation: conversation, messages: messages, onSendMessage: handleSendMessage, isLoadingMessages: false }) }));
}
