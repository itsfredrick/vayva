import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { cn } from "@vayva/ui";
export const ConversationList = ({ conversations, selectedId, onSelect, getHref, isLoading, }) => {
    // Sort: Unread > Open > Recent
    const sorted = [...conversations].sort((a, b) => {
        if (a.unreadCount !== b.unreadCount)
            return b.unreadCount - a.unreadCount;
        return (new Date(b.lastMessageAt).getTime() - new Date(a.lastMessageAt).getTime());
    });
    if (isLoading) {
        return (_jsx("div", { className: "p-4 text-center text-gray-400", children: "Loading conversations..." }));
    }
    if (conversations.length === 0) {
        return (_jsx("div", { className: "p-8 text-center text-gray-400", children: "No messages yet." }));
    }
    return (_jsx("div", { className: "flex flex-col h-full overflow-y-auto custom-scrollbar", children: sorted.map((conv) => {
            const Wrapper = getHref ? require("next/link").default : "button";
            const props = getHref
                ? { href: getHref(conv.id) }
                : { onClick: () => onSelect?.(conv.id) };
            return (_jsxs(Wrapper, { ...props, className: cn("flex flex-col gap-1 p-4 border-b border-gray-100 hover:bg-gray-50 transition-colors text-left group relative", selectedId === conv.id && "bg-[#F3F4F6]"), children: [_jsxs("div", { className: "flex justify-between items-start w-full", children: [_jsx("span", { className: cn("font-medium text-sm text-gray-900 truncate", conv.unreadCount > 0 && "font-bold"), children: conv.customerName || conv.customerPhone }), _jsx("span", { className: "text-[10px] text-gray-400 whitespace-nowrap ml-2", children: new Date(conv.lastMessageAt).toLocaleTimeString([], {
                                    hour: "2-digit",
                                    minute: "2-digit",
                                }) })] }), _jsx("p", { className: cn("text-xs truncate w-full pr-6", conv.unreadCount > 0
                            ? "text-gray-900 font-medium"
                            : "text-gray-500"), children: conv.lastMessagePreview }), _jsx("div", { className: "flex items-center gap-2 mt-2", children: conv.tags?.map((tag) => (_jsx("span", { className: cn("text-[10px] px-1.5 py-0.5 rounded-full font-medium uppercase tracking-wide", tag === "order" && "bg-blue-50 text-blue-600", tag === "booking" && "bg-purple-50 text-purple-600", tag === "inquiry" && "bg-gray-100 text-gray-500"), children: tag }, tag))) }), conv.unreadCount > 0 && (_jsx("div", { className: "absolute right-4 top-10 w-5 h-5 rounded-full bg-green-500 text-white text-[10px] font-bold flex items-center justify-center shadow-sm", children: conv.unreadCount }))] }, conv.id));
        }) }));
};
