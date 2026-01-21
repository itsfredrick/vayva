"use client";
import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState } from "react";
import { Button, Icon, cn } from "@vayva/ui";
export function SupportInbox() {
    const [tickets, setTickets] = useState([
        {
            id: "1",
            buyerName: "Amaka Obi",
            subject: "Double charge on Kwik delivery",
            summary: 'Buyer reported being charged twice for delivery. AI escalated because of "payment dispute" trigger.',
            status: "open",
            priority: "urgent",
            category: "PAYMENT",
            slaDueAt: "In 45 mins",
            lastMessageAt: "2 mins ago",
        },
        {
            id: "2",
            buyerName: "Tunde Afolayan",
            subject: "Where is my order #5502?",
            summary: "Buyer asking for status. AI escalated after 3 repeated confusion loops regarding tracking ID.",
            status: "open",
            priority: "medium",
            category: "DELIVERY",
            slaDueAt: "In 4 hours",
            lastMessageAt: "1 hour ago",
        },
    ]);
    const [selectedTicket, setSelectedTicket] = useState(null);
    return (_jsxs("div", { className: "flex h-[calc(100vh-120px)] overflow-hidden bg-white rounded-3xl border border-gray-100 shadow-sm", children: [_jsxs("div", { className: "w-80 border-r border-gray-50 flex flex-col", children: [_jsxs("div", { className: "p-6 border-b border-gray-50", children: [_jsx("h3", { className: "text-lg font-bold text-black", children: "Inbox" }), _jsxs("div", { className: "flex gap-2 mt-4", children: [_jsx("span", { className: "px-2 py-1 bg-green-50 text-green-600 text-[10px] font-bold rounded-full", children: "3 Open" }), _jsx("span", { className: "px-2 py-1 bg-orange-50 text-orange-600 text-[10px] font-bold rounded-full", children: "1 Urgent" })] })] }), _jsx("div", { className: "flex-1 overflow-y-auto", children: tickets.map((ticket) => (_jsxs(Button, { onClick: () => setSelectedTicket(ticket), variant: "ghost", className: cn("w-full text-left p-6 border-b border-gray-50 transition-colors", selectedTicket?.id === ticket.id
                                ? "bg-gray-50 bg-opacity-50"
                                : "hover:bg-gray-50"), children: [_jsxs("div", { className: "flex justify-between items-start mb-1", children: [_jsx("span", { className: "text-xs font-bold text-black", children: ticket.buyerName }), _jsx("span", { className: cn("text-[9px] font-bold px-1.5 py-0.5 rounded", ticket.priority === "urgent"
                                                ? "bg-red-50 text-red-600"
                                                : "bg-gray-100 text-gray-500"), children: ticket.priority.toUpperCase() })] }), _jsx("p", { className: "text-xs text-black font-medium truncate mb-1", children: ticket.subject }), _jsxs("div", { className: "flex justify-between items-center mt-3", children: [_jsxs("span", { className: "text-[10px] font-bold text-orange-600 flex items-center gap-1", children: [_jsx(Icon, { name: "Clock", size: 10 }), ticket.slaDueAt] }), _jsx("span", { className: "text-[10px] text-gray-400", children: ticket.lastMessageAt })] })] }, ticket.id))) })] }), _jsx("div", { className: "flex-1 flex flex-col bg-gray-50/30", children: selectedTicket ? (_jsxs(_Fragment, { children: [_jsx("div", { className: "p-6", children: _jsxs("div", { className: "bg-white p-6 rounded-2xl border border-blue-100 shadow-sm flex gap-4 items-start", children: [_jsx("div", { className: "w-10 h-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center shrink-0", children: _jsx(Icon, { name: "Brain", size: 20 }) }), _jsxs("div", { children: [_jsx("p", { className: "text-[10px] font-bold text-blue-500 uppercase tracking-widest mb-1", children: "AI Handoff Insight" }), _jsx("p", { className: "text-sm text-black font-medium leading-relaxed", children: selectedTicket.summary }), _jsxs("div", { className: "mt-3 flex gap-2", children: [_jsx(Button, { size: "sm", variant: "outline", className: "h-7 text-[10px] border-blue-200 text-blue-600 hover:bg-blue-50", children: "View Internal Trace" }), _jsx(Button, { size: "sm", variant: "outline", className: "h-7 text-[10px] border-blue-200 text-blue-600 hover:bg-blue-50", children: "Verify Transaction" })] })] })] }) }), _jsxs("div", { className: "flex-1 overflow-y-auto px-6 space-y-4", children: [_jsx("div", { className: "self-end bg-blue-600 text-white p-4 rounded-2xl rounded-tr-none max-w-md ml-auto text-sm", children: "Hello, I noticed a double charge for my delivery to Lekki. Can you check?" }), _jsx("div", { className: "self-start bg-white text-black p-4 rounded-2xl rounded-tl-none max-w-md border border-gray-100 text-sm italic text-gray-400", children: "AI: I apologize for the confusion with your payment. I'm alerting our finance team right now to look into this for you. One moment." }), _jsx("div", { className: "text-center py-4", children: _jsx("span", { className: "text-[10px] font-bold text-gray-400 uppercase bg-gray-100 px-3 py-1 rounded-full", children: "Conversation escalated to Merchant" }) })] }), _jsxs("div", { className: "p-6 bg-white border-t border-gray-100 mt-auto", children: [_jsxs("div", { className: "flex gap-2 mb-4", children: [_jsx(Button, { className: "text-[10px] font-bold text-gray-400 hover:text-black transition-colors", variant: "ghost", children: "/refund" }), _jsx(Button, { className: "text-[10px] font-bold text-gray-400 hover:text-black transition-colors", variant: "ghost", children: "/status" }), _jsx(Button, { className: "text-[10px] font-bold text-gray-400 hover:text-black transition-colors", variant: "ghost", children: "/apology" })] }), _jsxs("div", { className: "flex gap-4", children: [_jsx("input", { className: "flex-1 h-12 px-6 bg-gray-50 rounded-xl text-sm outline-none focus:ring-1 focus:ring-black", placeholder: "Type your reply here..." }), _jsx(Button, { className: "h-12 bg-[#0B0B0B] text-white px-8 rounded-xl font-bold", children: "Send Reply" })] })] })] })) : (_jsxs("div", { className: "flex-1 flex flex-col items-center justify-center text-center p-12", children: [_jsx("div", { className: "w-16 h-16 bg-gray-100 text-gray-300 rounded-full flex items-center justify-center mb-4", children: _jsx(Icon, { name: "MessageSquare", size: 32 }) }), _jsx("h3", { className: "text-lg font-bold text-black", children: "Select a conversation" }), _jsx("p", { className: "text-sm text-gray-500 mt-1 max-w-xs", children: "Pick a ticket from the left to handle escalations and chat with your customers." })] })) })] }));
}
