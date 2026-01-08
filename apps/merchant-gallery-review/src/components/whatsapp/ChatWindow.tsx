import React, { useState, useEffect, useRef } from "react";
import {
  WhatsAppMessage,
  WhatsAppMessageSender,
  WhatsAppConversation,
} from "@vayva/shared";
import { Icon, cn } from "@vayva/ui";

interface ChatWindowProps {
  conversation: WhatsAppConversation | null;
  messages: WhatsAppMessage[];
  onSendMessage: (content: string, linkedType?: any, linkedId?: any) => void;
  isLoadingMessages: boolean;
}

const QUICK_REPLIES = [
  "Confirm order",
  "Request payment",
  "Mark as ready",
  "Reschedule booking",
  "Send store link",
];

export const ChatWindow = ({
  conversation,
  messages,
  onSendMessage,
  isLoadingMessages,
}: ChatWindowProps) => {
  const [inputValue, setInputValue] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async () => {
    if (!inputValue.trim()) return;

    // Optimistic UI update could happen here, but for now we wait for API
    const messageToSend = inputValue;
    setInputValue(""); // Clear immediately

    try {
      await onSendMessage(messageToSend);
    } catch (error) {
      console.error("Failed to send", error);
      setInputValue(messageToSend); // Restore on failure
    }
  };

  const handleQuickReply = (text: string) => {
    setInputValue(text); // Just insert text, don't auto-send
  };

  if (!conversation) {
    return (
      <div className="h-full flex flex-col items-center justify-center text-gray-400">
        <Icon name="MessageSquare" size={48} className="mb-4 opacity-20" />
        <p>Select a conversation to start messaging</p>
      </div>
    );
  }

  if (isLoadingMessages) {
    return (
      <div className="h-full flex items-center justify-center text-gray-400">
        Loading messages...
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-[#E5DDD5]/30 relative">
      {" "}
      {/* WhatsApp-ish mild background */}
      {/* Header */}
      <header className="h-[60px] bg-white border-b border-gray-200 flex items-center px-4 justify-between shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 font-bold text-xs">
            {conversation.customerName
              ? conversation.customerName.charAt(0)
              : "?"}
          </div>
          <div>
            <h3 className="font-bold text-sm text-gray-900">
              {conversation.customerName || conversation.customerPhone}
            </h3>
            <p className="text-xs text-green-600 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500 block"></span>{" "}
              Online
            </p>
          </div>
        </div>
        {/* Actions */}
        <div className="flex gap-2">
          <button className="p-2 hover:bg-gray-100 rounded-lg text-gray-500">
            <Icon name="Phone" size={18} />
          </button>
          <button className="p-2 hover:bg-gray-100 rounded-lg text-gray-500">
            <Icon name="Search" size={18} />
          </button>
        </div>
      </header>
      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg) => {
          const isMe = msg.sender === WhatsAppMessageSender.MERCHANT;
          const isSystem = msg.sender === WhatsAppMessageSender.SYSTEM;

          if (isSystem) {
            return (
              <div key={msg.id} className="flex justify-center my-4">
                <div className="bg-gray-100 text-gray-500 text-xs px-3 py-1.5 rounded-full shadow-sm border border-gray-200 flex items-center gap-2">
                  <Icon name="Zap" size={10} />
                  <span className="font-medium">Automated by Vayva:</span>{" "}
                  {msg.content}
                </div>
              </div>
            );
          }

          return (
            <div
              key={msg.id}
              className={cn(
                "flex w-full",
                isMe ? "justify-end" : "justify-start",
              )}
            >
              <div
                className={cn(
                  "max-w-[70%] px-3 py-2 rounded-lg text-sm shadow-sm relative",
                  isMe
                    ? "bg-[#D9FDD3] text-gray-900 rounded-br-none"
                    : "bg-white text-gray-900 rounded-bl-none",
                )}
              >
                <p className="leading-relaxed">{msg.content}</p>
                <div
                  className={cn(
                    "text-[10px] mt-1 flex items-center gap-1",
                    isMe ? "justify-end text-green-800/60" : "text-gray-400",
                  )}
                >
                  {new Date(msg.timestamp).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                  {isMe && <Icon name="CheckCheck" size={10} />}
                </div>
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>
      {/* QUICK REPLY BAR */}
      <div className="bg-white border-t border-gray-200 p-2 overflow-x-auto whitespace-nowrap flex gap-2 custom-scrollbar shrink-0">
        {QUICK_REPLIES.map((qr) => (
          <button
            key={qr}
            onClick={() => handleQuickReply(qr)}
            className="px-3 py-1.5 rounded-full border border-gray-200 bg-gray-50 text-xs text-gray-600 hover:bg-gray-100 hover:border-gray-300 transition-colors"
          >
            {qr}
          </button>
        ))}
      </div>
      {/* Input Area */}
      <div className="p-3 bg-white flex items-end gap-2 shrink-0">
        <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full">
          <Icon name="Plus" size={20} />
        </button>
        <div className="flex-1 bg-gray-100 rounded-xl px-4 py-2 flex items-center">
          <input
            className="w-full bg-transparent border-none outline-none text-sm text-gray-900 placeholder:text-gray-400"
            placeholder="Type a message..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
          />
        </div>
        <button
          onClick={handleSend}
          disabled={!inputValue.trim()}
          className="p-2 bg-green-600 text-white rounded-full hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <Icon
            name="Send"
            size={18}
            className={inputValue.trim() ? "translate-x-0.5" : ""}
          />
        </button>
      </div>
    </div>
  );
};
