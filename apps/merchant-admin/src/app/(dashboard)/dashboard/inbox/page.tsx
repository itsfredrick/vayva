"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Icon, Button } from "@vayva/ui"; // Test or lucide
import { motion, AnimatePresence } from "framer-motion";
import { ChatWindow } from "@/components/whatsapp/ChatWindow";
import { WhatsAppMessage } from "@vayva/shared";

// --- Types ---
type Conversation = {
  id: string;
  contact: { firstName?: string; lastName?: string; phone: string };
  lastMessage?: { textBody: string; createdAt: string };
  unreadCount: number;
  lastInboundAt?: string;
  slaStatus: "active" | "unread" | "overdue";
  priority: string;
};

type QuickReply = {
  id: string;
  title: string;
  content: string;
};

// --- Test Data ---
// In real impl, fetch from API

export default function InboxPage() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [messages, setMessages] = useState<WhatsAppMessage[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadingMessages, setLoadingMessages] = useState(false);

  // Quick Replies
  const [quickReplies, setQuickReplies] = useState<QuickReply[]>([]);
  const [showQuickReplies, setShowQuickReplies] = useState(false);

  // Composer
  const [messageText, setMessageText] = useState("");
  const [sending, setSending] = useState(false);

  // Internal Notes
  const [showNotesInput, setShowNotesInput] = useState(false);
  const [noteText, setNoteText] = useState("");

  // URL Sync
  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    fetchConversations();
    fetchQuickReplies();
  }, []);

  useEffect(() => {
    const id = searchParams.get("conversationId");
    if (id) {
      setSelectedId(id);
      fetchMessages(id);
    } else {
      setSelectedId(null);
      setMessages([]);
    }
  }, [searchParams]);

  // Update URL when selection changes manually (e.g. from list click if not using Request Link)
  const handleSelect = (id: string) => {
    router.push(`?conversationId=${id}`);
  };

  const fetchConversations = async () => {
    try {
      const res = await fetch("/api/merchant/inbox/conversations");
      const data = await res.json();
      setConversations(data.items || []);
      setLoading(false);
    } catch (e: any) {
      console.error(e);
      setLoading(false);
    }
  };

  const fetchQuickReplies = async () => {
    try {
      const res = await fetch("/api/merchant/quick-replies");
      const data = await res.json();
      setQuickReplies(data.items || []);
    } catch (_error: any) {
    // Intentionally empty
  }
  };

  const fetchMessages = async (id: string) => {
    setLoadingMessages(true);
    try {
      const res = await fetch(`/api/merchant/inbox/conversations/${id}`);
      const data = await res.json();
      setMessages(data.messages || []);
    } catch (e: any) {
      console.error(e);
    } finally {
      setLoadingMessages(false);
    }
  };

  const handleSend = async () => {
    if (!selectedId || !messageText.trim()) return;
    setSending(true);
    try {
      const res = await fetch(
        `/api/merchant/inbox/conversations/${selectedId}/send`,
        {
          method: "POST",
          body: JSON.stringify({ text: messageText }),
        },
      );
      if (res.ok) {
        setMessageText("");
        // Refresh messages (omitted for brevity, assume real-time or refetch)
      }
    } finally {
      setSending(false);
    }
  };

  const insertQuickReply = (content: string) => {
    setMessageText((prev) => (prev ? prev + " " + content : content));
    setShowQuickReplies(false);
  };

  return (
    <div className="flex h-[calc(100vh-6rem)] -m-6 bg-white overflow-hidden">
      {/* LEFT: Conversation List */}
      <div className="w-80 border-r border-gray-100 flex flex-col bg-gray-50/30">
        <div className="p-4 border-b border-gray-100">
          <h2 className="font-bold text-lg mb-2">Inbox</h2>
          <input
            type="search"
            placeholder="Search..."
            className="w-full text-sm p-2 rounded-lg border border-gray-200 bg-white"
          />
        </div>

        <div className="flex-1 overflow-y-auto">
          {loading && (
            <div className="p-4 text-center text-gray-400 text-sm">
              Loading...
            </div>
          )}
          {conversations.map((c: any) => (
            <div
              key={c.id}
              onClick={() => handleSelect(c.id)}
              className={`p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-100 transition relative ${selectedId === c.id ? "bg-blue-50/50" : ""}`}
            >
              <div className="flex justify-between items-start mb-1">
                <span
                  className={`font-bold text-sm ${c.unreadCount > 0 ? "text-black" : "text-gray-700"}`}
                >
                  {c.contact.firstName || c.contact.phone}
                </span>
                <span className="text-[10px] text-gray-400">
                  {c.lastMessage
                    ? new Date(c.lastMessage.createdAt).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })
                    : ""}
                </span>
              </div>
              <p className="text-xs text-gray-500 truncate">
                {c.lastMessage?.textBody || "No messages"}
              </p>

              {/* Badges */}
              <div className="flex gap-2 mt-2">
                {c.slaStatus === "overdue" && (
                  <span className="bg-red-100 text-red-600 text-[10px] px-1.5 py-0.5 rounded font-bold uppercase tracking-wide">
                    Overdue
                  </span>
                )}
                {c.unreadCount > 0 && (
                  <span className="bg-blue-500 text-white text-[10px] px-1.5 py-0.5 rounded-full font-bold min-w-[20px] text-center">
                    {c.unreadCount}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* MIDDLE: Thread */}
      <div className="flex-1 flex flex-col bg-white">
        {selectedId ? (
          <>
            {/* Header */}
            <div className="h-14 border-b border-gray-100 flex items-center px-6 justify-between">
              <h3 className="font-bold">Chat</h3>
              <div className="flex items-center gap-2">
                <Button className="text-xs font-bold text-gray-500 hover:text-black border border-gray-200 px-3 py-1.5 rounded-lg transition-colors flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                  AI Active
                </Button>
                <Button className="text-xs font-bold text-gray-500 hover:text-black border border-gray-200 px-3 py-1.5 rounded-lg transition-colors">
                  Resolve
                </Button>
              </div>
            </div>

            {/* Messages Area */}
            <div className="flex-1 min-h-0">
              <ChatWindow
                conversation={conversations.find(c => c.id === selectedId) as any}
                messages={messages}
                isLoadingMessages={loadingMessages}
                onSendMessage={handleSend}
              />
            </div>

          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-gray-300">
            <Icon name="MessageSquare" size={48} className="mb-4 opacity-50" />
            <p>Select a conversation</p>
          </div>
        )}
      </div>

      {/* RIGHT: Profile Sidebar */}
      {selectedId && (
        <div className="w-72 border-l border-gray-100 bg-white flex flex-col p-6 overflow-y-auto">
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-gray-200 rounded-full mx-auto mb-3" />
            <h3 className="font-bold text-lg">Customer Name</h3>
            <p className="text-sm text-gray-500">+234 801 234 5678</p>
            <div className="mt-2 inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-green-50 text-green-700 text-[10px] font-bold uppercase border border-green-100">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
              Offers On
            </div>
          </div>

          {/* Orders Pending */}
          <div className="mb-6">
            <h4 className="text-xs font-bold uppercase text-gray-400 mb-3">
              Recent Orders
            </h4>
            <div className="space-y-3">
              <div className="p-3 border border-gray-100 rounded-lg hover:border-gray-200 cursor-pointer">
                <div className="flex justify-between items-center mb-1">
                  <span className="font-bold text-xs">#ORD-1024</span>
                  <span className="text-[10px] bg-yellow-50 text-yellow-700 px-1.5 rounded">
                    Processing
                  </span>
                </div>
                <p className="text-xs text-gray-500">₦25,000 &bull; 2 items</p>
              </div>
            </div>
          </div>

          {/* Tags */}
          <div>
            <h4 className="text-xs font-bold uppercase text-gray-400 mb-3">
              Tags & Labels
            </h4>
            <div className="flex flex-wrap gap-2">
              <Button className="text-[10px] border border-dashed border-gray-300 px-2 py-1 rounded text-gray-400 hover:border-gray-400">
                + Add Tag
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
