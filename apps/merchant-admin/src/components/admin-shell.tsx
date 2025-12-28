

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
import { Logo } from './Logo';
import { SupportChat } from './support/support-chat';
import { FEATURES } from '@/lib/env-validation';

const ALL_NAV_ITEMS = [
    { name: 'Overview', icon: 'LayoutDashboard', href: '/admin/dashboard', alwaysShow: true },
    { name: 'Wallet', icon: 'Wallet', href: '/admin/wallet', alwaysShow: true },
    ...(FEATURES.WHATSAPP_ENABLED ? [
        { name: 'Inbox', icon: 'Inbox', href: '/admin/inbox', alwaysShow: true },
        { name: 'WhatsApp Agent', icon: 'MessageSquare', href: '/admin/wa-agent', alwaysShow: true },
    ] : []),

    // Commerce / Retail
    { name: 'Products', icon: 'Package', href: '/admin/products', module: 'commerceRetail' },
    { name: 'Orders', icon: 'ShoppingBag', href: '/admin/orders', module: 'commerceRetail' },

    // Bookings
    { name: 'Bookings', icon: 'CalendarCheck', href: '/admin/bookings', module: 'bookings' },
    { name: 'Calendar', icon: 'CalendarDays', href: '/admin/calendar', module: 'bookings' },

    // Food
    { name: 'Menu', icon: 'Utensils', href: '/admin/menu', module: 'foodOrdering' },
    { name: 'Kitchen', icon: 'ChefHat', href: '/admin/kitchen', module: 'foodOrdering' },

    // Digital
    { name: 'Downloads', icon: 'Download', href: '/admin/downloads', module: 'digitalDownloads' },

    // Events
    { name: 'Events', icon: 'Ticket', href: '/admin/events', module: 'ticketing' },

    // Courses
    { name: 'Courses', icon: 'GraduationCap', href: '/admin/courses', module: 'courses' },

    // B2B & Invoicing
    { name: 'Invoices', icon: 'FileText', href: '/admin/invoices', module: 'rfqInvoicing' },

    // Marketplace
    { name: 'Vendors', icon: 'Store', href: '/admin/vendors', module: 'marketplaceMultiVendor' },

    // Donations
    { name: 'Campaigns', icon: 'Heart', href: '/admin/campaigns', module: 'donations' },

    // Real Estate
    { name: 'Properties', icon: 'Home', href: '/admin/properties', module: 'realEstateLeads' },

    { name: 'Customers', icon: 'Users', href: '/admin/customers', alwaysShow: true },
    { name: 'Analytics', icon: 'PieChart', href: '/admin/analytics', alwaysShow: true },
    { name: 'Reports', icon: 'BarChart', href: '/admin/reports', alwaysShow: true },
    { name: 'Help & Support', icon: 'HelpCircle', href: '/admin/help', alwaysShow: true },
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
    const [enabledModules, setEnabledModules] = useState<Record<string, boolean>>({});

    // Mobile State
    const [isMobile, setIsMobile] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    // Notification UI State
    const [isNotifOpen, setIsNotifOpen] = useState(false);

    // Initial logic for "FD" avatar
    const initials = user ? `${user.firstName[0]}${user.lastName[0]}` : 'FD';

    // Fallback Merchant Details
    const merchantName = (merchant as any)?.firstName || user?.firstName || 'Merchant';
    const storeName = (merchant as any)?.businessName || 'My Store';

    // Store URL logic
    const [storeLink, setStoreLink] = useState<string>('');
    const [storeStatus, setStoreStatus] = useState<'live' | 'draft'>('draft');

    useEffect(() => {
        const handleResize = () => {
            const mobile = window.innerWidth < 768;
            setIsMobile(mobile);
            if (!mobile) setMobileMenuOpen(false); // Reset on resize to desktop
        };
        handleResize(); // Initial check
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    useEffect(() => {
        // Fetch Store Info & Modules
        fetch('/api/auth/merchant/me')
            .then(res => res.json())
            .then(data => {
                if (data.store?.settings?.modules) {
                    setEnabledModules(data.store.settings.modules);
                } else {
                    setEnabledModules({ commerceRetail: true });
                }
            })
            .catch(err => console.error("Failed to load store settings", err));

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

    // Close mobile menu on route change
    useEffect(() => {
        setMobileMenuOpen(false);
    }, [pathname]);


    const handleVisitStore = (e: React.MouseEvent) => {
        if (!storeLink || storeLink === '#') {
            e.preventDefault();
        }
    };

    const handleLogout = () => {
        logout();
    };

    // Filter Items
    const visibleNavItems = ALL_NAV_ITEMS.filter(item => {
        if (item.alwaysShow) return true;
        if (item.module && enabledModules[item.module]) return true;
        return false;
    });

    // Sidebar Animation Variants
    const sidebarVariants = {
        desktopCollapsed: { width: 80, x: 0 },
        desktopExpanded: { width: 260, x: 0 },
        mobileHidden: { width: 280, x: '-100%' },
        mobileVisible: { width: 280, x: 0 }
    };

    const currentVariant = isMobile
        ? (mobileMenuOpen ? 'mobileVisible' : 'mobileHidden')
        : (isSidebarExpanded ? 'desktopExpanded' : 'desktopCollapsed');


    // Bottom Navigation Logic
    const bottomNavItems = [
        { name: 'Home', icon: 'LayoutDashboard', href: '/admin/dashboard' },
        { name: 'Orders', icon: 'ShoppingBag', href: '/admin/orders' },
        { name: 'Products', icon: 'Package', href: '/admin/products' },
    ];

    return (
        <div className="flex h-screen w-full bg-[#FBFCFC] overflow-hidden text-[#0B0B0B]">

            {/* MOBILE OVERLAY */}
            <AnimatePresence>
                {isMobile && mobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 0.5 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setMobileMenuOpen(false)}
                        className="fixed inset-0 bg-black z-40 md:hidden"
                    />
                )}
            </AnimatePresence>

            {/* SIDEBAR (Drawer) */}
            <motion.aside
                className={cn(
                    "fixed md:relative h-full z-50 flex flex-col bg-white border-r border-gray-100 text-[#0B0B0B]",
                    isMobile ? "top-0 left-0 shadow-2xl w-[280px]" : ""
                )}
                variants={sidebarVariants}
                initial={false}
                animate={currentVariant}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                onMouseEnter={() => !isMobile && setIsSidebarExpanded(true)}
                onMouseLeave={() => !isMobile && setIsSidebarExpanded(false)}
            >
                {/* Mobile Drawer Header */}
                <div className="h-[72px] md:h-[100px] flex items-center justify-between md:justify-center px-4 md:px-0 shrink-0 relative">
                    <Logo size={isMobile ? "sm" : "lg"} showText={isMobile || isSidebarExpanded} />
                    {isMobile && (
                        <button onClick={() => setMobileMenuOpen(false)} className="p-2 rounded-full hover:bg-gray-100 text-gray-500">
                            <Icon name="X" size={24} />
                        </button>
                    )}
                </div>

                {/* Nav Items */}
                <nav className="flex-1 flex flex-col gap-1 py-4 px-3 overflow-hidden custom-scrollbar overflow-y-auto">
                    {visibleNavItems.map((item) => {
                        const isActive = pathname === item.href || (item.href !== '/admin' && pathname.startsWith(item.href));
                        const isLocked = mode === 'onboarding';

                        return (
                            <Link
                                key={item.name}
                                href={isLocked ? '#' : item.href}
                                onClick={() => isMobile && setMobileMenuOpen(false)} // Close drawer on click
                                className={cn(
                                    "flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-sm font-medium relative group whitespace-nowrap overflow-hidden shrink-0",
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
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: (isMobile || isSidebarExpanded) ? 1 : 0 }}
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
                <div className="p-4 mt-auto border-t border-gray-100 pb-safe">
                    <Link href="/admin/control-center">
                        <div className={cn(
                            "rounded-2xl bg-gray-50 border border-gray-100 p-3 flex items-center gap-3 hover:bg-gray-100 transition-all cursor-pointer group overflow-hidden whitespace-nowrap",
                            (!isSidebarExpanded && !isMobile) && "justify-center px-0 border-none bg-transparent"
                        )}>
                            <div className="w-9 h-9 rounded-xl bg-white border border-gray-100 flex items-center justify-center text-gray-900 shrink-0 shadow-sm group-hover:scale-105 transition-transform">
                                <Icon name="LayoutTemplate" size={16} />
                            </div>
                            <motion.div
                                initial={{ opacity: 0, width: 0 }}
                                animate={{
                                    opacity: (isMobile || isSidebarExpanded) ? 1 : 0,
                                    width: (isMobile || isSidebarExpanded) ? 'auto' : 0
                                }}
                                className="overflow-hidden"
                            >
                                <p className="text-xs font-bold text-gray-900">Control Center</p>
                            </motion.div>
                        </div>
                    </Link>
                </div>
            </motion.aside>


            {/* MAIN CONTENT */}
            <main className="flex-1 h-full flex flex-col relative overflow-hidden bg-[#F8F9FA]">

                <GlobalBanner />

                {/* Top Command Bar */}
                <header className="h-[60px] md:h-[72px] w-full bg-white/80 backdrop-blur-md border-b border-gray-100 flex items-center justify-between px-4 md:px-8 shrink-0 relative z-30 sticky top-0">
                    <div className="flex items-center gap-4 md:gap-6">
                        {/* Mobile: Logo Only (Burger is now bottom nav) */}
                        <div className="flex items-center gap-6 md:hidden">
                            <Logo size="sm" showText={true} />
                        </div>

                        <div className="hidden md:flex items-center gap-6">
                            {/* Breadcrumbs could go here */}
                        </div>
                    </div>

                    {/* Right Actions */}
                    <div className="flex items-center gap-2 md:gap-4">
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

                        <Button variant="ghost" size="icon" className="text-gray-400 hover:text-gray-900 hidden sm:flex">
                            <Icon name="Search" size={20} />
                        </Button>

                        <NotificationBell
                            isOpen={isNotifOpen}
                            onClick={() => setIsNotifOpen(!isNotifOpen)}
                        />

                        <NotificationCenter
                            isOpen={isNotifOpen}
                            onClose={() => setIsNotifOpen(false)}
                        />

                        <div className="h-6 w-px bg-gray-200 mx-1 hidden sm:block" />

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
                                <Icon name="ChevronDown" size={16} className="text-gray-400 hidden sm:block" />
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

                <div className="flex-1 overflow-y-auto px-4 md:px-8 py-4 md:py-8 custom-scrollbar pb-24 md:pb-8">
                    <div className="max-w-[1400px] mx-auto min-h-full">
                        {children}
                    </div>
                </div>

                {/* BOTTOM NAVIGATION (Mobile Only) */}
                <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 px-6 py-3 pb-safe z-40 flex justify-between items-center shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
                    {bottomNavItems.map((item) => {
                        const isActive = pathname === item.href;
                        return (
                            <Link
                                key={item.name}
                                href={item.href}
                                className="flex flex-col items-center gap-1 min-w-[64px]"
                            >
                                <div className={cn(
                                    "p-1.5 rounded-xl transition-colors",
                                    isActive ? "bg-black text-white" : "text-gray-400"
                                )}>
                                    {/* @ts-ignore */}
                                    <Icon name={item.icon} size={20} />
                                </div>
                                <span className={cn(
                                    "text-[10px] font-medium leading-none",
                                    isActive ? "text-black font-bold" : "text-gray-400"
                                )}>
                                    {item.name}
                                </span>
                            </Link>
                        );
                    })}
                    {/* Menu Trigger */}
                    <button
                        onClick={() => setMobileMenuOpen(true)}
                        className="flex flex-col items-center gap-1 min-w-[64px]"
                    >
                        <div className={cn(
                            "p-1.5 rounded-xl transition-colors",
                            mobileMenuOpen ? "bg-black text-white" : "text-gray-400"
                        )}>
                            <Icon name="Menu" size={20} />
                        </div>
                        <span className={cn(
                            "text-[10px] font-medium leading-none",
                            mobileMenuOpen ? "text-black font-bold" : "text-gray-400"
                        )}>
                            Menu
                        </span>
                    </button>
                </div>

            </main>

            {/* Simple Background overlay for mobile User Menu */}
            {
                showUserMenu && (
                    <div className="fixed inset-0 z-30" onClick={() => setShowUserMenu(false)} />
                )
            }
            <SupportChat />
        </div >
    );
};
