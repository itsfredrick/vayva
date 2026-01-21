"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useRef, useEffect } from "react";
import { Button } from "@vayva/ui";
import { MessageSquare, Send, Bot, Sparkles } from "lucide-react";
export function MarketingAIAssistant() {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        {
            role: "assistant",
            content: "Hi there! I'm Vayva AI. How can I help you transform your WhatsApp business today?",
        },
    ]);
    const [input, setInput] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef(null);
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };
    useEffect(() => {
        if (isOpen) {
            scrollToBottom();
        }
    }, [messages, isOpen]);
    const handleSend = async () => {
        if (!input.trim() || isLoading)
            return;
        const userMessage = input.trim();
        setInput("");
        const newMessages = [
            ...messages,
            { role: "user", content: userMessage },
        ];
        setMessages(newMessages);
        setIsLoading(true);
        try {
            const response = await fetch("/api/public/ai/chat", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ messages: newMessages }),
            });
            const data = await response.json();
            if (data.success) {
                setMessages([
                    ...newMessages,
                    { role: "assistant", content: data.message },
                ]);
            }
            else {
                setMessages([
                    ...newMessages,
                    {
                        role: "assistant",
                        content: "Sorry, I hit a snag. Could you try again?",
                    },
                ]);
            }
        }
        catch (error) {
            setMessages([
                ...newMessages,
                {
                    role: "assistant",
                    content: "Connection error. Please check your internet.",
                },
            ]);
        }
        finally {
            setIsLoading(false);
        }
    };
    return (_jsxs("div", { className: "fixed bottom-6 right-6 z-[9999] font-sans", children: [isOpen && (_jsxs("div", { className: "absolute bottom-20 right-0 w-[380px] h-[550px] bg-white rounded-2xl shadow-2xl border border-gray-100 flex flex-col overflow-hidden animate-in slide-in-from-bottom-5 duration-300", children: [_jsxs("div", { className: "bg-[#0F172A] p-5 flex items-center justify-between text-white", children: [_jsxs("div", { className: "flex items-center gap-3", children: [_jsx("div", { className: "w-10 h-10 bg-[#22C55E] rounded-full flex items-center justify-center", children: _jsx(Bot, { size: 24, className: "text-white" }) }), _jsxs("div", { children: [_jsx("h3", { className: "font-bold text-sm", children: "Vayva Assistant" }), _jsxs("div", { className: "flex items-center gap-1.5", children: [_jsx("span", { className: "w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" }), _jsx("span", { className: "text-[11px] text-gray-400 font-medium", children: "Always active" })] })] })] }), _jsx(Button, { onClick: () => setIsOpen(false), className: "p-2 hover:bg-white/10 rounded-full transition-colors", children: _jsxs("svg", { width: "20", height: "20", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2.5", strokeLinecap: "round", strokeLinejoin: "round", children: [_jsx("line", { x1: "18", y1: "6", x2: "6", y2: "18" }), _jsx("line", { x1: "6", y1: "6", x2: "18", y2: "18" })] }) })] }), _jsxs("div", { className: "flex-1 overflow-y-auto p-5 space-y-4 bg-gray-50/50", children: [messages.map((m, i) => (_jsx("div", { className: `flex ${m.role === "user" ? "justify-end" : "justify-start"}`, children: _jsx("div", { className: `max-w-[85%] p-4 rounded-2xl text-[14px] leading-relaxed shadow-sm ${m.role === "user"
                                        ? "bg-[#22C55E] text-white rounded-tr-none"
                                        : "bg-white text-[#1E293B] border border-gray-100 rounded-tl-none"}`, children: m.content }) }, i))), isLoading && (_jsx("div", { className: "flex justify-start", children: _jsx("div", { className: "bg-white border border-gray-100 p-4 rounded-2xl rounded-tl-none shadow-sm flex items-center gap-2", children: _jsxs("div", { className: "flex gap-1", children: [_jsx("span", { className: "w-1.5 h-1.5 bg-gray-300 rounded-full animate-bounce" }), _jsx("span", { className: "w-1.5 h-1.5 bg-gray-300 rounded-full animate-bounce delay-100" }), _jsx("span", { className: "w-1.5 h-1.5 bg-gray-300 rounded-full animate-bounce delay-200" })] }) }) })), _jsx("div", { ref: messagesEndRef })] }), _jsxs("div", { className: "p-4 bg-white border-t border-gray-100", children: [_jsxs("div", { className: "relative flex items-center", children: [_jsx("input", { type: "text", value: input, onChange: (e) => setInput(e.target.value), onKeyDown: (e) => e.key === "Enter" && handleSend(), placeholder: "Ask us anything...", className: "w-full pl-4 pr-12 py-3.5 bg-gray-50 border-none rounded-xl text-sm focus:ring-2 focus:ring-[#22C55E]/20 transition-all text-gray-900 placeholder:text-gray-400" }), _jsx(Button, { onClick: handleSend, disabled: isLoading || !input.trim(), className: "absolute right-2 p-2 bg-[#22C55E] text-white rounded-lg hover:bg-[#16A34A] disabled:opacity-50 disabled:hover:bg-[#22C55E] transition-all", children: _jsx(Send, { size: 18 }) })] }), _jsx("p", { className: "text-[10px] text-center text-gray-400 mt-3 font-medium tracking-tight", children: "Powered by Vayva Intelligence" })] })] })), _jsxs(Button, { onClick: () => setIsOpen(!isOpen), className: `group relative flex items-center justify-center w-16 h-16 rounded-full shadow-2xl transition-all duration-500 scale-100 hover:scale-105 active:scale-95 ${isOpen ? "bg-[#0F172A] rotate-90" : "bg-[#22C55E]"}`, children: [_jsx("div", { className: "absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full border-2 border-white flex items-center justify-center animate-bounce", children: _jsx("span", { className: "text-[10px] text-white font-bold", children: "1" }) }), isOpen ? (_jsxs("svg", { width: "24", height: "24", viewBox: "0 0 24 24", fill: "none", stroke: "white", strokeWidth: "2.5", strokeLinecap: "round", strokeLinejoin: "round", children: [_jsx("line", { x1: "18", y1: "6", x2: "6", y2: "18" }), _jsx("line", { x1: "6", y1: "6", x2: "18", y2: "18" })] })) : (_jsxs("div", { className: "relative", children: [_jsx(Sparkles, { className: "text-white absolute -top-4 -right-4 w-4 h-4 animate-pulse" }), _jsx(MessageSquare, { size: 28, className: "text-white fill-white/10" })] })), !isOpen && (_jsxs("div", { className: "absolute right-20 bg-white px-4 py-2.5 rounded-xl shadow-xl border border-gray-100 text-sm font-bold text-[#0F172A] whitespace-nowrap opacity-0 group-hover:opacity-100 translate-x-4 group-hover:translate-x-0 transition-all pointer-events-none", children: ["Have questions? Chat with AI", _jsx("div", { className: "absolute right-[-6px] top-1/2 -translate-y-1/2 w-3 h-3 bg-white rotate-45 border-r border-t border-gray-100" })] }))] })] }));
}
