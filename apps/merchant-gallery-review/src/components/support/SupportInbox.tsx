"use client";

import React, { useState } from "react";
import { Button, Icon, cn, GlassPanel } from "@vayva/ui";

interface Ticket {
  id: string;
  buyerName: string;
  subject: string;
  summary: string;
  status: "open" | "pending" | "resolved";
  priority: "low" | "medium" | "high" | "urgent";
  category: string;
  slaDueAt: string;
  lastMessageAt: string;
}

export function SupportInbox() {
  const [tickets, setTickets] = useState<Ticket[]>([
    {
      id: "1",
      buyerName: "Amaka Obi",
      subject: "Double charge on Kwik delivery",
      summary:
        'Buyer reported being charged twice for delivery. AI escalated because of "payment dispute" trigger.',
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
      summary:
        "Buyer asking for status. AI escalated after 3 repeated confusion loops regarding tracking ID.",
      status: "open",
      priority: "medium",
      category: "DELIVERY",
      slaDueAt: "In 4 hours",
      lastMessageAt: "1 hour ago",
    },
  ]);

  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);

  return (
    <div className="flex h-[calc(100vh-120px)] overflow-hidden bg-white rounded-3xl border border-gray-100 shadow-sm">
      {/* 1. Ticket List */}
      <div className="w-80 border-r border-gray-50 flex flex-col">
        <div className="p-6 border-b border-gray-50">
          <h3 className="text-lg font-bold text-[#0B0B0B]">Inbox</h3>
          <div className="flex gap-2 mt-4">
            <span className="px-2 py-1 bg-green-50 text-green-600 text-[10px] font-bold rounded-full">
              3 Open
            </span>
            <span className="px-2 py-1 bg-orange-50 text-orange-600 text-[10px] font-bold rounded-full">
              1 Urgent
            </span>
          </div>
        </div>
        <div className="flex-1 overflow-y-auto">
          {tickets.map((ticket) => (
            <button
              key={ticket.id}
              onClick={() => setSelectedTicket(ticket)}
              className={cn(
                "w-full text-left p-6 border-b border-gray-50 transition-colors",
                selectedTicket?.id === ticket.id
                  ? "bg-gray-50 bg-opacity-50"
                  : "hover:bg-gray-50",
              )}
            >
              <div className="flex justify-between items-start mb-1">
                <span className="text-xs font-bold text-[#0B0B0B]">
                  {ticket.buyerName}
                </span>
                <span
                  className={cn(
                    "text-[9px] font-bold px-1.5 py-0.5 rounded",
                    ticket.priority === "urgent"
                      ? "bg-red-50 text-red-600"
                      : "bg-gray-100 text-gray-500",
                  )}
                >
                  {ticket.priority.toUpperCase()}
                </span>
              </div>
              <p className="text-xs text-[#0B0B0B] font-medium truncate mb-1">
                {ticket.subject}
              </p>
              <div className="flex justify-between items-center mt-3">
                <span className="text-[10px] font-bold text-orange-600 flex items-center gap-1">
                  <Icon name="Clock" size={10} />
                  {ticket.slaDueAt}
                </span>
                <span className="text-[10px] text-gray-400">
                  {ticket.lastMessageAt}
                </span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* 2. Chat Area */}
      <div className="flex-1 flex flex-col bg-gray-50/30">
        {selectedTicket ? (
          <>
            {/* Handoff Insight Card */}
            <div className="p-6">
              <div className="bg-white p-6 rounded-2xl border border-blue-100 shadow-sm flex gap-4 items-start">
                <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center shrink-0">
                  <Icon name="Brain" size={20} />
                </div>
                <div>
                  <p className="text-[10px] font-bold text-blue-500 uppercase tracking-widest mb-1">
                    AI Handoff Insight
                  </p>
                  <p className="text-sm text-[#0B0B0B] font-medium leading-relaxed">
                    {selectedTicket.summary}
                  </p>
                  <div className="mt-3 flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      className="h-7 text-[10px] border-blue-200 text-blue-600 hover:bg-blue-50"
                    >
                      View Internal Trace
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="h-7 text-[10px] border-blue-200 text-blue-600 hover:bg-blue-50"
                    >
                      Verify Transaction
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            {/* Thread (Test) */}
            <div className="flex-1 overflow-y-auto px-6 space-y-4">
              <div className="self-end bg-blue-600 text-white p-4 rounded-2xl rounded-tr-none max-w-md ml-auto text-sm">
                Hello, I noticed a double charge for my delivery to Lekki. Can
                you check?
              </div>
              <div className="self-start bg-white text-[#0B0B0B] p-4 rounded-2xl rounded-tl-none max-w-md border border-gray-100 text-sm italic text-gray-400">
                AI: I apologize for the confusion with your payment. I'm
                alerting our finance team right now to look into this for you.
                One moment.
              </div>
              <div className="text-center py-4">
                <span className="text-[10px] font-bold text-gray-400 uppercase bg-gray-100 px-3 py-1 rounded-full">
                  Conversation escalated to Merchant
                </span>
              </div>
            </div>

            {/* Reply Area */}
            <div className="p-6 bg-white border-t border-gray-100 mt-auto">
              <div className="flex gap-2 mb-4">
                <button className="text-[10px] font-bold text-gray-400 hover:text-black transition-colors">
                  /refund
                </button>
                <button className="text-[10px] font-bold text-gray-400 hover:text-black transition-colors">
                  /status
                </button>
                <button className="text-[10px] font-bold text-gray-400 hover:text-black transition-colors">
                  /apology
                </button>
              </div>
              <div className="flex gap-4">
                <input
                  className="flex-1 h-12 px-6 bg-gray-50 rounded-xl text-sm outline-none focus:ring-1 focus:ring-black"
                  placeholder="Type your reply here..."
                />
                <Button className="h-12 bg-[#0B0B0B] text-white px-8 rounded-xl font-bold">
                  Send Reply
                </Button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-center p-12">
            <div className="w-16 h-16 bg-gray-100 text-gray-300 rounded-full flex items-center justify-center mb-4">
              <Icon name="MessageSquare" size={32} />
            </div>
            <h3 className="text-lg font-bold text-[#0B0B0B]">
              Select a conversation
            </h3>
            <p className="text-sm text-gray-500 mt-1 max-w-xs">
              Pick a ticket from the left to handle escalations and chat with
              your customers.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
