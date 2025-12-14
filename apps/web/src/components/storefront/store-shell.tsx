'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Icon } from '@/components/ui/icon';
import { Button } from '@/components/ui/button';

interface StoreShellProps {
    children: React.ReactNode;
    storeName?: string;
    slug?: string;
}

export function StoreShell({ children, storeName = 'Vayva Store', slug = 'demo-store' }: StoreShellProps) {
    const pathname = usePathname();
    const isCartOpen = false; // Mock state

    return (
        <div className="min-h-screen bg-[#142210] text-white font-sans selection:bg-primary/30">

            {/* Sticky Header */}
            <header className="sticky top-0 z-50 border-b border-white/5 bg-[#142210]/80 backdrop-blur-md">
                <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between gap-4">

                    {/* Left: Logo & Name */}
                    <Link href={`/store/${slug}`} className="flex items-center gap-2 shrink-0">
                        <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-black font-bold">V</div>
                        <span className="font-bold text-lg tracking-tight hidden md:block">{storeName}</span>
                    </Link>

                    {/* Center: Search (Desktop) */}
                    <div className="hidden md:flex flex-1 max-w-md relative">
                        <Icon name="search" className="absolute left-3 top-1/2 -translate-y-1/2 text-white/50" size={18} />
                        <input
                            className="w-full h-10 bg-white/5 border border-white/10 rounded-full pl-10 pr-4 text-sm text-white focus:outline-none focus:border-primary/50 transition-colors placeholder:text-white/30"
                            placeholder="Search products..."
                        />
                    </div>

                    {/* Right: Actions */}
                    <div className="flex items-center gap-1 md:gap-2">
                        <Button variant="ghost" size="icon" className="md:hidden text-white"><Icon name="search" /></Button>
                        <Link href={`/store/${slug}/track`}>
                            <Button variant="ghost" size="sm" className="hidden md:flex text-white/70 hover:text-white gap-2">
                                <Icon name="local_shipping" size={18} /> <span className="text-xs">Track Order</span>
                            </Button>
                        </Link>
                        <Link href={`/store/${slug}/cart`}>
                            <Button variant="ghost" size="icon" className="text-white relative">
                                <Icon name="shopping_bag" />
                                <span className="absolute top-2 right-2 w-2 h-2 bg-primary rounded-full" />
                            </Button>
                        </Link>
                    </div>
                </div>

                {/* Mobile Search Bar (if triggered) - Optional for V1 */}
            </header>

            {/* Main Content */}
            <main className="min-h-[calc(100vh-300px)]">
                {children}
            </main>

            {/* Footer */}
            <footer className="border-t border-white/5 bg-[#0b141a] pt-16 pb-8">
                <div className="max-w-7xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
                    <div>
                        <h4 className="font-bold text-white mb-4">Shop</h4>
                        <ul className="space-y-2 text-sm text-text-secondary">
                            <li><Link href={`/store/${slug}/collections/new`} className="hover:text-white">New Arrivals</Link></li>
                            <li><Link href={`/store/${slug}/collections/best-sellers`} className="hover:text-white">Best Sellers</Link></li>
                            <li><Link href={`/store/${slug}/collections/all`} className="hover:text-white">All Products</Link></li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="font-bold text-white mb-4">Support</h4>
                        <ul className="space-y-2 text-sm text-text-secondary">
                            <li><Link href={`/store/${slug}/track`} className="hover:text-white">Track Order</Link></li>
                            <li><Link href={`/store/${slug}/policies/shipping`} className="hover:text-white">Shipping Info</Link></li>
                            <li><Link href={`/store/${slug}/policies/returns`} className="hover:text-white">Returns & Exchanges</Link></li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="font-bold text-white mb-4">Legal</h4>
                        <ul className="space-y-2 text-sm text-text-secondary">
                            <li><Link href={`/store/${slug}/policies/privacy`} className="hover:text-white">Privacy Policy</Link></li>
                            <li><Link href={`/store/${slug}/policies/terms`} className="hover:text-white">Terms of Service</Link></li>
                        </ul>
                    </div>
                    <div className="col-span-2 md:col-span-1">
                        <div className="flex items-center gap-2 mb-4">
                            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-black font-bold">V</div>
                            <span className="font-bold text-lg">{storeName}</span>
                        </div>
                        <p className="text-xs text-text-secondary mb-4">
                            Premium shopping experience powered by Vayva.
                            <br />Lagos, Nigeria.
                        </p>
                        <div className="flex gap-4">
                            <Icon name="public" className="text-white/30 hover:text-white cursor-pointer" />
                            <Icon name="photo_camera" className="text-white/30 hover:text-white cursor-pointer" />
                        </div>
                    </div>
                </div>
                <div className="max-w-7xl mx-auto px-4 pt-8 border-t border-white/5 text-center md:text-left flex flex-col md:flex-row justify-between items-center text-xs text-white/30">
                    <p>&copy; {new Date().getFullYear()} {storeName}. All rights reserved.</p>
                    <p>Powered by Vayva</p>
                </div>
            </footer>

        </div>
    );
}
