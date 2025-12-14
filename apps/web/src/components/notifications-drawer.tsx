'use client';

import React, { useState } from 'react';
import { Drawer } from '@/components/ui/drawer';
import { Icon } from '@/components/ui/icon';
import { Button } from '@/components/ui/button';
import { cn } from '@/components/ui/glass-panel';

interface NotificationsDrawerProps {
    isOpen: boolean;
    onClose: () => void;
}

const TABS = ['All', 'Orders', 'WhatsApp AI', 'Payments', 'System'];

const MOCK_NOTIFICATIONS = [
    { id: 1, type: 'order', title: 'Order #VV-1024 paid — ₦45,000', time: '5m', unread: true },
    { id: 2, type: 'ai', title: 'WhatsApp AI needs approval: confirm delivery window', time: '2h', unread: true },
    { id: 3, type: 'payment', title: 'Payout sent to GTBank — ₦120,500', time: '1d', unread: false },
    { id: 4, type: 'system', title: 'Welcome to Vayva! Your store is live.', time: '2d', unread: false },
];

export const NotificationsDrawer = ({ isOpen, onClose }: NotificationsDrawerProps) => {
    const [activeTab, setActiveTab] = useState('All');
    const [notifications, setNotifications] = useState(MOCK_NOTIFICATIONS);

    const filtered = activeTab === 'All'
        ? notifications
        : notifications.filter(n => {
            if (activeTab === 'Orders') return n.type === 'order';
            if (activeTab === 'WhatsApp AI') return n.type === 'ai';
            if (activeTab === 'Payments') return n.type === 'payment';
            return n.type === 'system';
        });

    const markAllRead = () => {
        setNotifications(notifications.map(n => ({ ...n, unread: false })));
    };

    const getIcon = (type: string) => {
        switch (type) {
            case 'order': return 'shopping_bag';
            case 'ai': return 'smart_toy';
            case 'payment': return 'payments';
            default: return 'info';
        }
    };

    const getColor = (type: string) => {
        switch (type) {
            case 'order': return 'text-primary bg-primary/20';
            case 'ai': return 'text-purple-400 bg-purple-500/20';
            case 'payment': return 'text-blue-400 bg-blue-500/20';
            default: return 'text-white bg-white/10';
        }
    };

    return (
        <Drawer isOpen={isOpen} onClose={onClose} title="Notifications">
            <div className="flex flex-col h-full">
                {/* Controls */}
                <div className="px-6 py-4 flex flex-col gap-4 border-b border-white/5">
                    <div className="flex items-center justify-between">
                        <span className="text-sm text-text-secondary">{notifications.filter(n => n.unread).length} unread</span>
                        <button onClick={markAllRead} className="text-xs font-bold text-primary hover:underline">Mark all as read</button>
                    </div>

                    {/* Tabs */}
                    <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
                        {TABS.map(tab => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={cn(
                                    "px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors",
                                    activeTab === tab
                                        ? "bg-white text-background-dark"
                                        : "bg-white/5 text-text-secondary hover:bg-white/10"
                                )}
                            >
                                {tab}
                            </button>
                        ))}
                    </div>
                </div>

                {/* List */}
                <div className="flex-1 overflow-y-auto">
                    {filtered.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-48 text-text-secondary">
                            <Icon name="notifications_off" className="mb-2 opacity-50" size={32} />
                            <p className="text-sm">You&apos;re all caught up.</p>
                        </div>
                    ) : (
                        <div className="divide-y divide-white/5">
                            {filtered.map(item => (
                                <div key={item.id} className="p-4 flex gap-4 hover:bg-white/5 transition-colors cursor-pointer group">
                                    <div className={cn("w-10 h-10 rounded-full flex items-center justify-center shrink-0", getColor(item.type))}>
                                        <Icon name={getIcon(item.type)} size={20} />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className={cn("text-sm mb-1 line-clamp-2", item.unread ? "text-white font-medium" : "text-text-secondary")}>
                                            {item.title}
                                        </p>
                                        <span className="text-xs text-white/30">{item.time} ago</span>
                                    </div>
                                    {item.unread && (
                                        <div className="w-2 h-2 rounded-full bg-primary mt-2 shrink-0" />
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <div className="p-4 border-t border-white/5 text-center">
                    <Button variant="ghost" className="text-xs text-text-secondary w-full">Notification Settings</Button>
                </div>
            </div>
        </Drawer>
    );
};
