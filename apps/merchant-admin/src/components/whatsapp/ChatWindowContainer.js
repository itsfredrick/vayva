import { jsx as _jsx } from "react/jsx-runtime";
import React from "react";
import { ChatWindow } from "./ChatWindow";
export function ChatWindowContainer({ conversationId, conversations }) {
    const [messages, setMessages] = React.useState([]);
    const [loading, setLoading] = React.useState(true);
    // Find the conversation
    const conversation = conversations.find((c) => c.id === conversationId);
    // Fetch messages
    React.useEffect(() => {
        if (!conversationId)
            return;
        setLoading(true);
        fetch(`/api/whatsapp/messages?conversationId=${conversationId}`)
            .then((res) => res.json())
            .then((data) => {
            if (Array.isArray(data)) {
                setMessages(data);
            }
        })
            .catch((err) => console.error("Failed to load messages", err))
            .finally(() => setLoading(false));
    }, [conversationId]);
    const handleSendMessage = async (text) => {
        // Optimistic Update
        const tempId = `temp-${Date.now()}`;
        const optimisticMsg = {
            id: tempId,
            conversationId,
            sender: "MERCHANT",
            content: text,
            timestamp: new Date().toISOString(),
            isAutomated: false,
        };
        setMessages((prev) => [...prev, optimisticMsg]);
        try {
            const res = await fetch("/api/whatsapp/messages", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ conversationId, content: text }),
            });
            if (!res.ok)
                throw new Error("Send failed");
            const savedMsg = await res.json();
            // Replace temp message
            setMessages((prev) => prev.map((m) => (m.id === tempId ? savedMsg : m)));
        }
        catch (error) {
            console.error("Send message error", error);
            // Rollback or show error state
        }
    };
    if (!conversation) {
        return _jsx("div", { children: "Conversation not found" });
    }
    return (_jsx(ChatWindow, { conversation: conversation, messages: messages, onSendMessage: handleSendMessage, isLoadingMessages: loading }));
}
