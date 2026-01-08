"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  MessageCircle,
  Send,
  X,
  Bot,
  User,
  ThumbsUp,
  ThumbsDown,
} from "lucide-react";

interface Message {
  id: string;
  role: "bot" | "user";
  text: string;
  timestamp: Date;
  actions?: string[];
  messageId?: string; // Server ID for feedback
  feedback?: "SOLVED" | "NOT_SOLVED";
}

export const SupportChat: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      role: "bot",
      text: "Hi! I am your Vayva Support Assistant. How can I help you manage your store today?",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      role: "user",
      text: input,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/support/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          query: input,
          history: messages.map((m) => ({
            role: m.role === "bot" ? "assistant" : "user",
            content: m.text,
          })),
        }),
      });
      const data = await response.json();

      const botMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: "bot",
        text:
          data.message ||
          "I'm sorry, I'm having trouble processing that right now.",
        timestamp: new Date(),
        actions: data.suggestedActions,
        messageId: data.messageId,
      };
      setMessages((prev) => [...prev, botMsg]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        {
          id: "err",
          role: "bot",
          text: "Sorry, I lost my connection. Please try again.",
          timestamp: new Date(),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFeedback = async (
    msgLocalId: string,
    serverId: string,
    rating: "SOLVED" | "NOT_SOLVED",
  ) => {
    setMessages((prev) =>
      prev.map((m) => (m.id === msgLocalId ? { ...m, feedback: rating } : m)),
    );
    try {
      await fetch("/api/support/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messageId: serverId,
          rating,
          conversationId: "session_1",
        }),
      });
    } catch (e) {
      console.error("Feedback failed", e);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            onClick={() => setIsOpen(true)}
            className="w-14 h-14 bg-indigo-600 rounded-full flex items-center justify-center text-white shadow-xl hover:bg-indigo-700 transition-colors"
          >
            <MessageCircle size={28} />
          </motion.button>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ y: 20, opacity: 0, scale: 0.95 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 20, opacity: 0, scale: 0.95 }}
            className="w-80 sm:w-96 h-[500px] bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col border border-gray-100"
          >
            {/* Header */}
            <div className="bg-indigo-600 p-4 text-white flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                  <Bot size={18} />
                </div>
                <div>
                  <h3 className="font-semibold text-sm">Vayva Assistant</h3>
                  <div className="flex items-center gap-1.5">
                    <div className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
                    <span className="text-[10px] text-indigo-100">
                      Usually replies instantly
                    </span>
                  </div>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="hover:bg-white/10 p-1 rounded-lg transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Auto-Escalation Banner */}
            {messages.filter((m) => m.feedback === "NOT_SOLVED").length >=
              2 && (
              <div className="bg-orange-50 p-3 border-b border-orange-100 flex items-center justify-between">
                <div className="text-xs text-orange-800">
                  <strong>Need extra help?</strong>
                  <br />
                  We can connect you to a human agent.
                </div>
                <button
                  onClick={() => {
                    setInput("Please connect me to a human agent");
                    handleSendMessage();
                  }}
                  className="text-xs bg-orange-100 text-orange-800 px-3 py-1.5 rounded-lg border border-orange-200 font-medium hover:bg-orange-200 transition-colors"
                >
                  Talk to Human
                </button>
              </div>
            )}

            {/* Messages */}
            <div
              ref={scrollRef}
              className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50/50"
            >
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex flex-col ${msg.role === "user" ? "items-end" : "items-start"}`}
                >
                  <div
                    className={`max-w-[85%] p-3 rounded-2xl text-sm ${
                      msg.role === "user"
                        ? "bg-indigo-600 text-white rounded-tr-none"
                        : "bg-white text-gray-800 shadow-sm border border-gray-100 rounded-tl-none"
                    }`}
                  >
                    {msg.text}
                  </div>

                  {/* Action Chips */}
                  {msg.role === "bot" && (msg as any).actions && (
                    <div className="mt-2 flex flex-wrap gap-2">
                      {(msg as any).actions.map((action: string, i: number) => (
                        <button
                          key={i}
                          onClick={() =>
                            setInput(
                              action === "Talk to Human"
                                ? "I need to speak to a human"
                                : action,
                            )
                          }
                          className="text-xs bg-indigo-50 text-indigo-700 px-2 py-1 rounded-full border border-indigo-100 hover:bg-indigo-100 transition-colors"
                        >
                          {action}
                        </button>
                      ))}
                    </div>
                  )}

                  {/* Feedback Loop */}
                  {msg.role === "bot" && msg.messageId && (
                    <div className="mt-1 flex gap-2 ml-1">
                      {msg.feedback ? (
                        <span
                          className={`text-[10px] font-medium ${msg.feedback === "SOLVED" ? "text-green-600" : "text-gray-400"}`}
                        >
                          {msg.feedback === "SOLVED"
                            ? "Marked as Solved"
                            : "Feedback recorded"}
                        </span>
                      ) : (
                        <>
                          <button
                            onClick={() =>
                              handleFeedback(msg.id, msg.messageId!, "SOLVED")
                            }
                            className="text-gray-400 hover:text-green-600 transition-colors"
                            title="Solved my issue"
                          >
                            <ThumbsUp size={12} />
                          </button>
                          <button
                            onClick={() =>
                              handleFeedback(
                                msg.id,
                                msg.messageId!,
                                "NOT_SOLVED",
                              )
                            }
                            className="text-gray-400 hover:text-red-500 transition-colors"
                            title="Didn't help"
                          >
                            <ThumbsDown size={12} />
                          </button>
                        </>
                      )}
                    </div>
                  )}
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-white p-3 rounded-2xl shadow-sm border border-gray-100 rounded-tl-none flex gap-1 items-center">
                    <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" />
                    <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce [animation-delay:0.2s]" />
                    <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce [animation-delay:0.4s]" />
                  </div>
                </div>
              )}
            </div>

            {/* Quick Chips & Input */}
            <div className="bg-white border-t border-gray-100">
              {/* Quick Suggestion Chips */}
              <div className="px-4 py-2 flex gap-2 overflow-x-auto no-scrollbar mask-linear-fade">
                {[
                  "Check Status",
                  "Billing Help",
                  "Connect WhatsApp",
                  "Talk to Human",
                ].map((chip) => (
                  <button
                    key={chip}
                    onClick={() => {
                      if (chip === "Talk to Human") {
                        setInput("Please connect me to a human agent");
                        handleSendMessage();
                      } else {
                        setInput(chip);
                      }
                    }}
                    className="whitespace-nowrap flex-shrink-0 text-[10px] font-medium bg-gray-50 text-gray-600 px-2.5 py-1.5 rounded-full border border-gray-200 hover:bg-gray-100 transition-colors"
                  >
                    {chip}
                  </button>
                ))}
              </div>

              {/* Main Input */}
              <div className="p-4 pt-2">
                <div className="flex items-center gap-2 bg-gray-50 rounded-xl px-3 py-2 border border-gray-200 focus-within:border-indigo-300 focus-within:ring-2 focus-within:ring-indigo-100 transition-all">
                  <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                    placeholder="Ask for help..."
                    className="flex-1 bg-transparent border-none focus:ring-0 text-sm py-1 placeholder:text-gray-400"
                  />
                  <button
                    onClick={handleSendMessage}
                    disabled={!input.trim() || isLoading}
                    className="p-1.5 bg-indigo-600 text-white rounded-lg disabled:opacity-50 disabled:bg-gray-400 hover:bg-indigo-700 transition-colors"
                  >
                    <Send size={16} />
                  </button>
                </div>
                <p className="text-[10px] text-gray-400 text-center mt-3">
                  Secure, AI-powered merchant support
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
