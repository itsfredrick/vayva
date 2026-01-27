"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { Loader2, MessageCircle } from "lucide-react";

interface Conversation {
    id: string;
    storeName: string;
    storeLogo: string | null;
    lastMessage: string;
    lastMessageAt: string;
    unreadCount: number;
}

export function ChatInbox(): React.JSX.Element {
    const [conversations, setConversations] = useState<Conversation[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchConversations = async (): Promise<void> => {
            try {
                const res = await fetch("/api/conversations");
                const data = await res.json();
                setConversations(data.conversations || []);
            } catch (error) {
                console.error("Failed to load chats", error);
            } finally {
                setLoading(false);
            }
        };

        fetchConversations();
    }, []);

    if (loading) {
        return (
            <div className="flex justify-center p-10">
                <Loader2 className="animate-spin text-gray-400" />
            </div>
        );
    }

    if (conversations.length === 0) {
        return (
            <div className="text-center py-20 px-4">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-400">
                    <MessageCircle size={32} />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">No messages yet</h3>
                <p className="text-gray-500 mb-6">Start a conversation with a seller from any listing.</p>
                <Link href="/" className="inline-block bg-black text-white font-bold py-3 px-6 rounded-lg hover:bg-gray-800 glow-primary-soft">
                    Browse Marketplace
                </Link>
            </div>
        );
    }

    return (
        <div className="space-y-2">
            {conversations.map((conv) => (
                <Link
                    key={conv.id}
                    href={`/chat/${conv.id}`}
                    className="block bg-white p-4 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow"
                >
                    <div className="flex items-start gap-3">
                        <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-gray-500 font-bold flex-shrink-0">
                            {conv.storeLogo ? (
                                <img src={conv.storeLogo} alt="" className="w-full h-full object-cover rounded-full" />
                            ) : (
                                conv.storeName[0]
                            )}
                        </div>
                        <div className="flex-1 min-w-0">
                            <div className="flex justify-between items-start mb-1">
                                <h4 className="font-bold text-gray-900 truncate">{conv.storeName}</h4>
                                <span className="text-xs text-gray-400 whitespace-nowrap ml-2">
                                    {formatDistanceToNow(new Date(conv.lastMessageAt), { addSuffix: true })}
                                </span>
                            </div>
                            <p className="text-sm text-gray-600 truncate">{conv.lastMessage}</p>
                        </div>
                        {conv.unreadCount > 0 && (
                            <div className="w-2.5 h-2.5 bg-primary rounded-full mt-2"></div>
                        )}
                    </div>
                </Link>
            ))}
        </div>
    );
}
