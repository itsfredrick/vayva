"use client";
import { jsxs as _jsxs, jsx as _jsx } from "react/jsx-runtime";
import React, { useState } from "react";
import { Button, Drawer, Icon, cn } from "@vayva/ui";
const TABS = ["All", "Orders", "WhatsApp AI", "Payments", "System"];
export const NotificationsDrawer = ({ isOpen, onClose, }) => {
    const [activeTab, setActiveTab] = useState("All");
    const [notifications, setNotifications] = useState([]);
    React.useEffect(() => {
        if (isOpen) {
            fetch("/api/notifications")
                .then((res) => res.json())
                .then((data) => {
                if (Array.isArray(data))
                    setNotifications(data);
            })
                .catch(console.error);
        }
    }, [isOpen]);
    const filtered = activeTab === "All"
        ? notifications
        : notifications.filter((n) => {
            if (activeTab === "Orders")
                return n.type === "order";
            if (activeTab === "WhatsApp AI")
                return n.type === "ai";
            if (activeTab === "Payments")
                return n.type === "payment";
            return n.type === "system";
        });
    const markAllRead = () => {
        setNotifications(notifications.map((n) => ({ ...n, unread: false })));
    };
    const getIcon = (type) => {
        switch (type) {
            case "order":
                return "ShoppingBag";
            case "ai":
                return "Bot";
            case "payment":
                return "CreditCard";
            default:
                return "Info";
        }
    };
    const getColor = (type) => {
        switch (type) {
            case "order":
                return "text-primary bg-primary/20";
            case "ai":
                return "text-purple-400 bg-purple-500/20";
            case "payment":
                return "text-blue-400 bg-blue-500/20";
            default:
                return "text-white bg-white/10";
        }
    };
    return (_jsx(Drawer, { isOpen: isOpen, onClose: onClose, title: "Notifications", children: _jsxs("div", { className: "flex flex-col h-full", children: [_jsxs("div", { className: "px-6 py-4 flex flex-col gap-4 border-b border-white/5", children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("span", { className: "text-sm text-text-secondary", children: [notifications.filter((n) => n.unread).length, " unread"] }), _jsx(Button, { onClick: markAllRead, variant: "link", size: "sm", className: "text-xs font-bold text-primary hover:underline h-auto p-0", children: "Mark all as read" })] }), _jsx("div", { className: "flex gap-2 overflow-x-auto pb-2 no-scrollbar", children: TABS.map((tab) => (_jsx(Button, { onClick: () => setActiveTab(tab), variant: "ghost", size: "sm", className: cn("px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors h-auto", activeTab === tab
                                    ? "bg-white text-background-dark"
                                    : "bg-white/5 text-text-secondary hover:bg-white/10"), children: tab }, tab))) })] }), _jsx("div", { className: "flex-1 overflow-y-auto", children: filtered.length === 0 ? (_jsxs("div", { className: "flex flex-col items-center justify-center h-48 text-text-secondary", children: [_jsx(Icon, { name: "BellOff", className: "mb-2 opacity-50", size: 32 }), _jsx("p", { className: "text-sm", children: "You're all caught up." })] })) : (_jsx("div", { className: "divide-y divide-white/5", children: filtered.map((item) => (_jsxs("div", { className: "p-4 flex gap-4 hover:bg-white/5 transition-colors cursor-pointer group", children: [_jsx("div", { className: cn("w-10 h-10 rounded-full flex items-center justify-center shrink-0", getColor(item.type)), children: _jsx(Icon, { name: getIcon(item.type), size: 20 }) }), _jsxs("div", { className: "flex-1 min-w-0", children: [_jsx("p", { className: cn("text-sm mb-1 line-clamp-2", item.unread
                                                ? "text-white font-medium"
                                                : "text-text-secondary"), children: item.title }), _jsxs("span", { className: "text-xs text-white/30", children: [item.time, " ago"] })] }), item.unread && (_jsx("div", { className: "w-2 h-2 rounded-full bg-primary mt-2 shrink-0" }))] }, item.id))) })) }), _jsx("div", { className: "p-4 border-t border-white/5 text-center", children: _jsx(Button, { variant: "ghost", className: "text-xs text-text-secondary w-full", children: "Notification Settings" }) })] }) }));
};
