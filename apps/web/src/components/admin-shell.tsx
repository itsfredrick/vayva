'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { GlassPanel, cn } from './ui/glass-panel';
import { Icon } from './ui/icon';
import { NotificationsDrawer } from './notifications-drawer';

const NAV_ITEMS = [
    { name: 'Home', icon: 'dashboard', href: '/admin' },
    { name: 'Orders', icon: 'shopping_bag', href: '/admin/orders' },
    { name: 'Products', icon: 'inventory_2', href: '/admin/products' },
    { name: 'Customers', icon: 'group', href: '/admin/customers' },
    { name: 'Analytics', icon: 'analytics', href: '/admin/analytics' },
    { name: 'Marketing', icon: 'campaign', href: '/admin/marketing' },
    { name: 'Integration', icon: 'integration_instructions', href: '/admin/integration' },
    { name: 'Settings', icon: 'settings', href: '/admin/settings' },
];

interface AdminShellProps {
    children: React.ReactNode;
    title?: string;
    breadcrumb?: string;
    mode?: 'admin' | 'onboarding'; // New prop
}

export const AdminShell = ({ children, title, breadcrumb, mode = 'admin' }: AdminShellProps) => {
    const pathname = usePathname();
    const [showNotifications, setShowNotifications] = useState(false);

    return (
        <div className="flex h-screen w-full bg-background-dark overflow-hidden relative">
            {/* Background Treatment */}
            <div className="absolute inset-0 z-0 bg-[url('https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2564&auto=format&fit=crop')] bg-cover opacity-10 mix-blend-overlay pointer-events-none"></div>

            {/* A) LEFT SIDEBAR */}
            <aside className="w-[288px] h-full p-6 z-10 flex flex-col gap-8">
                <GlassPanel className="h-full flex flex-col p-6">
                    {/* Logo */}
                    <div className="flex items-center gap-2 mb-6">
                        <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                            <Icon name="verified" className="text-background-dark" size={20} />
                        </div>
                        <div>
                            <h1 className="font-bold text-white leading-tight">Vayva</h1>
                            <p className="text-[10px] uppercase tracking-widest text-primary">Seller Dashboard</p>
                        </div>
                    </div>

                    {/* Nav Items */}
                    <nav className="flex-1 flex flex-col gap-1">
                        {NAV_ITEMS.map((item) => {
                            const isActive = pathname === item.href;
                            // If onboarding, lock everything except maybe 'Home' or none? 
                            // Spec says "Nav items that require setup are shown but disabled with a lock icon"
                            // Let's lock all except maybe Settings? Or just lock all for simplicity if mode is onboarding.
                            const isLocked = mode === 'onboarding';

                            return (
                                <Link
                                    key={item.name}
                                    href={isLocked ? '#' : item.href}
                                    className={cn(
                                        "flex items-center gap-3 px-3 py-3 rounded-xl transition-all text-sm font-medium relative overflow-hidden",
                                        isActive && !isLocked
                                            ? "bg-primary/20 text-primary border border-primary/20 shadow-[0_0_15px_rgba(70,236,19,0.1)]"
                                            : isLocked
                                                ? "text-white/30 cursor-not-allowed hover:bg-transparent"
                                                : "text-text-secondary hover:text-white hover:bg-white/5"
                                    )}
                                >
                                    <Icon name={item.icon} size={20} />
                                    <span className="flex-1">{item.name}</span>
                                    {isLocked && <Icon name="lock" size={14} className="opacity-50" />}
                                </Link>
                            )
                        })}
                    </nav>

                    {/* Bottom User Profile */}
                    <div className="mt-auto pt-6 border-t border-white/5 flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center text-sm font-bold text-white">
                            AS
                        </div>
                        <div className="flex-1 overflow-hidden">
                            <p className="text-sm font-bold text-white truncate">Amina&apos;s Store</p>
                            <p className="text-xs text-text-secondary truncate">amina@vayva.ng</p>
                        </div>
                        <Icon name="expand_more" size={16} className="text-text-secondary" />
                    </div>
                </GlassPanel>
            </aside>

            {/* B) MAIN CONTENT */}
            <main className="flex-1 h-full overflow-y-auto px-6 z-10 custom-scrollbar">
                <div className="max-w-[1240px] mx-auto py-6">
                    {/* Top Header */}
                    <header className="h-[72px] w-full flex items-center justify-between mb-8 rounded-2xl bg-[#142210]/50 backdrop-blur-xl border border-white/5 px-6 sticky top-0 z-40">
                        {/* Left: Breadcrumbs */}
                        <div className="flex flex-col">
                            <div className="flex items-center gap-2 text-xs text-text-secondary mb-1">
                                <span>Home</span>
                                {breadcrumb && (
                                    <>
                                        <span>/</span>
                                        <span className="text-white">{breadcrumb}</span>
                                    </>
                                )}
                            </div>
                            <h2 className="text-lg font-bold text-white">{title || 'Overview'}</h2>
                        </div>

                        {/* Right: Actions */}
                        <div className="flex items-center gap-4">
                            <div className="h-9 px-4 rounded-full bg-white/5 border border-white/5 flex items-center gap-2 text-sm text-white cursor-pointer hover:bg-white/10 transition-colors">
                                <div className="w-4 h-4 rounded-full bg-indigo-500" />
                                <span>Amina Beauty</span>
                                <Icon name="expand_more" size={16} className="text-text-secondary" />
                            </div>

                            <button
                                onClick={() => setShowNotifications(true)}
                                className="w-9 h-9 rounded-full bg-white/5 flex items-center justify-center text-white hover:bg-white/10 transition-colors relative"
                            >
                                <Icon name="notifications" size={20} />
                                <span className="absolute top-2 right-2.5 w-2 h-2 rounded-full bg-primary border border-background-dark" />
                            </button>
                        </div>
                    </header>

                    {children}
                </div>
            </main>

            <NotificationsDrawer isOpen={showNotifications} onClose={() => setShowNotifications(false)} />
        </div>
    );
};
