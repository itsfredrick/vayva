"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from "react";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { Loader2, MessageCircle } from "lucide-react";
export function ChatInbox() {
    const [conversations, setConversations] = useState([]);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        const fetchConversations = async () => {
            try {
                const res = await fetch("/api/conversations");
                const data = await res.json();
                setConversations(data.conversations || []);
            }
            catch (error) {
                console.error("Failed to load chats", error);
            }
            finally {
                setLoading(false);
            }
        };
        fetchConversations();
    }, []);
    if (loading) {
        return (_jsx("div", { className: "flex justify-center p-10", children: _jsx(Loader2, { className: "animate-spin text-gray-400" }) }));
    }
    if (conversations.length === 0) {
        return (_jsxs("div", { className: "text-center py-20 px-4", children: [_jsx("div", { className: "w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-400", children: _jsx(MessageCircle, { size: 32 }) }), _jsx("h3", { className: "text-lg font-bold text-gray-900 mb-2", children: "No messages yet" }), _jsx("p", { className: "text-gray-500 mb-6", children: "Start a conversation with a seller from any listing." }), _jsx(Link, { href: "/", className: "inline-block bg-black text-white font-bold py-3 px-6 rounded-lg hover:bg-gray-800", children: "Browse Marketplace" })] }));
    }
    return (_jsx("div", { className: "space-y-2", children: conversations.map((conv) => (_jsx(Link, { href: `/chat/${conv.id}`, className: "block bg-white p-4 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow", children: _jsxs("div", { className: "flex items-start gap-3", children: [_jsx("div", { className: "w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-gray-500 font-bold flex-shrink-0", children: conv.storeLogo ? (_jsx("img", { src: conv.storeLogo, alt: "", className: "w-full h-full object-cover rounded-full" })) : (conv.storeName[0]) }), _jsxs("div", { className: "flex-1 min-w-0", children: [_jsxs("div", { className: "flex justify-between items-start mb-1", children: [_jsx("h4", { className: "font-bold text-gray-900 truncate", children: conv.storeName }), _jsx("span", { className: "text-xs text-gray-400 whitespace-nowrap ml-2", children: formatDistanceToNow(new Date(conv.lastMessageAt), { addSuffix: true }) })] }), _jsx("p", { className: "text-sm text-gray-600 truncate", children: conv.lastMessage })] }), conv.unreadCount > 0 && (_jsx("div", { className: "w-2.5 h-2.5 bg-blue-600 rounded-full mt-2" }))] }) }, conv.id))) }));
}
