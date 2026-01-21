"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from "react";
import { Icon, Button } from "@vayva/ui";
import { useRouter } from "next/navigation";
export const AICoachWidget = () => {
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(true);
    const router = useRouter();
    useEffect(() => {
        fetch("/api/ai/coach/messages")
            .then((res) => res.json())
            .then((data) => {
            setMessages(data);
            setLoading(false);
        })
            .catch((err) => {
            console.error(err);
            setLoading(false);
        });
    }, []);
    const latestMessage = messages[0];
    if (loading || !latestMessage)
        return null;
    return (_jsxs("div", { className: "bg-gradient-to-br from-green-50 to-emerald-50 border border-green-100 rounded-2xl p-6 relative overflow-hidden", children: [_jsxs("div", { className: "flex items-start gap-4 z-10 relative", children: [_jsx("div", { className: "w-10 h-10 bg-green-500 rounded-full flex items-center justify-center shrink-0 shadow-lg shadow-green-200", children: _jsx(Icon, { name: "MessageCircle", className: "text-white", size: 20 }) }), _jsxs("div", { className: "flex-1", children: [_jsxs("div", { className: "flex items-center justify-between mb-1", children: [_jsx("span", { className: "text-xs font-bold text-green-700 uppercase tracking-wide", children: "Daily Coach" }), _jsx("span", { className: "text-[10px] text-green-600/70", children: "Just now" })] }), _jsx("p", { className: "text-gray-900 font-medium text-sm whitespace-pre-line leading-relaxed", children: latestMessage.content }), latestMessage.actions && (_jsx("div", { className: "flex gap-2 mt-3", children: latestMessage.actions.map((action, idx) => (_jsx(Button, { onClick: () => action.link && router.push(action.link), className: "bg-white text-green-700 px-3 py-1.5 rounded-lg text-xs font-bold border border-green-200 hover:bg-green-50 transition-colors shadow-sm", children: action.label }, idx))) }))] }), _jsx(Button, { className: "text-green-300 hover:text-green-600 p-1", children: _jsx(Icon, { name: "X", size: 16 }) })] }), _jsx("div", { className: "absolute -bottom-10 -right-10 w-32 h-32 bg-green-200/20 rounded-full blur-2xl" })] }));
};
