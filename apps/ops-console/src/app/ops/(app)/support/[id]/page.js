"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useOpsQuery } from "@/hooks/useOpsQuery";
import { ArrowLeft, User, Send, CheckCircle, Smartphone } from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";
import { Button } from "@vayva/ui";
export default function SupportDetailPage() {
    const { id } = useParams();
    const router = useRouter();
    const [reply, setReply] = useState("");
    const [sending, setSending] = useState(false);
    const { data: ticket, isLoading, refetch } = useOpsQuery(["support-ticket", id], () => fetch(`/api/ops/support/${id}`).then(res => res.json().then(j => j.data)));
    const handleStatusUpdate = async (newStatus) => {
        try {
            const res = await fetch(`/api/ops/support/${id}`, {
                method: "PATCH",
                body: JSON.stringify({ status: newStatus }),
                headers: { "Content-Type": "application/json" }
            });
            if (res.ok) {
                toast.success(`Ticket marked as ${newStatus}`);
                refetch();
            }
        }
        catch (e) {
            toast.error("Failed to update status");
        }
    };
    const handleSendReply = async (e) => {
        e.preventDefault();
        if (!reply.trim())
            return;
        // Currently APIs don't support message threads on SupportCase, assuming single thread or placeholder for now.
        // We will log it as a note for V1.
        setSending(true);
        // Simulate sending for UI feedback
        setTimeout(() => {
            setReply("");
            setSending(false);
            toast.message("Reply sent via Email/Chat (Simulation)", { description: reply });
        }, 800);
    };
    if (isLoading)
        return _jsx("div", { className: "p-12 text-center text-gray-400", children: "Loading ticket details..." });
    if (!ticket)
        return _jsx("div", { className: "p-12 text-center text-red-500", children: "Ticket not found" });
    const { store } = ticket;
    return (_jsxs("div", { className: "p-8 max-w-6xl mx-auto h-[calc(100vh-64px)] flex flex-col", children: [_jsxs("div", { className: "mb-6 flex items-center justify-between", children: [_jsxs("div", { children: [_jsxs(Link, { href: "/ops/support", className: "text-gray-500 text-sm hover:text-gray-800 flex items-center gap-1 mb-2", children: [_jsx(ArrowLeft, { size: 14 }), " Back to Support"] }), _jsxs("h1", { className: "text-2xl font-bold text-gray-900 flex items-center gap-3", children: [_jsxs("span", { className: "text-gray-400", children: ["#", ticket.id.slice(0, 6)] }), ticket.summary] })] }), _jsx("div", { className: "flex gap-2", children: ticket.status !== "RESOLVED" ? (_jsxs(Button, { onClick: () => handleStatusUpdate("RESOLVED"), className: "bg-green-600 hover:bg-green-700 text-white flex items-center gap-2 h-9", children: [_jsx(CheckCircle, { size: 16 }), " Mark Resolved"] })) : (_jsx(Button, { variant: "secondary", onClick: () => handleStatusUpdate("OPEN"), className: "h-9", children: "Re-open Ticket" })) })] }), _jsxs("div", { className: "flex gap-6 flex-1 min-h-0", children: [_jsxs("div", { className: "flex-1 bg-white border border-gray-200 rounded-xl shadow-sm flex flex-col overflow-hidden", children: [_jsx("div", { className: "flex-1 p-6 overflow-y-auto space-y-6 bg-gray-50/50", children: _jsxs("div", { className: "flex gap-4", children: [_jsx("div", { className: "w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center flex-shrink-0", children: _jsx(User, { size: 14, className: "text-gray-500" }) }), _jsxs("div", { children: [_jsxs("div", { className: "flex items-baseline gap-2", children: [_jsx("span", { className: "font-bold text-gray-900", children: store?.name || "Merchant" }), _jsx("span", { className: "text-xs text-gray-400", children: new Date(ticket.createdAt).toLocaleString() })] }), _jsxs("div", { className: "mt-1 bg-white border border-gray-200 p-4 rounded-r-xl rounded-bl-xl text-sm text-gray-800 shadow-sm", children: [_jsx("p", { className: "font-medium mb-1", children: ticket.summary }), _jsx("p", { className: "text-gray-600", children: JSON.stringify(ticket.links) || "No additional details." })] })] })] }) }), _jsx("div", { className: "p-4 bg-white border-t border-gray-200", children: _jsxs("form", { onSubmit: handleSendReply, className: "relative", children: [_jsx("textarea", { value: reply, onChange: e => setReply(e.target.value), placeholder: "Type your reply...", className: "w-full p-4 pr-12 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none resize-none h-24 text-sm" }), _jsx(Button, { type: "submit", size: "icon", disabled: sending || !reply.trim(), className: "absolute bottom-3 right-3 h-8 w-8", children: _jsx(Send, { size: 16 }) })] }) })] }), _jsxs("div", { className: "w-80 space-y-6", children: [_jsxs("div", { className: "bg-white border border-gray-200 rounded-xl p-6 shadow-sm", children: [_jsx("h3", { className: "text-sm font-bold text-gray-900 uppercase tracking-wider mb-4", children: "Merchant Context" }), _jsxs("div", { className: "flex items-center gap-3 mb-4", children: [_jsx("div", { className: "w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center text-indigo-700 font-bold", children: store?.name?.[0] }), _jsxs("div", { children: [_jsx("div", { className: "font-bold text-gray-900", children: store?.name }), _jsx("div", { className: "text-xs text-gray-500", children: store?.slug })] })] }), _jsxs("div", { className: "space-y-3", children: [_jsxs("div", { className: "flex items-center justify-between text-sm", children: [_jsx("span", { className: "text-gray-500", children: "Status" }), _jsx("span", { className: "px-2 py-0.5 bg-green-100 text-green-700 rounded text-xs font-bold", children: "ACTIVE" })] }), _jsxs("div", { className: "flex items-center justify-between text-sm", children: [_jsx("span", { className: "text-gray-500", children: "Tier" }), _jsx("span", { className: "font-medium", children: "Growth" })] })] }), _jsx("div", { className: "mt-6 pt-6 border-t border-gray-100", children: _jsx("a", { href: `/ops/merchants/${ticket.storeId}`, target: "_blank", className: "block w-full text-center py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50", children: "View Merchant Profile" }) })] }), store?.whatsappNumberE164 && (_jsxs("div", { className: "bg-green-50 border border-green-200 rounded-xl p-4 shadow-sm flex items-center gap-3", children: [_jsx(Smartphone, { className: "text-green-600", size: 20 }), _jsxs("div", { children: [_jsx("div", { className: "text-xs font-bold text-green-800 uppercase", children: "Whatsapp Connected" }), _jsx("div", { className: "text-sm text-green-700 font-mono", children: store.whatsappNumberE164 })] })] }))] })] })] }));
}
