"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import { MessageSquare, User, Clock, ChevronRight, Loader2, Inbox } from "lucide-react";
import { formatDate } from "@/lib/format";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { ConversationList } from "@/components/whatsapp/ConversationList";

interface Conversation {
    id: string;
    contactName: string;
    subtitle: string;
    status: string;
    unread: boolean;
    lastMessage: string;
    lastMessageAt: string;
    direction: string;
}

export default function MessagesPage() {
    const [loading, setLoading] = useState(true);
    const [conversations, setConversations] = useState<Conversation[]>([]);

    useEffect(() => {
        fetchConversations();
    }, []);

    const fetchConversations = async () => {
        try {
            const res = await fetch("/api/support/conversations");
            if (!res.ok) throw new Error("Failed to load messages");
            const result = await res.json();
            setConversations(result.data || []);
        } catch (error: any) {
            console.error(error);
            toast.error("Could not load messages");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold tracking-tight text-slate-900">Support Inbox</h1>
                <p className="text-slate-500">Communicate with your customers.</p>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden min-h-[400px]">
                {loading ? (
                    <div className="p-12 flex justify-center h-full items-center">
                        <Loader2 className="h-6 w-6 animate-spin text-slate-400" />
                    </div>
                ) : (
                    <ConversationList conversations={conversations} />
                )}
            </div>
        </div>
    );
}

