import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { ChatInbox } from "../../../components/chat/ChatInbox";
export default function ChatPage() {
    return (_jsxs("div", { className: "min-h-screen bg-gray-50 flex flex-col", children: [_jsx("header", { className: "bg-white border-b border-gray-100 py-4 px-4 sticky top-0 z-10", children: _jsx("h1", { className: "text-xl font-bold text-gray-900 max-w-2xl mx-auto", children: "Messages" }) }), _jsx("main", { className: "flex-1 max-w-2xl mx-auto w-full p-4", children: _jsx(ChatInbox, {}) })] }));
}
