"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useRef, useEffect } from "react";
import { Button } from "@vayva/ui";
import { Send, Sparkles, MessageSquare } from "lucide-react";
const SUGGESTED_PROMPTS = [
    "How does delivery work?",
    "How do I publish my storefront?",
    "Pricing and limits?",
    "Can I use my own riders?",
];
export function HelpAIChat() {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const scrollRef = useRef(null);
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages]);
    const handleSend = async (text) => {
        if (!text.trim() || isLoading)
            return;
        const userMsg = {
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
            const assistantMsg = {
                role: "assistant",
                content: data.message || "I'm sorry, I couldn't process that. Please try again.",
                timestamp: new Date(),
            };
            setMessages((prev) => [...prev, assistantMsg]);
        }
        catch (error) {
            console.error("Chat Error:", error);
        }
        finally {
            setIsLoading(false);
        }
    };
    const onKeyDown = (e) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSend(input);
        }
    };
    return (_jsxs("div", { className: "bg-white rounded-3xl border border-gray-200 shadow-xl flex flex-col h-[600px] sticky top-32 overflow-hidden", children: [_jsx("div", { className: "p-6 border-b border-gray-100 bg-gray-50/50 flex items-center justify-between", children: _jsxs("div", { children: [_jsxs("h3", { className: "text-lg font-bold text-[#0F172A] flex items-center gap-2", children: [_jsx(Sparkles, { className: "w-5 h-5 text-[#22C55E]" }), "Ask Vayva AI"] }), _jsx("p", { className: "text-xs text-gray-500", children: "Get instant answers about Vayva." })] }) }), _jsxs("div", { ref: scrollRef, className: "flex-1 overflow-y-auto p-6 space-y-4 scroll-smooth", children: [messages.length === 0 && (_jsxs("div", { className: "h-full flex flex-col items-center justify-center text-center space-y-6 px-4", children: [_jsx("div", { className: "w-12 h-12 bg-green-50 rounded-2xl flex items-center justify-center", children: _jsx(MessageSquare, { className: "w-6 h-6 text-[#22C55E]" }) }), _jsxs("div", { children: [_jsx("p", { className: "text-sm font-medium text-gray-900", children: "How can I help you today?" }), _jsx("p", { className: "text-xs text-gray-500 mt-1", children: "Try asking one of our popular topics below." })] }), _jsx("div", { className: "flex flex-wrap gap-2 justify-center", children: SUGGESTED_PROMPTS.map((prompt) => (_jsx(Button, { onClick: () => handleSend(prompt), className: "px-3 py-1.5 bg-white border border-gray-200 rounded-full text-xs text-gray-600 hover:border-[#22C55E] hover:text-[#22C55E] transition-all", children: prompt }, prompt))) })] })), messages.map((msg, idx) => (_jsx("div", { className: `flex ${msg.role === "user" ? "justify-end" : "justify-start"}`, children: _jsxs("div", { className: `max-w-[85%] px-4 py-3 rounded-2xl text-sm ${msg.role === "user"
                                ? "bg-[#0F172A] text-white rounded-tr-none"
                                : "bg-gray-100 text-[#0F172A] rounded-tl-none"}`, children: [_jsx("div", { className: "whitespace-pre-wrap", children: msg.content }), _jsx("div", { className: `text-[10px] mt-1 opacity-50 ${msg.role === "user" ? "text-right" : "text-left"}`, children: msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) })] }) }, idx))), isLoading && (_jsx("div", { className: "flex justify-start", children: _jsxs("div", { className: "bg-gray-100 px-4 py-3 rounded-2xl rounded-tl-none flex items-center gap-1", children: [_jsx("div", { className: "w-1 h-1 bg-gray-400 rounded-full animate-bounce" }), _jsx("div", { className: "w-1 h-1 bg-gray-400 rounded-full animate-bounce [animation-delay:0.2s]" }), _jsx("div", { className: "w-1 h-1 bg-gray-400 rounded-full animate-bounce [animation-delay:0.4s]" })] }) }))] }), _jsxs("div", { className: "p-4 border-t border-gray-100", children: [_jsxs("div", { className: "relative group", children: [_jsx("textarea", { value: input, onChange: (e) => setInput(e.target.value), onKeyDown: onKeyDown, placeholder: "Type your question...", className: "w-full pl-4 pr-12 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#22C55E] focus:border-transparent outline-none text-sm transition-all resize-none max-h-32", rows: 1 }), _jsx(Button, { onClick: () => handleSend(input), disabled: !input.trim() || isLoading, className: "absolute right-2 bottom-2 p-2 bg-[#22C55E] text-white rounded-lg hover:bg-[#16A34A] disabled:opacity-50 disabled:grayscale transition-all", children: _jsx(Send, { className: "w-4 h-4" }) })] }), _jsx("p", { className: "text-[10px] text-gray-400 mt-2 text-center", children: "Vayva AI may provide inaccurate info. Verification is recommended." })] })] }));
}
