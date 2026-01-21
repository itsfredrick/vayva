"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from "react";
import { formatDistanceToNow } from "date-fns";
import { Bell, Check, Loader2 } from "lucide-react";
import Link from "next/link";
import { Button, cn } from "@vayva/ui";
import { EmptyState } from "@/components/ui/empty-state";
export default function NotificationsPage() {
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [statusFilter, setStatusFilter] = useState("unread");
    const [nextCursor, setNextCursor] = useState(null);
    const fetchNotifications = async (reset = false) => {
        setLoading(true);
        try {
            const cursorParam = reset
                ? ""
                : nextCursor
                    ? `&cursor=${nextCursor}`
                    : "";
            const res = await fetch(`/api/merchant/notifications?status=${statusFilter}&limit=20${cursorParam}`);
            if (res.ok) {
                const data = await res.json();
                if (reset) {
                    setNotifications(data.items);
                }
                else {
                    setNotifications((prev) => [...prev, ...data.items]);
                }
                setNextCursor(data.next_cursor);
            }
        }
        finally {
            setLoading(false);
        }
    };
    useEffect(() => {
        fetchNotifications(true);
    }, [statusFilter]);
    const markAsRead = async (id) => {
        await fetch("/api/merchant/notifications/mark-read", {
            method: "POST",
            body: JSON.stringify({ ids: [id] }),
        });
        setNotifications(notifications.map((n) => (n.id === id ? { ...n, isRead: true } : n)));
    };
    const markAllRead = async () => {
        await fetch("/api/merchant/notifications/mark-read", {
            method: "POST",
            body: JSON.stringify({ mark_all: true }),
        });
        setNotifications(notifications.map((n) => ({ ...n, isRead: true })));
    };
    return (_jsxs("div", { className: "max-w-4xl mx-auto p-6 space-y-6", children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { children: [_jsx("h1", { className: "text-2xl font-semibold text-gray-900", children: "Notifications" }), _jsx("p", { className: "text-sm text-gray-500 mt-1", children: "Stay updated with your store activity." })] }), _jsxs(Button, { onClick: markAllRead, variant: "outline", className: "bg-transparent hover:bg-indigo-50 text-indigo-600 hover:text-indigo-800 border-transparent shadow-none", children: [_jsx(Check, { className: "w-4 h-4 mr-2" }), "Mark all as read"] })] }), _jsxs("div", { className: "flex space-x-2 border-b border-gray-200 pb-1", children: [_jsx(Button, { variant: "ghost", onClick: () => setStatusFilter("unread"), className: cn("rounded-none border-b-2 px-4 py-2 font-medium hover:bg-transparent h-auto", statusFilter === "unread"
                            ? "border-indigo-600 text-indigo-600"
                            : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-200"), children: "Unread" }), _jsx(Button, { variant: "ghost", onClick: () => setStatusFilter("all"), className: cn("rounded-none border-b-2 px-4 py-2 font-medium hover:bg-transparent h-auto", statusFilter === "all"
                            ? "border-indigo-600 text-indigo-600"
                            : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-200"), children: "All Notifications" })] }), _jsx("div", { className: "bg-white/80 backdrop-blur-xl border border-gray-200/50 rounded-2xl shadow-sm overflow-hidden min-h-[400px]", children: loading && notifications.length === 0 ? (_jsx("div", { className: "flex justify-center items-center h-64", children: _jsx(Loader2, { className: "w-8 h-8 text-indigo-600 animate-spin" }) })) : notifications.length === 0 ? (_jsx(EmptyState, { title: "No notifications", description: "You're all caught up! New updates will appear here.", icon: Bell })) : (_jsxs("div", { className: "divide-y divide-gray-100", children: [notifications.map((n) => (_jsxs("div", { className: `p-4 hover:bg-gray-50/50 transition-colors flex gap-4 ${!n.isRead ? "bg-indigo-50/20" : ""}`, children: [_jsx("div", { className: `mt-1.5 w-2.5 h-2.5 rounded-full flex-shrink-0 ${n.severity === "critical"
                                        ? "bg-red-500"
                                        : n.severity === "success"
                                            ? "bg-green-500"
                                            : n.severity === "warning"
                                                ? "bg-yellow-500"
                                                : "bg-blue-500"}` }), _jsxs("div", { className: "flex-1 min-w-0", children: [_jsxs("div", { className: "flex justify-between items-start", children: [_jsx("h3", { className: `text-sm ${!n.isRead ? "font-bold text-gray-900" : "font-medium text-gray-700"}`, children: n.title }), _jsx("span", { className: "text-xs text-gray-400 whitespace-nowrap ml-2", children: formatDistanceToNow(new Date(n.createdAt), {
                                                        addSuffix: true,
                                                    }) })] }), _jsx("p", { className: "text-sm text-gray-600 mt-1", children: n.body }), _jsxs("div", { className: "mt-3 flex items-center gap-3", children: [n.actionUrl && (_jsx(Link, { href: n.actionUrl, onClick: () => markAsRead(n.id), className: "text-xs font-medium text-indigo-600 hover:text-indigo-800", children: "View Details" })), !n.isRead && (_jsx(Button, { variant: "link", onClick: () => markAsRead(n.id), className: "text-xs text-gray-400 hover:text-gray-600 p-0 h-auto font-normal", children: "Mark as read" }))] })] })] }, n.id))), nextCursor && (_jsx("div", { className: "p-4 text-center", children: _jsx(Button, { variant: "ghost", onClick: () => fetchNotifications(false), disabled: loading, className: "text-sm text-indigo-600 hover:text-indigo-800 font-medium disabled:opacity-50 hover:bg-indigo-50", children: loading ? "Loading..." : "Load More" }) }))] })) })] }));
}
