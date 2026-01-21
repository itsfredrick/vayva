import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Bell } from "lucide-react";
import { Button } from "@vayva/ui";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { formatDistanceToNow } from "date-fns";
export function HeaderBell() {
    const [unreadCount, setUnreadCount] = useState(0);
    const [notifications, setNotifications] = useState([]);
    const [isOpen, setIsOpen] = useState(false);
    const router = useRouter();
    const dropdownRef = useRef(null);
    const fetchNotifications = async () => {
        try {
            const res = await fetch("/api/merchant/notifications?limit=5");
            if (res.ok) {
                const data = await res.json();
                setNotifications(data.items);
                setUnreadCount(data.unread_count);
            }
        }
        catch (e) {
            console.error("Failed to fetch notifications", e);
        }
    };
    useEffect(() => {
        fetchNotifications();
        // Setup polling every 60s
        const interval = setInterval(fetchNotifications, 60000);
        return () => clearInterval(interval);
    }, []);
    // Close on click outside
    useEffect(() => {
        function handleClickOutside(event) {
            if (dropdownRef.current &&
                !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [dropdownRef]);
    const handleMarkAllRead = async () => {
        await fetch("/api/merchant/notifications/mark-read", {
            method: "POST",
            body: JSON.stringify({ mark_all: true }),
        });
        setUnreadCount(0);
        setNotifications(notifications.map((n) => ({ ...n, isRead: true })));
    };
    const handleNotificationClick = async (n) => {
        if (!n.isRead) {
            await fetch("/api/merchant/notifications/mark-read", {
                method: "POST",
                body: JSON.stringify({ ids: [n.id] }),
            });
            setUnreadCount(Math.max(0, unreadCount - 1));
            setNotifications(notifications.map((item) => item.id === n.id ? { ...item, isRead: true } : item));
        }
        setIsOpen(false);
        if (n.actionUrl) {
            router.push(n.actionUrl);
        }
    };
    return (_jsxs("div", { className: "relative", ref: dropdownRef, children: [_jsxs(Button, { onClick: () => setIsOpen(!isOpen), className: "p-2 text-gray-500 hover:text-gray-900 relative rounded-full hover:bg-gray-100 transition-colors", "aria-label": "Notifications", children: [_jsx(Bell, { className: "w-5 h-5" }), unreadCount > 0 && (_jsx("span", { className: "absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full ring-2 ring-white" }))] }), isOpen && (_jsxs("div", { className: "absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-xl ring-1 ring-black ring-opacity-5 z-50 overflow-hidden text-left", children: [_jsxs("div", { className: "px-4 py-3 border-b border-gray-50 flex justify-between items-center bg-gray-50/50 backdrop-blur-sm", children: [_jsx("h3", { className: "text-sm font-medium text-gray-900", children: "Notifications" }), _jsx("div", { className: "flex space-x-2", children: _jsx(Button, { onClick: handleMarkAllRead, className: "text-xs text-indigo-600 hover:text-indigo-800 font-medium", children: "Mark all read" }) })] }), _jsx("div", { className: "max-h-96 overflow-y-auto", children: notifications.length === 0 ? (_jsx("div", { className: "px-4 py-8 text-center text-gray-500 text-sm", children: "No notifications" })) : (_jsx("div", { className: "divide-y divide-gray-50", children: notifications.map((n) => (_jsx("div", { onClick: () => handleNotificationClick(n), className: `px-4 py-3 hover:bg-gray-50 cursor-pointer transition-colors ${!n.isRead ? "bg-indigo-50/30" : ""}`, children: _jsxs("div", { className: "flex items-start", children: [_jsx("div", { className: `mt-1.5 w-2 h-2 rounded-full flex-shrink-0 mr-3 ${n.severity === "critical"
                                                ? "bg-red-500"
                                                : n.severity === "success"
                                                    ? "bg-green-500"
                                                    : n.severity === "warning"
                                                        ? "bg-yellow-500"
                                                        : "bg-blue-500"}` }), _jsxs("div", { children: [_jsx("p", { className: `text-sm ${!n.isRead ? "font-medium text-gray-900" : "text-gray-700"}`, children: n.title }), _jsx("p", { className: "text-xs text-gray-500 mt-0.5 line-clamp-2", children: n.body }), _jsx("p", { className: "text-[10px] text-gray-400 mt-1", children: formatDistanceToNow(new Date(n.createdAt), {
                                                        addSuffix: true,
                                                    }) })] })] }) }, n.id))) })) }), _jsx("div", { className: "px-4 py-2 bg-gray-50 border-t border-gray-100 text-center", children: _jsx(Link, { href: "/dashboard/notifications", onClick: () => setIsOpen(false), className: "text-xs font-medium text-gray-600 hover:text-gray-900", children: "View all notifications" }) })] }))] }));
}
