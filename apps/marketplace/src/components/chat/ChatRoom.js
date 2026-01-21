"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState, useRef } from "react";
import { format } from "date-fns";
import { Send, Loader2, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@vayva/ui";
export function ChatRoom({ conversationId }) {
    const router = useRouter();
    const [messages, setMessages] = useState([]);
    const [storeName, setStoreName] = useState("");
    const [loading, setLoading] = useState(true);
    const [sending, setSending] = useState(false);
    const [inputText, setInputText] = useState("");
    const bottomRef = useRef(null);
    const fetchMessages = async () => {
        try {
            const res = await fetch(`/api/conversations/${conversationId}`);
            if (!res.ok) {
                if (res.status === 404)
                    router.push("/chat");
                return;
            }
            const data = await res.json();
            setStoreName(data.conversation?.store?.name || "Seller");
            setMessages(data.conversation?.messages || []);
        }
        catch (error) {
            console.error("Failed to load chat", error);
        }
        finally {
            setLoading(false);
        }
    };
    useEffect(() => {
        fetchMessages();
        const interval = setInterval(fetchMessages, 5000); // Poll every 5s
        return () => clearInterval(interval);
    }, [conversationId]);
    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);
    const handleSend = async (e) => {
        e.preventDefault();
        if (!inputText.trim())
            return;
        const optimMsg = {
            id: `temp-${Date.now()}`,
            textBody: inputText,
            direction: "INBOUND", // Buyer sending
            createdAt: new Date().toISOString()
        };
        setMessages(prev => [...prev, optimMsg]);
        setInputText("");
        setSending(true);
        try {
            const res = await fetch(`/api/conversations/${conversationId}`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ text: optimMsg.textBody })
            });
            if (!res.ok)
                throw new Error("Send failed");
            // Re-fetch to confirm sync
            await fetchMessages();
        }
        catch (error) {
            console.error("Send error", error);
            // Ideally rollback optimistic update
            alert("Failed to send message");
        }
        finally {
            setSending(false);
        }
    };
    if (loading) {
        return (_jsx("div", { className: "flex justify-center h-screen items-center", children: _jsx(Loader2, { className: "animate-spin text-gray-400" }) }));
    }
    return (_jsxs("div", { className: "flex flex-col h-[calc(100vh-60px)] bg-gray-50", children: [_jsxs("header", { className: "bg-white px-4 py-3 border-b flex items-center gap-3 shadow-sm sticky top-0 z-10", children: [_jsx(Link, { href: "/chat", className: "p-2 -ml-2 hover:bg-gray-100 rounded-full text-gray-600", children: _jsx(ArrowLeft, { size: 20 }) }), _jsxs("div", { children: [_jsx("h2", { className: "font-bold text-gray-900", children: storeName }), _jsx("p", { className: "text-xs text-green-600", children: "Online" })] })] }), _jsxs("div", { className: "flex-1 overflow-y-auto p-4 space-y-4", children: [messages.map((msg) => {
                        // DB schema: Direction is relative to STORE.
                        // INBOUND = Buyer -> Store (Me)
                        // OUTBOUND = Store -> Buyer (Them)
                        const isMe = msg.direction === "INBOUND";
                        return (_jsx("div", { className: `flex ${isMe ? "justify-end" : "justify-start"}`, children: _jsxs("div", { className: `max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed shadow-sm ${isMe
                                    ? "bg-black text-white rounded-br-none"
                                    : "bg-white text-gray-900 border border-gray-100 rounded-bl-none"}`, children: [_jsx("p", { className: "whitespace-pre-wrap", children: msg.textBody }), _jsx("div", { className: `text-[10px] mt-1 text-right ${isMe ? "text-gray-400" : "text-gray-400"}`, children: format(new Date(msg.createdAt), "h:mm a") })] }) }, msg.id));
                    }), _jsx("div", { ref: bottomRef, className: "h-1" })] }), _jsx("div", { className: "bg-white p-3 border-t", children: _jsxs("form", { onSubmit: handleSend, className: "flex gap-2 max-w-4xl mx-auto", children: [_jsx("input", { type: "text", value: inputText, onChange: (e) => setInputText(e.target.value), placeholder: "Type a message...", className: "flex-1 bg-gray-100 border-none rounded-full px-4 py-3 focus:ring-2 focus:ring-black outline-none transition-all" }), _jsx(Button, { type: "submit", disabled: !inputText.trim() || sending, variant: "primary", size: "icon", className: "rounded-full w-12 h-12", children: sending ? _jsx(Loader2, { size: 18, className: "animate-spin" }) : _jsx(Send, { size: 18 }) })] }) })] }));
}
