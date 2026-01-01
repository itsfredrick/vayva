"use client";

import React from "react";
import { WaThread, WaMessage } from "@/services/wa-agent";
import { useRouter, useParams } from "next/navigation";
import { Icon, Button, cn } from "@vayva/ui";

// --- Sidebar List ---
export const InboxSidebar = ({
  threads,
  activeId,
}: {
  threads: WaThread[];
  activeId?: string;
}) => {
  const router = useRouter();
  return (
    <div className="w-80 border-r border-gray-100 bg-white flex flex-col h-full overflow-hidden">
      <div className="p-4 border-b border-gray-100 flex items-center justify-between">
        <h2 className="font-bold text-[#0B0B0B]">Inbox</h2>
        <div className="flex gap-2">
          <button className="text-gray-400 hover:text-black">
            <Icon name="Filter" size={16} />
          </button>
          <button className="text-gray-400 hover:text-black">
            <Icon name="Search" size={16} />
          </button>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto">
        {threads.map((thread) => (
          <div
            key={thread.id}
            onClick={() => router.push(`/admin/wa-agent/inbox/${thread.id}`)}
            className={cn(
              "p-4 border-b border-gray-50 cursor-pointer hover:bg-gray-50 transition-colors group",
              activeId === thread.id
                ? "bg-blue-50/50 border-l-4 border-l-blue-600 pl-[13px]"
                : "pl-4",
            )}
          >
            <div className="flex justify-between items-start mb-1">
              <span
                className={cn(
                  "font-bold text-sm",
                  activeId === thread.id ? "text-blue-900" : "text-[#0B0B0B]",
                )}
              >
                {thread.customerName}
              </span>
              <span className="text-[10px] text-gray-400">
                {new Date(thread.lastMessageTime).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </span>
            </div>
            <p className="text-xs text-gray-500 line-clamp-1 group-hover:text-gray-700">
              {thread.lastMessage}
            </p>
            <div className="mt-2 flex gap-2">
              {thread.status === "waiting" && (
                <span className="bg-yellow-100 text-yellow-700 text-[10px] font-bold px-1.5 py-0.5 rounded">
                  WAITING
                </span>
              )}
              {thread.status === "open" && (
                <span className="bg-green-100 text-green-700 text-[10px] font-bold px-1.5 py-0.5 rounded">
                  OPEN
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// --- Chat Window ---
export const ChatWindow = ({ thread }: { thread?: WaThread | null }) => {
  if (!thread) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center bg-gray-50/50 text-gray-400 p-8 text-center">
        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
          <Icon name="MessageSquare" size={24} />
        </div>
        <p>Select a conversation to start chatting.</p>
      </div>
    );
  }
  return (
    <div className="flex-1 flex flex-col bg-[#E5DDD5]/10 h-full overflow-hidden relative">
      {/* Header */}
      <div className="h-16 border-b border-gray-200 bg-white flex items-center justify-between px-6 shrink-0 z-10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold">
            {thread.customerName.charAt(0)}
          </div>
          <div>
            <h3 className="font-bold text-[#0B0B0B] text-sm">
              {thread.customerName}
            </h3>
            <p className="text-xs text-gray-500">{thread.customerPhone}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() =>
              alert("Conversation reported for compliance review.")
            }
            className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors flex items-center gap-2 text-xs font-medium"
            title="Report Conversation"
          >
            <Icon name="ShieldAlert" size={16} />
            <span className="hidden md:inline">Report</span>
          </button>
          <Button variant="outline" size="sm">
            Resolve
          </Button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 p-6 overflow-y-auto flex flex-col gap-4 bg-[url('https://user-images.githubusercontent.com/15075759/28719144-86dc0f70-73b1-11e7-911d-60d70fcded21.png')] bg-repeat bg-opacity-5">
        {/* Test messages for the selected thread if empty in store */}
        {(thread.messages.length > 0
          ? thread.messages
          : [
              {
                id: "test1",
                text: thread.lastMessage,
                sender: "user",
                timestamp: thread.lastMessageTime,
              },
            ]
        ).map((msg: any) => (
          <div
            key={msg.id}
            className={cn(
              "max-w-[70%] p-3 rounded-xl text-sm shadow-sm relative",
              msg.sender === "user"
                ? "bg-white self-start rounded-tl-none"
                : "bg-[#d9fdd3] self-end rounded-tr-none",
            )}
          >
            <p className="text-[#0B0B0B]">{msg.text}</p>
            <span className="text-[10px] text-gray-400 block text-right mt-1 opacity-70 border-t border-black/5 pt-1">
              {new Date(msg.timestamp).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </span>
          </div>
        ))}
      </div>

      {/* Input */}
      <div className="p-4 bg-white border-t border-gray-200 shrink-0">
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Type a message..."
            className="flex-1 h-10 border border-gray-200 rounded-full px-4 text-sm focus:outline-none focus:border-blue-500"
          />
          <button className="w-10 h-10 rounded-full bg-[#00A884] text-white flex items-center justify-center hover:bg-[#008f6f] transition-colors">
            <Icon name="Send" size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};

// --- AI Actions Panel ---
export const AiActionsPanel = ({ thread }: { thread?: WaThread | null }) => {
  if (!thread) return null;
  return (
    <div className="w-80 border-l border-gray-100 bg-white flex flex-col h-full overflow-y-auto p-4 gap-6">
      <h3 className="font-bold text-[#0B0B0B] text-sm uppercase tracking-wide">
        AI Assistant
      </h3>

      {/* Suggestion */}
      {thread.aiSuggestions?.reply && (
        <div className="bg-purple-50 p-4 rounded-xl border border-purple-100">
          <div className="flex items-center gap-2 mb-2 text-purple-700">
            <Icon name="Zap" size={14} />
            <span className="text-xs font-bold">Suggested Reply</span>
          </div>
          <p className="text-sm text-[#0B0B0B] mb-3">
            {thread.aiSuggestions.reply}
          </p>
          <div className="flex gap-2">
            <Button
              size="sm"
              className="w-full bg-purple-600 hover:bg-purple-700 text-white"
            >
              Use
            </Button>
            <Button size="sm" variant="outline" className="w-10">
              <Icon name="Pencil" size={14} />
            </Button>
          </div>
        </div>
      )}

      {/* Approvals */}
      {thread.aiSuggestions?.action && (
        <div className="bg-orange-50 p-4 rounded-xl border border-orange-100">
          <div className="flex items-center gap-2 mb-2 text-orange-700">
            <Icon name="ShieldAlert" size={14} />
            <span className="text-xs font-bold">Approval Required</span>
          </div>
          <p className="text-sm font-bold text-[#0B0B0B]">
            {thread.aiSuggestions.action.description}
          </p>
          <p className="text-xs text-gray-500 mt-1 mb-3">
            Risk Level:{" "}
            <span className="uppercase font-bold text-orange-600">
              {thread.aiSuggestions.action.risk}
            </span>
          </p>
          <div className="grid grid-cols-2 gap-2">
            <Button
              size="sm"
              variant="outline"
              className="text-red-600 border-red-200 hover:bg-red-50"
            >
              Reject
            </Button>
            <Button
              size="sm"
              className="bg-orange-600 hover:bg-orange-700 text-white"
            >
              Approve
            </Button>
          </div>
        </div>
      )}

      {/* Catalog */}
      <div>
        <h4 className="text-xs font-bold text-gray-400 mb-2 uppercase">
          Quick Share
        </h4>
        <div className="flex flex-col gap-2">
          <button className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded-lg text-left transition-colors">
            <div className="w-10 h-10 bg-gray-100 rounded overflow-hidden"></div>
            <div className="flex-1">
              <p className="text-xs font-bold text-[#0B0B0B]">Vintage Jacket</p>
              <p className="text-[10px] text-gray-500">₦ 15,000</p>
            </div>
            <Icon name="Plus" size={14} className="text-gray-400" />
          </button>
        </div>
      </div>
    </div>
  );
};
