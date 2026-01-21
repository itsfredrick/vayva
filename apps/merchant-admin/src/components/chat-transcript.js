import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "react/jsx-runtime";
import { Button, Icon } from "@vayva/ui";
export function ChatTranscript({ messages }) {
    return (_jsx("div", { className: "flex flex-col gap-4 p-4", children: messages.map((msg) => {
            const isCustomer = msg.sender === "customer";
            return (_jsx("div", { className: `flex ${isCustomer ? "justify-start" : "justify-end"}`, children: _jsxs("div", { className: `max-w-[80%] rounded-lg p-3 ${isCustomer
                        ? "bg-[#202c33] text-white rounded-tl-none"
                        : msg.sender === "ai"
                            ? "bg-[#005c4b] text-white rounded-tr-none border border-emerald-500/20"
                            : "bg-[#2a3942] text-white rounded-tr-none border border-orange-500/20"}`, children: [msg.sender !== "customer" && (_jsx("div", { className: "text-[10px] font-bold mb-1 uppercase tracking-wider flex items-center gap-1 opacity-70", children: msg.sender === "ai" ? (_jsxs(_Fragment, { children: [_jsx(Icon, { name: "Bot", size: 10 }), " AI Assistant"] })) : (_jsxs(_Fragment, { children: [_jsx(Icon, { name: "User", size: 10 }), " Staff"] })) })), _jsx("p", { className: "text-sm whitespace-pre-wrap", children: msg.text }), msg.product && (_jsxs("div", { className: "mt-2 p-2 rounded bg-black/20 flex items-center gap-3", children: [_jsx("div", { className: "w-12 h-12 bg-white/10 rounded flex items-center justify-center text-[10px]", children: "IMG" }), _jsxs("div", { children: [_jsx("div", { className: "font-bold text-sm", children: msg.product.name }), _jsx("div", { className: "text-xs opacity-70", children: msg.product.price })] }), _jsx(Button, { size: "sm", className: "ml-auto h-7 text-xs", children: "View" })] })), _jsx("div", { className: "text-[10px] text-white/40 text-right mt-1", children: msg.time })] }) }, msg.id));
        }) }));
}
