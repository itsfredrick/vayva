import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect, useRef } from "react";
import { WhatsAppMessageSender, } from "@vayva/shared";
import { Icon, cn, Button } from "@vayva/ui";
const QUICK_REPLIES = [
    "Confirm order",
    "Request payment",
    "Mark as ready",
    "Reschedule booking",
    "Send store link",
];
export const ChatWindow = ({ conversation, messages, onSendMessage, isLoadingMessages, }) => {
    const [inputValue, setInputValue] = useState("");
    const messagesEndRef = useRef(null);
    // Auto-scroll to bottom
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);
    const handleSend = async () => {
        if (!inputValue.trim())
            return;
        // Optimistic UI update could happen here, but for now we wait for API
        const messageToSend = inputValue;
        setInputValue(""); // Clear immediately
        try {
            await onSendMessage(messageToSend);
        }
        catch (error) {
            console.error("Failed to send", error);
            setInputValue(messageToSend); // Restore on failure
        }
    };
    const handleQuickReply = (text) => {
        setInputValue(text); // Just insert text, don't auto-send
    };
    if (!conversation) {
        return (_jsxs("div", { className: "h-full flex flex-col items-center justify-center text-gray-400", children: [_jsx(Icon, { name: "MessageSquare", size: 48, className: "mb-4 opacity-20" }), _jsx("p", { children: "Select a conversation to start messaging" })] }));
    }
    if (isLoadingMessages) {
        return (_jsx("div", { className: "h-full flex items-center justify-center text-gray-400", children: "Loading messages..." }));
    }
    return (_jsxs("div", { className: "flex flex-col h-full bg-[#E5DDD5]/30 relative", children: [" ", _jsxs("header", { className: "h-[60px] bg-white border-b border-gray-200 flex items-center px-4 justify-between shrink-0", children: [_jsxs("div", { className: "flex items-center gap-3", children: [_jsx("div", { className: "w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 font-bold text-xs", children: conversation.customerName
                                    ? conversation.customerName.charAt(0)
                                    : "?" }), _jsxs("div", { children: [_jsx("h3", { className: "font-bold text-sm text-gray-900", children: conversation.customerName || conversation.customerPhone }), _jsxs("p", { className: "text-xs text-green-600 flex items-center gap-1", children: [_jsx("span", { className: "w-1.5 h-1.5 rounded-full bg-green-500 block" }), " ", "Online"] })] })] }), _jsxs("div", { className: "flex gap-2", children: [_jsx(Button, { size: "icon", variant: "ghost", className: "text-gray-500 hover:bg-gray-100", "aria-label": "Call Customer", title: "Call Customer", children: _jsx(Icon, { name: "Phone", size: 18 }) }), _jsx(Button, { size: "icon", variant: "ghost", className: "text-gray-500 hover:bg-gray-100", "aria-label": "Search Messages", title: "Search Messages", children: _jsx(Icon, { name: "Search", size: 18 }) })] })] }), _jsxs("div", { className: "flex-1 overflow-y-auto p-4 space-y-4", children: [messages.map((msg) => {
                        const isMe = msg.sender === WhatsAppMessageSender.MERCHANT;
                        const isSystem = msg.sender === WhatsAppMessageSender.SYSTEM;
                        if (isSystem) {
                            return (_jsx("div", { className: "flex justify-center my-4", children: _jsxs("div", { className: "bg-gray-100 text-gray-500 text-xs px-3 py-1.5 rounded-full shadow-sm border border-gray-200 flex items-center gap-2", children: [_jsx(Icon, { name: "Zap", size: 10 }), _jsx("span", { className: "font-medium", children: "Automated by Vayva:" }), " ", msg.content] }) }, msg.id));
                        }
                        return (_jsx("div", { className: cn("flex w-full", isMe ? "justify-end" : "justify-start"), children: _jsxs("div", { className: cn("max-w-[70%] px-3 py-2 rounded-lg text-sm shadow-sm relative", isMe
                                    ? "bg-[#D9FDD3] text-gray-900 rounded-br-none"
                                    : "bg-white text-gray-900 rounded-bl-none"), children: [_jsx("p", { className: "leading-relaxed", children: msg.content }), _jsxs("div", { className: cn("text-[10px] mt-1 flex items-center gap-1", isMe ? "justify-end text-green-800/60" : "text-gray-400"), children: [new Date(msg.timestamp).toLocaleTimeString([], {
                                                hour: "2-digit",
                                                minute: "2-digit",
                                            }), isMe && _jsx(Icon, { name: "CheckCheck", size: 10 })] })] }) }, msg.id));
                    }), _jsx("div", { ref: messagesEndRef })] }), _jsx("div", { className: "bg-white border-t border-gray-200 p-2 overflow-x-auto whitespace-nowrap flex gap-2 custom-scrollbar shrink-0", children: QUICK_REPLIES.map((qr) => (_jsx(Button, { variant: "outline", size: "sm", onClick: () => handleQuickReply(qr), className: "rounded-full bg-gray-50 text-xs text-gray-600 border-gray-200 h-8", children: qr }, qr))) }), _jsxs("div", { className: "p-3 bg-white flex items-end gap-2 shrink-0", children: [_jsx(Button, { size: "icon", variant: "ghost", className: "text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full", "aria-label": "Add attachment", title: "Add attachment", children: _jsx(Icon, { name: "Plus", size: 20 }) }), _jsx("div", { className: "flex-1 bg-gray-100 rounded-xl px-4 py-2 flex items-center", children: _jsx("input", { className: "w-full bg-transparent border-none outline-none text-sm text-gray-900 placeholder:text-gray-400", placeholder: "Type a message...", value: inputValue, onChange: (e) => setInputValue(e.target.value), onKeyDown: (e) => {
                                if (e.key === "Enter" && !e.shiftKey) {
                                    e.preventDefault();
                                    handleSend();
                                }
                            } }) }), _jsx(Button, { size: "icon", onClick: handleSend, disabled: !inputValue.trim(), className: "bg-green-600 hover:bg-green-700 text-white rounded-full transition-colors h-10 w-10", "aria-label": "Send message", title: "Send message", children: _jsx(Icon, { name: "Send", size: 18, className: inputValue.trim() ? "translate-x-0.5" : "" }) })] })] }));
};
