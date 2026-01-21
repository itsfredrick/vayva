"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { ConversationList } from "@/components/whatsapp/ConversationList";
export default function MessagesPage() {
    const [loading, setLoading] = useState(true);
    const [conversations, setConversations] = useState([]);
    useEffect(() => {
        fetchConversations();
    }, []);
    const fetchConversations = async () => {
        try {
            const res = await fetch("/api/support/conversations");
            if (!res.ok)
                throw new Error("Failed to load messages");
            const result = await res.json();
            setConversations(result.data || []);
        }
        catch (error) {
            console.error(error);
            toast.error("Could not load messages");
        }
        finally {
            setLoading(false);
        }
    };
    return (_jsxs("div", { className: "space-y-6", children: [_jsxs("div", { children: [_jsx("h1", { className: "text-2xl font-bold tracking-tight text-slate-900", children: "Support Inbox" }), _jsx("p", { className: "text-slate-500", children: "Communicate with your customers." })] }), _jsx("div", { className: "bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden min-h-[400px]", children: loading ? (_jsx("div", { className: "p-12 flex justify-center h-full items-center", children: _jsx(Loader2, { className: "h-6 w-6 animate-spin text-slate-400" }) })) : (_jsx(ConversationList, { conversations: conversations })) })] }));
}
