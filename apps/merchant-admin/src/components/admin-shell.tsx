
'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { Icon, cn, Button, Avatar } from '@vayva/ui';
import { useAuth } from '@/context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { NotificationBell } from './notifications/NotificationBell';
import { NotificationCenter } from './notifications/NotificationCenter';
import { GlobalBanner } from './notifications/GlobalBanner';

const NAV_ITEMS = [
    { name: 'Overview', icon: 'LayoutDashboard', href: '/admin/dashboard' },
    { name: 'Wallet', icon: 'Wallet', href: '/admin/wallet' },
    { name: 'WhatsApp Agent', icon: 'MessageSquare', href: '/admin/wa-agent' },
    { name: 'Products', icon: 'Package', href: '/admin/products' },
    { name: 'Orders', icon: 'ShoppingBag', href: '/admin/orders' },
    { name: 'Customers', icon: 'Users', href: '/admin/customers' },
    { name: 'Control Center', icon: 'Settings', href: '/admin/control-center' },
];

interface AdminShellProps {
    children: React.ReactNode;
    title?: string;
    breadcrumb?: string;
    mode?: 'admin' | 'onboarding';
}

export const AdminShell = ({ children, title, breadcrumb, mode = 'admin' }: AdminShellProps) => {
    const pathname = usePathname();
    const router = useRouter();
    const { user, merchant, logout } = useAuth();
    const [showUserMenu, setShowUserMenu] = useState(false);
    const [isSidebarExpanded, setIsSidebarExpanded] = useState(false);

    // Notification UI State
    const [isNotifOpen, setIsNotifOpen] = useState(false);

    // Initial logic for "FD" avatar
    const initials = user ? `${user.firstName[0]}${user.lastName[0]}` : 'FD';

    // Fallback Merchant Details (if context not ready)
    const merchantName = (merchant as any)?.firstName || user?.firstName || 'Merchant';
    const storeName = (merchant as any)?.businessName || 'My Store';

    // Store URL logic
    const [storeLink, setStoreLink] = useState<string>('');
    const [storeStatus, setStoreStatus] = useState<'live' | 'draft'>('draft');

    useEffect(() => {
        // Fetch real store status and URL from API
        fetch('/api/storefront/url')
            .then(res => res.json())
            .then(data => setStoreLink(data.url))
            .catch(() => setStoreLink('#'));

        fetch('/api/storefront/status')
            .then(res => res.json())
            .then(data => setStoreStatus(data.status))
            .catch(() => { });
    }, []);

    const handleVisitStore = (e: React.MouseEvent) => {
        if (!storeLink || storeLink === '#') {
            e.preventDefault();
        }
    };

    const handleLogout = () => {
        logout();
    };

    return (
        <div className="flex h-screen w-full bg-[#FBFCFC] overflow-hidden text-[#0B0B0B]">
            {/* A) COLLAPSIBLE SIDEBAR */}
            <motion.aside
                className="h-full z-50 flex flex-col bg-white border-r border-gray-100 text-[#0B0B0B] relative"
                initial={{ width: 80 }}
                animate={{ width: isSidebarExpanded ? 260 : 80 }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                onMouseEnter={() => setIsSidebarExpanded(true)}
                onMouseLeave={() => setIsSidebarExpanded(false)}
            >
                {/* Logo Area */}
                <div className="h-[100px] flex items-center justify-center shrink-0 py-4">
                    <div className="relative w-20 h-20">
                        <Image
                            src="/brand-logo.png"
                            alt="Vayva"
                            fill
                            className="object-contain"
                            priority
                        />
                    </div>
                </div>

                {/* Nav Items */}
                <nav className="flex-1 flex flex-col gap-1 py-4 px-3 overflow-hidden">
                    {NAV_ITEMS.map((item) => {
                        const isActive = pathname === item.href || (item.href !== '/admin' && pathname.startsWith(item.href));
                        const isLocked = mode === 'onboarding';

                        return (
                            <Link
                                key={item.name}
                                href={isLocked ? '#' : item.href}
                                className={cn(
                                    "flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-sm font-medium relative group whitespace-nowrap overflow-hidden",
                                    isActive && !isLocked
                                        ? "bg-gray-100 text-black font-bold shadow-sm"
                                        : isLocked
                                            ? "text-gray-300 cursor-not-allowed"
                                            : "text-gray-500 hover:text-black hover:bg-gray-50"
                                )}
                            >
                                {/* @ts-ignore */}
                                <Icon name={item.icon} size={20} className={cn("shrink-0", isActive ? "text-black" : "text-gray-400")} />
                                <motion.span
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: isSidebarExpanded ? 1 : 0, x: isSidebarExpanded ? 0 : -10 }}
                                    transition={{ duration: 0.2 }}
                                    className="block"
                                >
                                    {item.name}
                                </motion.span>
                                {isLocked && <Icon name="Lock" size={14} className="ml-auto opacity-50 shrink-0" />}
                            </Link>
                        )
                    })}
                </nav>

                {/* Bottom Card - Control Center */}
                <div className="p-4 mt-auto border-t border-gray-100">
                    <Link href="/admin/control-center">
                        <div className={cn(
                            "rounded-2xl bg-gray-50 border border-gray-100 p-3 flex items-center gap-3 hover:bg-gray-100 transition-all cursor-pointer group overflow-hidden whitespace-nowrap",
                            !isSidebarExpanded && "justify-center px-0 border-none bg-transparent"
                        )}>
                            <div className="w-9 h-9 rounded-xl bg-white border border-gray-100 flex items-center justify-center text-gray-900 shrink-0 shadow-sm group-hover:scale-105 transition-transform">
                                <Icon name="LayoutTemplate" size={16} />
                            </div>
                            <motion.div
                                initial={{ opacity: 0, width: 0 }}
                                animate={{ opacity: isSidebarExpanded ? 1 : 0, width: isSidebarExpanded ? 'auto' : 0 }}
                                className="overflow-hidden"
                            >
                                <p className="text-xs font-bold text-gray-900">Control Center</p>
                            </motion.div>
                        </div>
                    </Link>
                </div>
            </motion.aside>


            {/* B) MAIN CONTENT */}
            <main className="flex-1 h-full flex flex-col relative overflow-hidden bg-[#F8F9FA]">

                {/* GLOBAL BANNER INJECTION POINT */}
                <GlobalBanner />

                {/* Top Command Bar */}
                <header className="h-[72px] w-full bg-white border-b border-gray-100 flex items-center justify-between px-8 shrink-0 relative z-40">
                    <div className="flex items-center gap-6">
                        {/* Logo + Divider */}
                        <div className="flex items-center gap-6">
                            <h1 className="text-xl font-heading font-bold text-gray-900">
                                Vayva
                            </h1>
                        </div>
                    </div>

                    {/* Right Actions */}
                    <div className="flex items-center gap-4">
                        {/* Visit Store Button */}
                        <a
                            href={storeLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={handleVisitStore}
                            className={cn(
                                "hidden sm:flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold transition-colors",
                                storeStatus === 'live'
                                    ? "bg-black text-white hover:bg-gray-800"
                                    : "bg-gray-100 text-gray-400 cursor-not-allowed"
                            )}
                            title={storeStatus === 'draft' ? "Store is not live" : "Visit Store"}
                        >
                            Visit Store <Icon name="ExternalLink" size={12} />
                        </a>

                        {/* Search Action */}
                        <Button variant="ghost" size="icon" className="text-gray-400 hover:text-gray-900">
                            <Icon name="Search" size={20} />
                        </Button>

                        {/* NOTIFICATION ENTRY POINT */}
                        <NotificationBell
                            isOpen={isNotifOpen}
                            onClick={() => setIsNotifOpen(!isNotifOpen)}
                        />

                        {/* NOTIFICATION PANEL */}
                        <NotificationCenter
                            isOpen={isNotifOpen}
                            onClose={() => setIsNotifOpen(false)}
                        />

                        <div className="h-6 w-px bg-gray-200 mx-1" />

                        {/* Avatar / User Menu */}
                        <div className="relative">
                            <button
                                onClick={() => setShowUserMenu(!showUserMenu)}
                                className="flex items-center gap-2 p-1 rounded-full hover:bg-gray-50 transition-colors"
                            >
                                <Avatar
                                    fallback={initials}
                                    className="bg-indigo-600"
                                    size="sm"
                                />
                                <Icon name="ChevronDown" size={16} className="text-gray-400" />
                            </button>

                            <AnimatePresence>
                                {showUserMenu && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                        animate={{ opacity: 1, y: 0, scale: 1 }}
                                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                        transition={{ duration: 0.1 }}
                                        className="absolute right-0 top-full mt-2 w-56 bg-white border border-gray-100 rounded-xl shadow-xl overflow-hidden z-50 py-1"
                                    >
                                        <div className="px-4 py-3 border-b border-gray-50 mb-1">
                                            <p className="text-sm font-bold text-gray-900">{merchantName}</p>
                                            <p className="text-xs text-gray-500 truncate">{storeName}</p>
                                        </div>
                                        <div className="p-1">
                                            <Link href="/admin/account/overview">
                                                <button className="w-full flex items-center gap-2 px-3 py-2 text-sm text-[#525252] hover:text-[#0B0B0B] hover:bg-gray-50 rounded-lg transition-colors text-left">
                                                    <Icon name="Settings" size={16} />
                                                    Account Overview
                                                </button>
                                            </Link>
                                            <button
                                                onClick={handleLogout}
                                                className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-500 hover:bg-red-50 rounded-lg transition-colors text-left"
                                            >
                                                <Icon name="LogOut" size={16} />
                                                Sign out
                                            </button>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>
                </header>

                <div className="flex-1 overflow-y-auto px-8 py-8 custom-scrollbar">
                    <div className="max-w-[1400px] mx-auto min-h-full">
                        {children}
                    </div>
                </div>
            </main>

            {/* Simple Background overlay for mobile */}
            {
                showUserMenu && (
                    <div className="fixed inset-0 z-30" onClick={() => setShowUserMenu(false)} />
                )
            }
        </div >
    );
};
