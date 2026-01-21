"use client";
import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Icon, Button } from "@vayva/ui"; // Test or lucide
import { ChatWindow } from "@/components/whatsapp/ChatWindow";
// --- Test Data ---
// In real impl, fetch from API
export default function InboxPage() {
    const [conversations, setConversations] = useState([]);
    const [messages, setMessages] = useState([]);
    const [selectedId, setSelectedId] = useState(null);
    const [loading, setLoading] = useState(true);
    const [loadingMessages, setLoadingMessages] = useState(false);
    // Quick Replies
    const [quickReplies, setQuickReplies] = useState([]);
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
        }
        else {
            setSelectedId(null);
            setMessages([]);
        }
    }, [searchParams]);
    // Update URL when selection changes manually (e.g. from list click if not using Request Link)
    const handleSelect = (id) => {
        router.push(`?conversationId=${id}`);
    };
    const fetchConversations = async () => {
        try {
            const res = await fetch("/api/merchant/inbox/conversations");
            const data = await res.json();
            setConversations(data.items || []);
            setLoading(false);
        }
        catch (e) {
            console.error(e);
            setLoading(false);
        }
    };
    const fetchQuickReplies = async () => {
        try {
            const res = await fetch("/api/merchant/quick-replies");
            const data = await res.json();
            setQuickReplies(data.items || []);
        }
        catch (e) { }
    };
    const fetchMessages = async (id) => {
        setLoadingMessages(true);
        try {
            const res = await fetch(`/api/merchant/inbox/conversations/${id}`);
            const data = await res.json();
            setMessages(data.messages || []);
        }
        catch (e) {
            console.error(e);
        }
        finally {
            setLoadingMessages(false);
        }
    };
    const handleSend = async () => {
        if (!selectedId || !messageText.trim())
            return;
        setSending(true);
        try {
            const res = await fetch(`/api/merchant/inbox/conversations/${selectedId}/send`, {
                method: "POST",
                body: JSON.stringify({ text: messageText }),
            });
            if (res.ok) {
                setMessageText("");
                // Refresh messages (omitted for brevity, assume real-time or refetch)
            }
        }
        finally {
            setSending(false);
        }
    };
    const insertQuickReply = (content) => {
        setMessageText((prev) => (prev ? prev + " " + content : content));
        setShowQuickReplies(false);
    };
    return (_jsxs("div", { className: "flex h-[calc(100vh-6rem)] -m-6 bg-white overflow-hidden", children: [_jsxs("div", { className: "w-80 border-r border-gray-100 flex flex-col bg-gray-50/30", children: [_jsxs("div", { className: "p-4 border-b border-gray-100", children: [_jsx("h2", { className: "font-bold text-lg mb-2", children: "Inbox" }), _jsx("input", { type: "search", placeholder: "Search...", className: "w-full text-sm p-2 rounded-lg border border-gray-200 bg-white" })] }), _jsxs("div", { className: "flex-1 overflow-y-auto", children: [loading && (_jsx("div", { className: "p-4 text-center text-gray-400 text-sm", children: "Loading..." })), conversations.map((c) => (_jsxs("div", { onClick: () => handleSelect(c.id), className: `p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-100 transition relative ${selectedId === c.id ? "bg-blue-50/50" : ""}`, children: [_jsxs("div", { className: "flex justify-between items-start mb-1", children: [_jsx("span", { className: `font-bold text-sm ${c.unreadCount > 0 ? "text-black" : "text-gray-700"}`, children: c.contact.firstName || c.contact.phone }), _jsx("span", { className: "text-[10px] text-gray-400", children: c.lastMessage
                                                    ? new Date(c.lastMessage.createdAt).toLocaleTimeString([], {
                                                        hour: "2-digit",
                                                        minute: "2-digit",
                                                    })
                                                    : "" })] }), _jsx("p", { className: "text-xs text-gray-500 truncate", children: c.lastMessage?.textBody || "No messages" }), _jsxs("div", { className: "flex gap-2 mt-2", children: [c.slaStatus === "overdue" && (_jsx("span", { className: "bg-red-100 text-red-600 text-[10px] px-1.5 py-0.5 rounded font-bold uppercase tracking-wide", children: "Overdue" })), c.unreadCount > 0 && (_jsx("span", { className: "bg-blue-500 text-white text-[10px] px-1.5 py-0.5 rounded-full font-bold min-w-[20px] text-center", children: c.unreadCount }))] })] }, c.id)))] })] }), _jsx("div", { className: "flex-1 flex flex-col bg-white", children: selectedId ? (_jsxs(_Fragment, { children: [_jsxs("div", { className: "h-14 border-b border-gray-100 flex items-center px-6 justify-between", children: [_jsx("h3", { className: "font-bold", children: "Chat" }), _jsxs("div", { className: "flex items-center gap-2", children: [_jsxs(Button, { className: "text-xs font-bold text-gray-500 hover:text-black border border-gray-200 px-3 py-1.5 rounded-lg transition-colors flex items-center gap-2", children: [_jsx("div", { className: "w-2 h-2 rounded-full bg-green-500 animate-pulse" }), "AI Active"] }), _jsx(Button, { className: "text-xs font-bold text-gray-500 hover:text-black border border-gray-200 px-3 py-1.5 rounded-lg transition-colors", children: "Resolve" })] })] }), _jsx("div", { className: "flex-1 min-h-0", children: _jsx(ChatWindow, { conversation: conversations.find(c => c.id === selectedId), messages: messages, isLoadingMessages: loadingMessages, onSendMessage: handleSend }) })] })) : (_jsxs("div", { className: "flex-1 flex flex-col items-center justify-center text-gray-300", children: [_jsx(Icon, { name: "MessageSquare", size: 48, className: "mb-4 opacity-50" }), _jsx("p", { children: "Select a conversation" })] })) }), selectedId && (_jsxs("div", { className: "w-72 border-l border-gray-100 bg-white flex flex-col p-6 overflow-y-auto", children: [_jsxs("div", { className: "text-center mb-6", children: [_jsx("div", { className: "w-16 h-16 bg-gray-200 rounded-full mx-auto mb-3" }), _jsx("h3", { className: "font-bold text-lg", children: "Customer Name" }), _jsx("p", { className: "text-sm text-gray-500", children: "+234 801 234 5678" }), _jsxs("div", { className: "mt-2 inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-green-50 text-green-700 text-[10px] font-bold uppercase border border-green-100", children: [_jsx("span", { className: "w-1.5 h-1.5 rounded-full bg-green-500" }), "Offers On"] })] }), _jsxs("div", { className: "mb-6", children: [_jsx("h4", { className: "text-xs font-bold uppercase text-gray-400 mb-3", children: "Recent Orders" }), _jsx("div", { className: "space-y-3", children: _jsxs("div", { className: "p-3 border border-gray-100 rounded-lg hover:border-gray-200 cursor-pointer", children: [_jsxs("div", { className: "flex justify-between items-center mb-1", children: [_jsx("span", { className: "font-bold text-xs", children: "#ORD-1024" }), _jsx("span", { className: "text-[10px] bg-yellow-50 text-yellow-700 px-1.5 rounded", children: "Processing" })] }), _jsx("p", { className: "text-xs text-gray-500", children: "\u20A625,000 \u2022 2 items" })] }) })] }), _jsxs("div", { children: [_jsx("h4", { className: "text-xs font-bold uppercase text-gray-400 mb-3", children: "Tags & Labels" }), _jsx("div", { className: "flex flex-wrap gap-2", children: _jsx(Button, { className: "text-[10px] border border-dashed border-gray-300 px-2 py-1 rounded text-gray-400 hover:border-gray-400", children: "+ Add Tag" }) })] })] }))] }));
}
