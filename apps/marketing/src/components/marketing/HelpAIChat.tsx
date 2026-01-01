"use client";

import React, { useState, useRef, useEffect } from "react";
import { Button } from "@vayva/ui";
import { Send, Sparkles, MessageSquare } from "lucide-react";

interface Message {
    role: "user" | "assistant";
    content: string;
    timestamp: Date;
}

const SUGGESTED_PROMPTS = [
    "How does delivery work?",
    "How do I publish my storefront?",
    "Pricing and limits?",
    "Can I use my own riders?",
];

export function HelpAIChat() {
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages]);

    const handleSend = async (text: string) => {
        if (!text.trim() || isLoading) return;

        const userMsg: Message = {
            role: "user",
            content: text,
            timestamp: new Date(),
        };

        setMessages((prev) => [...prev, userMsg]);
        setInput("");
        setIsLoading(true);

        try {
            const response = await fetch("/api/ai/chat", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ message: text }),
            });

            const data = await response.json();

            const assistantMsg: Message = {
                role: "assistant",
                content: data.message || "I'm sorry, I couldn't process that. Please try again.",
                timestamp: new Date(),
            };

            setMessages((prev) => [...prev, assistantMsg]);
        } catch (error) {
            console.error("Chat Error:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const onKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSend(input);
        }
    };

    return (
        <div className="bg-white rounded-3xl border border-gray-200 shadow-xl flex flex-col h-[600px] sticky top-32 overflow-hidden">
            {/* Header */}
            <div className="p-6 border-b border-gray-100 bg-gray-50/50 flex items-center justify-between">
                <div>
                    <h3 className="text-lg font-bold text-[#0F172A] flex items-center gap-2">
                        <Sparkles className="w-5 h-5 text-[#22C55E]" />
                        Ask Vayva AI
                    </h3>
                    <p className="text-xs text-gray-500">Get instant answers about Vayva.</p>
                </div>
            </div>

            {/* Messages */}
            <div
                ref={scrollRef}
                className="flex-1 overflow-y-auto p-6 space-y-4 scroll-smooth"
            >
                {messages.length === 0 && (
                    <div className="h-full flex flex-col items-center justify-center text-center space-y-6 px-4">
                        <div className="w-12 h-12 bg-green-50 rounded-2xl flex items-center justify-center">
                            <MessageSquare className="w-6 h-6 text-[#22C55E]" />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-gray-900">How can I help you today?</p>
                            <p className="text-xs text-gray-500 mt-1">Try asking one of our popular topics below.</p>
                        </div>
                        <div className="flex flex-wrap gap-2 justify-center">
                            {SUGGESTED_PROMPTS.map((prompt) => (
                                <button
                                    key={prompt}
                                    onClick={() => handleSend(prompt)}
                                    className="px-3 py-1.5 bg-white border border-gray-200 rounded-full text-xs text-gray-600 hover:border-[#22C55E] hover:text-[#22C55E] transition-all"
                                >
                                    {prompt}
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {messages.map((msg, idx) => (
                    <div
                        key={idx}
                        className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                    >
                        <div
                            className={`max-w-[85%] px-4 py-3 rounded-2xl text-sm ${msg.role === "user"
                                    ? "bg-[#0F172A] text-white rounded-tr-none"
                                    : "bg-gray-100 text-[#0F172A] rounded-tl-none"
                                }`}
                        >
                            <div className="whitespace-pre-wrap">{msg.content}</div>
                            <div className={`text-[10px] mt-1 opacity-50 ${msg.role === "user" ? "text-right" : "text-left"}`}>
                                {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </div>
                        </div>
                    </div>
                ))}

                {isLoading && (
                    <div className="flex justify-start">
                        <div className="bg-gray-100 px-4 py-3 rounded-2xl rounded-tl-none flex items-center gap-1">
                            <div className="w-1 h-1 bg-gray-400 rounded-full animate-bounce" />
                            <div className="w-1 h-1 bg-gray-400 rounded-full animate-bounce [animation-delay:0.2s]" />
                            <div className="w-1 h-1 bg-gray-400 rounded-full animate-bounce [animation-delay:0.4s]" />
                        </div>
                    </div>
                )}
            </div>

            {/* Composer */}
            <div className="p-4 border-t border-gray-100">
                <div className="relative group">
                    <textarea
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={onKeyDown}
                        placeholder="Type your question..."
                        className="w-full pl-4 pr-12 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#22C55E] focus:border-transparent outline-none text-sm transition-all resize-none max-h-32"
                        rows={1}
                    />
                    <button
                        onClick={() => handleSend(input)}
                        disabled={!input.trim() || isLoading}
                        className="absolute right-2 bottom-2 p-2 bg-[#22C55E] text-white rounded-lg hover:bg-[#16A34A] disabled:opacity-50 disabled:grayscale transition-all"
                    >
                        <Send className="w-4 h-4" />
                    </button>
                </div>
                <p className="text-[10px] text-gray-400 mt-2 text-center">
                    Vayva AI may provide inaccurate info. Verification is recommended.
                </p>
            </div>
        </div>
    );
}
