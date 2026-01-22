"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import {
    ArrowLeft,
    Send,
    User,
    Bot,
    MoreVertical,
    CheckCircle2,
    AlertCircle,
    Clock,
    Archive,
    RefreshCw,
    Building2
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { toast } from "sonner";
import { cn, Button } from "@vayva/ui";

interface TicketMessage {
    id: string;
    authorType: "USER" | "OPS" | "AI";
    authorName: string;
    message: string;
    createdAt: string;
    attachments: unknown[];
}

interface SupportTicket {
    id: string;
    subject: string;
    status: "open" | "closed";
    priority: string;
    category: string;
    storeName: string;
    storeId: string;
    storeSlug: string;
    ticketMessages: TicketMessage[];
    aiSummary?: string;
    assignedToUserId?: string;
    createdAt: string;
}

export default function TicketDetailPage() {
    const { id } = useParams() as { id: string };
    const router = useRouter();
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const [ticket, setTicket] = useState<SupportTicket | null>(null);
    const [loading, setLoading] = useState(true);
    const [replyText, setReplyText] = useState("");
    const [sending, setSending] = useState(false);
    const [updatingStatus, setUpdatingStatus] = useState(false);
    const [performingAction, setPerformingAction] = useState(false);

    useEffect(() => {
        fetchTicket();
    }, [id]);

    useEffect(() => {
        // Scroll to bottom on load/new message
        if (ticket && messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
        }
    }, [ticket?.ticketMessages?.length]);

    const fetchTicket = async () => {
        setLoading(true);
        try {
            const res = await fetch(`/api/ops/support/${id}`);
            if (res.status === 401) {
                window.location.href = "/ops/login";
                return;
            }
            if (!res.ok) throw new Error("Failed to load ticket");
            const json = await res.json();
            setTicket(json.data);
        } catch (error) {
            toast.error("Failed to load ticket details");
        } finally {
            setLoading(false);
        }
    };

    const handleAction = async (action: string, data: unknown = {}) => {
        setPerformingAction(true);
        try {
            const res = await fetch(`/api/ops/support/${id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            });

            if (!res.ok) throw new Error(`Failed to perform ${action}`);

            const json = await res.json();
            setTicket(prev => prev ? ({ ...prev, ...data }) : null);
            toast.success(`${action} successful`);
        } catch (error: unknown) {
            toast.error(error.message);
        } finally {
            setPerformingAction(false);
        }
    };

    const handleReply = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!replyText.trim()) return;

        setSending(true);
        try {
            const res = await fetch(`/api/ops/support/${id}/reply`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ message: replyText }),
            });

            if (!res.ok) throw new Error("Failed to send reply");

            const json = await res.json();
            setReplyText("");

            // Optimistic update or refresh
            fetchTicket();
            toast.success("Reply sent");
        } catch (error) {
            toast.error("Failed to send reply");
        } finally {
            setSending(false);
        }
    };

    const toggleStatus = async () => {
        if (!ticket) return;
        const newStatus = ticket.status === "open" ? "closed" : "open";
        await handleAction(newStatus === 'closed' ? 'Close Ticket' : 'Re-open Ticket', { status: newStatus });
    };

    if (loading) return <div className="p-12 text-center text-gray-500 flex flex-col items-center gap-3">
        <RefreshCw className="animate-spin text-indigo-600" />
        Loading conversation...
    </div>;
    if (!ticket) return <div className="p-12 text-center text-red-500">Ticket not found</div>;

    return (
        <div className="h-[calc(100vh-64px)] flex flex-col bg-gray-50">
            {/* Header */}
            <div className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between shrink-0">
                <div className="flex items-center gap-4">
                    <Link href="/ops/inbox" className="text-gray-400 hover:text-gray-600">
                        <ArrowLeft size={20} />
                    </Link>
                    <div>
                        <h1 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                            {ticket.subject}
                            <span className={`px-2 py-0.5 rounded text-xs uppercase font-bold tracking-wide ${ticket.status === 'open'
                                ? 'bg-green-100 text-green-700'
                                : 'bg-gray-100 text-gray-600'
                                }`}>
                                {ticket.status}
                            </span>
                            <span className={cn(
                                "text-[10px] px-2 py-0.5 rounded font-bold uppercase",
                                ticket.priority === 'urgent' ? 'bg-red-100 text-red-700' :
                                    ticket.priority === 'high' ? 'bg-orange-100 text-orange-700' :
                                        'bg-blue-100 text-blue-700'
                            )}>
                                {ticket.priority}
                            </span>
                        </h1>
                        <div className="flex items-center gap-3 text-xs text-gray-500 mt-1">
                            <span className="flex items-center gap-1 font-medium text-indigo-600 hover:underline">
                                <Building2 size={12} /> <Link href={`/ops/merchants/${ticket.storeSlug}`}>{ticket.storeName}</Link>
                            </span>
                            <span>•</span>
                            <span>ID: {ticket.id}</span>
                            <span>•</span>
                            <span className="capitalize">{ticket.category.toLowerCase()}</span>
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <Button
                        onClick={() => handleAction('Assign to Me', { assignedToUserId: 'current-user-id' })} // Mock ID
                        disabled={performingAction || !!ticket.assignedToUserId}
                        variant="outline"
                        className="px-3 py-1.5 border border-gray-200 rounded text-xs font-semibold text-gray-700 hover:bg-gray-50 disabled:opacity-50 h-auto"
                    >
                        {ticket.assignedToUserId ? 'Assigned' : 'Assign to Me'}
                    </Button>
                    <Button
                        onClick={() => handleAction('Escalate to Engineering', { priority: 'urgent' })}
                        disabled={performingAction || ticket.priority === 'urgent'}
                        variant="outline"
                        className="px-3 py-1.5 border border-red-200 text-red-700 rounded text-xs font-semibold hover:bg-red-50 disabled:opacity-50 h-auto"
                    >
                        Escalate to Engineering
                    </Button>
                    <div className="h-6 w-px bg-gray-200 mx-1" />
                    <Button
                        onClick={toggleStatus}
                        disabled={performingAction}
                        className={`px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 border transition-colors h-auto ${ticket.status === 'open'
                            ? 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50'
                            : 'bg-green-600 border-transparent text-white hover:bg-green-700'
                            }`}
                    >
                        {ticket.status === 'open' ? (
                            <>
                                <CheckCircle2 size={16} /> Mark Resolved
                            </>
                        ) : (
                            <>
                                <RefreshCw size={16} /> Re-open Ticket
                            </>
                        )}
                    </Button>
                </div>
            </div>

            {/* AI Summary Banner */}
            {ticket.aiSummary && (
                <div className="bg-purple-50 border-b border-purple-100 px-6 py-3 flex items-start gap-3">
                    <Bot className="text-purple-600 shrink-0 mt-0.5" size={18} />
                    <div>
                        <span className="text-[10px] font-bold text-purple-600 uppercase tracking-wider block mb-0.5">AI Insights (Llama3-70B)</span>
                        <p className="text-sm text-purple-900 font-medium leading-tight italic">
                            "{ticket.aiSummary}"
                        </p>
                    </div>
                </div>
            )}

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
                {ticket.ticketMessages.length === 0 ? (
                    <div className="text-center text-gray-400 py-12">
                        No messages yet. Start the conversation!
                    </div>
                ) : (
                    ticket.ticketMessages.map((msg) => {
                        const isOps = msg.authorType === "OPS";
                        const isAi = msg.authorType === "AI";
                        const isMe = isOps; // For now assuming all OPS are "me" or aligned right

                        return (
                            <div
                                key={msg.id}
                                className={cn(
                                    "flex gap-3 max-w-3xl",
                                    isMe ? "ml-auto flex-row-reverse" : "mr-auto"
                                )}
                            >
                                {/* Avatar */}
                                <div className={cn(
                                    "w-8 h-8 rounded-full flex items-center justify-center shrink-0",
                                    isMe ? "bg-indigo-100 text-indigo-600" : isAi ? "bg-purple-100 text-purple-600" : "bg-gray-200 text-gray-600"
                                )}>
                                    {isMe ? <User size={14} /> : isAi ? <Bot size={14} /> : <User size={14} />}
                                </div>

                                {/* Bubble */}
                                <div className={cn(
                                    "group relative max-w-[80%]",
                                    isMe ? "items-end" : "items-start"
                                )}>
                                    <div className="flex items-baseline gap-2 mb-1 text-xs text-gray-500 px-1">
                                        <span className="font-medium">
                                            {isMe ? "You" : msg.authorName || "User"}
                                        </span>
                                        <span className="text-[10px]">
                                            {formatDistanceToNow(new Date(msg.createdAt), { addSuffix: true })}
                                        </span>
                                    </div>

                                    <div className={cn(
                                        "px-4 py-3 rounded-2xl text-sm whitespace-pre-wrap leading-relaxed shadow-sm",
                                        isMe
                                            ? "bg-indigo-600 text-white rounded-tr-none"
                                            : isAi
                                                ? "bg-purple-50 border border-purple-100 text-gray-800 rounded-tl-none"
                                                : "bg-white border border-gray-100 text-gray-800 rounded-tl-none"
                                    )}>
                                        {msg.message}
                                    </div>
                                </div>
                            </div>
                        );
                    })
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Reply Box */}
            {ticket.status === 'closed' ? (
                <div className="bg-gray-50 border-t border-gray-200 p-6 text-center">
                    <p className="text-gray-500 text-sm mb-3">This ticket is closed.</p>
                    <Button
                        onClick={toggleStatus}
                        variant="link"
                        className="text-indigo-600 text-sm font-medium hover:underline p-0 h-auto"
                    >
                        Re-open to reply
                    </Button>
                </div>
            ) : (
                <div className="bg-white border-t border-gray-200 p-4 shrink-0">
                    <form onSubmit={handleReply} className="max-w-4xl mx-auto relative flex gap-3">
                        <div className="flex-1 relative">
                            <textarea
                                value={replyText}
                                onChange={(e) => setReplyText(e.target.value)}
                                placeholder="Type your reply..."
                                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white resize-none transition-all"
                                rows={1}
                                onKeyDown={(e) => {
                                    if ((e.key === 'Enter' && !e.shiftKey) || ((e.metaKey || e.ctrlKey) && e.key === 'Enter')) {
                                        e.preventDefault();
                                        handleReply(e);
                                    }
                                }}
                            />
                        </div>
                        <Button
                            type="submit"
                            disabled={sending || !replyText.trim()}
                            className="px-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl flex items-center justify-center transition-colors disabled:opacity-50 disabled:cursor-not-allowed h-auto"
                        >
                            {sending ? <RefreshCw className="animate-spin" size={20} /> : <Send size={20} />}
                        </Button>
                    </form>
                    <div className="max-w-4xl mx-auto mt-2 text-xs text-center text-gray-400">
                        Press Enter to send, Shift+Enter for new line
                    </div>
                </div>
            )}
        </div>
    );
}
