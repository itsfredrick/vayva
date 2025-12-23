'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Icon, cn } from '@vayva/ui';
import { useAuth } from '@/context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';

const NAV_ITEMS = [
    { name: 'Overview', icon: 'LayoutDashboard', href: '/admin' },
    { name: 'Products', icon: 'Package', href: '/admin/products' },
    { name: 'Orders', icon: 'ShoppingBag', href: '/admin/orders' },
    { name: 'Customers', icon: 'Users', href: '/admin/customers' },
    { name: 'Wallet', icon: 'Wallet', href: '/admin/wallet' },
    { name: 'Inbox', icon: 'MessageSquare', href: '/dashboard/inbox' },
    { name: 'Returns', icon: 'RotateCcw', href: '/admin/returns' },
    { name: 'Disputes', icon: 'Scale', href: '/admin/disputes' },
    { name: 'Risk', icon: 'Shield', href: '/admin/risk' },
    { name: 'Team', icon: 'UserCog', href: '/dashboard/settings/team' },
    { name: 'Reports', icon: 'BarChart', href: '/dashboard/reports' },
    { name: 'Support', icon: 'LifeBuoy', href: '/dashboard/support' }, // Added
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
    const store = merchant as any;
    const [showUserMenu, setShowUserMenu] = useState(false);
    const [isSidebarExpanded, setIsSidebarExpanded] = useState(false);

    // Initial logic for "FD" avatar
    const initials = user ? `${user.firstName[0]}${user.lastName[0]}` : 'FD';

    // Store URL logic
    const storeUrl = store?.status === 'published'
        ? `https://${store.slug}.vayva.shop`
        : `http://localhost:3001?store=${store?.slug}`;

    const handleLogout = () => {
        logout();
    };

    return (
        <div className="flex h-screen w-full bg-[#FBFCFC] overflow-hidden text-[#0B0B0B]">
            {/* A) COLLAPSIBLE SIDEBAR */}
            <motion.aside
                className="h-full z-50 flex flex-col bg-[#0D1D1E] text-white relative shadow-2xl"
                initial={{ width: 72 }}
                animate={{ width: isSidebarExpanded ? 260 : 72 }}
                transition={{ type: "spring", stiffness: 400, damping: 30 }}
                onMouseEnter={() => setIsSidebarExpanded(true)}
                onMouseLeave={() => setIsSidebarExpanded(false)}
            >
                {/* Logo Area */}
                <div className="h-[72px] flex items-center px-6 border-b border-white/10 shrink-0 overflow-hidden whitespace-nowrap">
                    <Image
                        src="/vayva-logo.png"
                        alt="Vayva"
                        width={24}
                        height={24}
                        className="shrink-0 mr-4 object-contain"
                    />
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: isSidebarExpanded ? 1 : 0 }}
                        transition={{ duration: 0.2 }}
                    >
                        <h1 className="font-bold text-base tracking-tight text-white leading-none">Vayva</h1>
                    </motion.div>
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
                                    "flex items-center gap-3 px-3.5 py-3 rounded-lg transition-all text-sm font-medium relative group whitespace-nowrap overflow-hidden",
                                    isActive && !isLocked
                                        ? "bg-white text-[#0D1D1E] shadow-sm"
                                        : isLocked
                                            ? "text-white/30 cursor-not-allowed"
                                            : "text-white/70 hover:text-white hover:bg-white/5"
                                )}
                            >
                                {/* @ts-ignore */}
                                <Icon name={item.icon} size={20} className="shrink-0" />
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
                <div className="p-3 mt-auto">
                    <Link href="/admin/control-center">
                        <div className={cn(
                            "rounded-xl bg-white/5 border border-white/5 p-3 flex items-center gap-3 hover:bg-white/10 transition-colors cursor-pointer group overflow-hidden whitespace-nowrap",
                            !isSidebarExpanded && "justify-center px-0"
                        )}>
                            <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center text-white shrink-0 group-hover:bg-white group-hover:text-[#0D1D1E] transition-colors">
                                <Icon name="LayoutTemplate" size={16} />
                            </div>
                            <motion.div
                                initial={{ opacity: 0, width: 0 }}
                                animate={{ opacity: isSidebarExpanded ? 1 : 0, width: isSidebarExpanded ? 'auto' : 0 }}
                                className="overflow-hidden"
                            >
                                <p className="text-xs font-bold text-white">Control Center</p>
                                <p className="text-[10px] text-white/50">Builder, Themes & Pages</p>
                            </motion.div>
                        </div>
                    </Link>
                </div>

                {/* User Dropdown Trigger (Collapsed Logic) */}
                <div className="p-4 border-t border-white/10 flex items-center gap-3 overflow-hidden cursor-pointer hover:bg-white/5 transition-colors"
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    data-testid="dashboard-user-menu-trigger"
                >
                    <div className="w-8 h-8 rounded-full bg-white text-[#0D1D1E] flex items-center justify-center text-xs font-bold shrink-0">
                        {initials}
                    </div>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: isSidebarExpanded ? 1 : 0 }}
                        className="overflow-hidden"
                    >
                        <p className="text-sm font-medium text-white truncate w-32">{user?.firstName}</p>
                    </motion.div>
                </div>
            </motion.aside>

            {/* B) MAIN CONTENT */}
            <main className="flex-1 h-full flex flex-col relative overflow-hidden bg-[#F8F9FA]">
                {/* Top Command Bar */}
                <header className="h-[72px] w-full bg-white border-b border-gray-100 flex items-center justify-between px-8 shrink-0 relative z-40">
                    <div className="flex items-center gap-4 text-sm text-[#525252]">
                        <span className="font-medium text-[#0B0B0B]">Home</span>
                        {breadcrumb && (
                            <>
                                <span className="text-gray-300">/</span>
                                <span className="font-medium">{breadcrumb}</span>
                            </>
                        )}
                        {title && title !== 'Overview' && (
                            <>
                                <span className="text-gray-300">/</span>
                                <span className="font-medium text-[#0B0B0B]">{title}</span>
                            </>
                        )}
                    </div>

                    {/* Search - Center */}
                    <div className="absolute left-1/2 top-1/2 -translate-x-1/2 w-[320px] hidden md:block">
                        <div className="relative">
                            <Icon name="Search" className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                            <input
                                type="text"
                                placeholder="Search for anything..."
                                className="w-full h-10 pl-10 pr-4 bg-gray-50 border-none rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0B0B0B]/5 hover:bg-gray-100 transition-colors"
                            />
                        </div>
                    </div>

                    {/* Right Actions */}
                    <div className="flex items-center gap-4">
                        {/* Visit Store Button */}
                        <a
                            href={storeUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hidden sm:flex items-center gap-2 px-4 py-2 bg-black text-white rounded-full text-xs font-bold hover:bg-gray-800 transition-colors"
                            data-testid="dashboard-visit-store"
                        >
                            Visit Store <Icon name="ExternalLink" size={12} />
                        </a>

                        <button className="w-10 h-10 flex items-center justify-center text-gray-500 hover:text-[#0B0B0B] hover:bg-gray-50 rounded-full transition-colors relative">
                            <Icon name="Bell" size={20} />
                            <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
                        </button>

                        {/* Avatar / User Menu */}
                        <div className="relative">
                            <button
                                onClick={() => setShowUserMenu(!showUserMenu)}
                                className="w-9 h-9 rounded-full bg-[#0D1D1E] text-white flex items-center justify-center text-xs font-bold hover:ring-4 hover:ring-gray-100 transition-all"
                                data-testid="dashboard-avatar-menu"
                            >
                                {initials}
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
                                        <div className="px-4 py-3 border-b border-gray-50">
                                            <p className="text-sm font-bold text-[#0B0B0B]">{user?.firstName} {user?.lastName}</p>
                                            <p className="text-xs text-gray-500 truncate">{user?.email}</p>
                                        </div>
                                        <div className="p-1">
                                            <Link href="/admin/account/overview">
                                                <button className="w-full flex items-center gap-2 px-3 py-2 text-sm text-[#525252] hover:text-[#0B0B0B] hover:bg-gray-50 rounded-lg transition-colors text-left">
                                                    <Icon name="User" size={16} />
                                                    Account Overview
                                                </button>
                                            </Link>
                                            <button
                                                onClick={handleLogout}
                                                className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-500 hover:bg-red-50 rounded-lg transition-colors text-left"
                                                data-testid="dashboard-signout"
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
