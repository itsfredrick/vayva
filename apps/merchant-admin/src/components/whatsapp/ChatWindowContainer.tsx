import React from "react";
import { ChatWindow } from "./ChatWindow";

interface ChatWindowContainerProps {
  conversationId: string;
  conversations: any[]; // Using any[] to match usage, ideally strict type
}

export function ChatWindowContainer({ conversationId, conversations }: ChatWindowContainerProps) {
  const [messages, setMessages] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);

  // Find the conversation
  const conversation = conversations.find((c) => c.id === conversationId);

  // Fetch messages
  React.useEffect(() => {
    if (!conversationId) return;

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

  const handleSendMessage = async (text: string) => {
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

      if (!res.ok) throw new Error("Send failed");

      const savedMsg = await res.json();
      // Replace temp message
      setMessages((prev) => prev.map((m) => (m.id === tempId ? savedMsg : m)));
    } catch (error) {
      console.error("Send message error", error);
      // Rollback or show error state
    }
  };

  if (!conversation) {
    return <div>Conversation not found</div>;
  }

  return (
    <ChatWindow
      conversation={conversation}
      messages={messages}
      onSendMessage={handleSendMessage}
      isLoadingMessages={loading}
    />
  );
}
