import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useEffect, useState } from "react";
import { Button, Icon, cn } from "@vayva/ui";
import Link from "next/link";
import { NotificationItem } from "./NotificationItem";
export const NotificationCenter = ({ isOpen, onClose, }) => {
    const [notifications, setNotifications] = useState([]);
    const [filter, setFilter] = useState("all");
    const [loading, setLoading] = useState(false);
    useEffect(() => {
        if (isOpen) {
            fetchNotifications();
        }
    }, [isOpen, filter]);
    const fetchNotifications = async () => {
        setLoading(true);
        try {
            let url = "/api/merchant/notifications?limit=50";
            if (filter === "unread") {
                url += "&status=unread";
            }
            else if (filter === "critical") {
                url += "&type=critical";
            }
            else {
                // all
                url += "&status=all";
            }
            const res = await fetch(url);
            const data = await res.json();
            setNotifications(data.items || []); // Ensure we handle the { items: [], ... } response structure
        }
        catch (err) {
            console.error("Failed to load notifications", err);
        }
        finally {
            setLoading(false);
        }
    };
    const handleMarkRead = async (id) => {
        try {
            await fetch("/api/notifications/mark-read", {
                method: "POST",
                body: JSON.stringify({ notificationId: id }),
            });
            // Improve UI update: mark local state as read immediately
            setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, isRead: true } : n)));
        }
        catch (err) {
            console.error("Failed to mark read", err);
        }
    };
    const handleMarkAllRead = async () => {
        try {
            await fetch("/api/notifications/mark-read", {
                method: "POST",
                body: JSON.stringify({ markAll: true }),
            });
            setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
        }
        catch (err) {
            console.error("Failed to mark all read", err);
        }
    };
    if (!isOpen)
        return null;
    return (_jsxs(_Fragment, { children: [_jsx("div", { className: "fixed inset-0 bg-black/20 backdrop-blur-[1px] z-40 transition-opacity", onClick: onClose }), _jsxs("div", { className: "fixed top-16 right-4 bottom-4 w-full max-w-sm bg-white rounded-2xl shadow-2xl border border-gray-200 z-50 flex flex-col overflow-hidden animate-in slide-in-from-right-4 duration-300", children: [_jsxs("div", { className: "p-4 border-b border-gray-100 flex justify-between items-center bg-white/80 backdrop-blur sticky top-0 z-10", children: [_jsxs("div", { children: [_jsx("h3", { className: "font-bold text-gray-900", children: "Notifications" }), _jsx("div", { className: "flex gap-2 mt-2", children: ["all", "unread", "critical"].map((f) => (_jsx(Button, { variant: "ghost", size: "sm", onClick: () => setFilter(f), className: cn("text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-full transition-colors h-auto min-h-0", filter === f
                                                ? "bg-black text-white hover:bg-black/90 hover:text-white"
                                                : "bg-gray-100 text-gray-500 hover:bg-gray-200"), children: f }, f))) })] }), _jsxs("div", { className: "flex gap-1", children: [_jsx(Button, { variant: "ghost", size: "icon", onClick: handleMarkAllRead, title: "Mark all as read", children: _jsx(Icon, { name: "CheckCheck", size: 16, className: "text-gray-500" }) }), _jsx(Button, { variant: "ghost", size: "icon", onClick: onClose, children: _jsx(Icon, { name: "X", size: 16, className: "text-gray-500" }) })] })] }), _jsx("div", { className: "flex-1 overflow-y-auto min-h-0 bg-white", children: loading ? (_jsxs("div", { className: "p-8 text-center text-gray-400 flex flex-col items-center", children: [_jsx(Icon, { name: "Loader", size: 24, className: "animate-spin mb-2" }), _jsx("p", { className: "text-xs", children: "Loading updates..." })] })) : notifications.length === 0 ? (_jsxs("div", { className: "p-8 text-center text-gray-400 flex flex-col items-center justify-center h-full", children: [_jsx("div", { className: "w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center mb-3", children: _jsx(Icon, { name: "BellOff", size: 20, className: "opacity-50" }) }), _jsx("p", { className: "text-sm font-medium text-gray-900", children: "All caught up" }), _jsx("p", { className: "text-xs text-gray-500 mt-1", children: "Check back later for updates." })] })) : (notifications.map((notification) => (_jsx(NotificationItem, { notification: notification, onRead: handleMarkRead }, notification.id)))) }), _jsx("div", { className: "p-3 bg-gray-50 border-t border-gray-100 text-center", children: _jsx(Link, { href: "/dashboard/settings/notifications", className: "text-xs font-bold text-gray-500 hover:text-gray-900 transition-colors", children: "Manage Preferences" }) })] })] }));
};
