"use client";
import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState, useEffect, useRef } from "react";
import { Button } from "@vayva/ui";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, Send, X, Bot, ThumbsUp, ThumbsDown, } from "lucide-react";
export const SupportChat = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        {
            id: "1",
            role: "bot",
            text: "Hi! I am your Vayva Support Assistant. How can I help you manage your store today?",
            timestamp: new Date(),
        },
    ]);
    const [input, setInput] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const scrollRef = useRef(null);
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages]);
    const handleSendMessage = async () => {
        if (!input.trim() || isLoading)
            return;
        const userMsg = {
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
            const botMsg = {
                id: (Date.now() + 1).toString(),
                role: "bot",
                text: data.message ||
                    "I'm sorry, I'm having trouble processing that right now.",
                timestamp: new Date(),
                actions: data.suggestedActions,
                messageId: data.messageId,
            };
            setMessages((prev) => [...prev, botMsg]);
        }
        catch (error) {
            setMessages((prev) => [
                ...prev,
                {
                    id: "err",
                    role: "bot",
                    text: "Sorry, I lost my connection. Please try again.",
                    timestamp: new Date(),
                },
            ]);
        }
        finally {
            setIsLoading(false);
        }
    };
    const handleFeedback = async (msgLocalId, serverId, rating) => {
        setMessages((prev) => prev.map((m) => (m.id === msgLocalId ? { ...m, feedback: rating } : m)));
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
        }
        catch (e) {
            console.error("Feedback failed", e);
        }
    };
    return (_jsxs("div", { className: "fixed bottom-6 right-6 z-50", children: [_jsx(AnimatePresence, { children: !isOpen && (_jsx(motion.button, { initial: { scale: 0, opacity: 0 }, animate: { scale: 1, opacity: 1 }, exit: { scale: 0, opacity: 0 }, onClick: () => setIsOpen(true), className: "w-14 h-14 bg-indigo-600 rounded-full flex items-center justify-center text-white shadow-xl hover:bg-indigo-700 transition-colors", children: _jsx(MessageCircle, { size: 28 }) })) }), _jsx(AnimatePresence, { children: isOpen && (_jsxs(motion.div, { initial: { y: 20, opacity: 0, scale: 0.95 }, animate: { y: 0, opacity: 1, scale: 1 }, exit: { y: 20, opacity: 0, scale: 0.95 }, className: "w-80 sm:w-96 h-[500px] bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col border border-gray-100", children: [_jsxs("div", { className: "bg-indigo-600 p-4 text-white flex items-center justify-between", children: [_jsxs("div", { className: "flex items-center gap-3", children: [_jsx("div", { className: "w-8 h-8 bg-white/20 rounded-full flex items-center justify-center", children: _jsx(Bot, { size: 18 }) }), _jsxs("div", { children: [_jsx("h3", { className: "font-semibold text-sm", children: "Vayva Assistant" }), _jsxs("div", { className: "flex items-center gap-1.5", children: [_jsx("div", { className: "w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" }), _jsx("span", { className: "text-[10px] text-indigo-100", children: "Usually replies instantly" })] })] })] }), _jsx(Button, { onClick: () => setIsOpen(false), className: "hover:bg-white/10 p-1 rounded-lg transition-colors", children: _jsx(X, { size: 20 }) })] }), messages.filter((m) => m.feedback === "NOT_SOLVED").length >=
                            2 && (_jsxs("div", { className: "bg-orange-50 p-3 border-b border-orange-100 flex items-center justify-between", children: [_jsxs("div", { className: "text-xs text-orange-800", children: [_jsx("strong", { children: "Need extra help?" }), _jsx("br", {}), "We can connect you to a human agent."] }), _jsx(Button, { onClick: () => {
                                        setInput("Please connect me to a human agent");
                                        handleSendMessage();
                                    }, className: "text-xs bg-orange-100 text-orange-800 px-3 py-1.5 rounded-lg border border-orange-200 font-medium hover:bg-orange-200 transition-colors", children: "Talk to Human" })] })), _jsxs("div", { ref: scrollRef, className: "flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50/50", children: [messages.map((msg) => (_jsxs("div", { className: `flex flex-col ${msg.role === "user" ? "items-end" : "items-start"}`, children: [_jsx("div", { className: `max-w-[85%] p-3 rounded-2xl text-sm ${msg.role === "user"
                                                ? "bg-indigo-600 text-white rounded-tr-none"
                                                : "bg-white text-gray-800 shadow-sm border border-gray-100 rounded-tl-none"}`, children: msg.text }), msg.role === "bot" && msg.actions && (_jsx("div", { className: "mt-2 flex flex-wrap gap-2", children: msg.actions.map((action, i) => (_jsx(Button, { onClick: () => setInput(action === "Talk to Human"
                                                    ? "I need to speak to a human"
                                                    : action), className: "text-xs bg-indigo-50 text-indigo-700 px-2 py-1 rounded-full border border-indigo-100 hover:bg-indigo-100 transition-colors", children: action }, i))) })), msg.role === "bot" && msg.messageId && (_jsx("div", { className: "mt-1 flex gap-2 ml-1", children: msg.feedback ? (_jsx("span", { className: `text-[10px] font-medium ${msg.feedback === "SOLVED" ? "text-green-600" : "text-gray-400"}`, children: msg.feedback === "SOLVED"
                                                    ? "Marked as Solved"
                                                    : "Feedback recorded" })) : (_jsxs(_Fragment, { children: [_jsx(Button, { onClick: () => handleFeedback(msg.id, msg.messageId, "SOLVED"), className: "text-gray-400 hover:text-green-600 transition-colors", title: "Solved my issue", children: _jsx(ThumbsUp, { size: 12 }) }), _jsx(Button, { onClick: () => handleFeedback(msg.id, msg.messageId, "NOT_SOLVED"), className: "text-gray-400 hover:text-red-500 transition-colors", title: "Didn't help", children: _jsx(ThumbsDown, { size: 12 }) })] })) }))] }, msg.id))), isLoading && (_jsx("div", { className: "flex justify-start", children: _jsxs("div", { className: "bg-white p-3 rounded-2xl shadow-sm border border-gray-100 rounded-tl-none flex gap-1 items-center", children: [_jsx("div", { className: "w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" }), _jsx("div", { className: "w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce [animation-delay:0.2s]" }), _jsx("div", { className: "w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce [animation-delay:0.4s]" })] }) }))] }), _jsxs("div", { className: "bg-white border-t border-gray-100", children: [_jsx("div", { className: "px-4 py-2 flex gap-2 overflow-x-auto no-scrollbar mask-linear-fade", children: [
                                        "Check Status",
                                        "Billing Help",
                                        "Connect WhatsApp",
                                        "Talk to Human",
                                    ].map((chip) => (_jsx(Button, { onClick: () => {
                                            if (chip === "Talk to Human") {
                                                setInput("Please connect me to a human agent");
                                                handleSendMessage();
                                            }
                                            else {
                                                setInput(chip);
                                            }
                                        }, className: "whitespace-nowrap flex-shrink-0 text-[10px] font-medium bg-gray-50 text-gray-600 px-2.5 py-1.5 rounded-full border border-gray-200 hover:bg-gray-100 transition-colors", children: chip }, chip))) }), _jsxs("div", { className: "p-4 pt-2", children: [_jsxs("div", { className: "flex items-center gap-2 bg-gray-50 rounded-xl px-3 py-2 border border-gray-200 focus-within:border-indigo-300 focus-within:ring-2 focus-within:ring-indigo-100 transition-all", children: [_jsx("input", { type: "text", value: input, onChange: (e) => setInput(e.target.value), onKeyDown: (e) => e.key === "Enter" && handleSendMessage(), placeholder: "Ask for help...", className: "flex-1 bg-transparent border-none focus:ring-0 text-sm py-1 placeholder:text-gray-400" }), _jsx(Button, { onClick: handleSendMessage, disabled: !input.trim() || isLoading, className: "p-1.5 bg-indigo-600 text-white rounded-lg disabled:opacity-50 disabled:bg-gray-400 hover:bg-indigo-700 transition-colors", children: _jsx(Send, { size: 16 }) })] }), _jsx("p", { className: "text-[10px] text-gray-400 text-center mt-3", children: "Secure, AI-powered merchant support" })] })] })] })) })] }));
};
