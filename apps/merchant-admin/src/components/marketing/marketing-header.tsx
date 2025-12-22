'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Icon } from '@vayva/ui';
import { Button } from '@vayva/ui';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

const NAV_LINKS = [
    { label: 'Features', href: '/features' },
    { label: 'Marketplace', href: '/marketplace' },
    { label: 'Pricing', href: '/pricing' },
    { label: 'Templates', href: '/templates' },
    { label: 'Help', href: '/help' },
];

export function MarketingHeader() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const pathname = usePathname();

    return (
        <header className="fixed top-0 left-0 right-0 z-50 transition-all duration-300 bg-white/80 backdrop-blur-md border-b border-black/5">
            <div className="max-w-[1440px] mx-auto px-4 lg:px-6 h-20 flex items-center justify-between">
                {/* Logo */}
                <Link href="/" className="flex items-center gap-2 z-50">
                    <div className="w-8 h-8 bg-[#46EC13] rounded-lg flex items-center justify-center">
                        <span className="text-black font-bold text-xl">V</span>
                    </div>
                    <span className="text-[#1d1d1f] font-bold text-xl tracking-tight">Vayva</span>
                </Link>

                {/* Desktop Nav */}
                <nav className="hidden lg:flex items-center gap-8">
                    {NAV_LINKS.map((link) => (
                        <Link
                            key={link.href}
                            href={link.href}
                            className={cn(
                                "text-sm font-medium transition-colors hover:text-[#46EC13]",
                                pathname === link.href ? "text-[#1d1d1f]" : "text-[#1d1d1f]/60"
                            )}
                        >
                            {link.label}
                        </Link>
                    ))}
                </nav>

                <div className="hidden lg:flex items-center gap-4">
                    <Link href="/signin" className="text-sm font-bold text-[#1d1d1f] hover:text-[#46EC13] transition-colors">
                        Sign in
                    </Link>
                    <Link href="/signup">
                        <Button className="bg-[#46EC13] hover:bg-[#3DD10F] text-black font-bold rounded-full px-6">
                            Create account
                        </Button>
                    </Link>
                </div>

                {/* Mobile Menu Toggle */}
                <button
                    className="lg:hidden z-50 w-10 h-10 flex items-center justify-center text-[#1d1d1f]"
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                >
                    <Icon name={isMenuOpen ? ('X' as any) : ('Menu' as any)} size={24} />
                </button>
            </div>

            {/* Mobile Menu Overlay */}
            <AnimatePresence>
                {isMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="fixed inset-0 top-20 bg-white z-40 flex flex-col p-6 lg:hidden border-t border-black/5"
                    >
                        <nav className="flex flex-col gap-6 mt-4">
                            {NAV_LINKS.map((link) => (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    onClick={() => setIsMenuOpen(false)}
                                    className="text-2xl font-bold text-[#1d1d1f]/80 hover:text-[#46EC13]"
                                >
                                    {link.label}
                                </Link>
                            ))}
                            <hr className="border-black/10 my-4" />
                            <Link href="/signin" onClick={() => setIsMenuOpen(false)} className="text-xl font-bold text-[#1d1d1f]">
                                Sign in
                            </Link>
                            <Link href="/signup" onClick={() => setIsMenuOpen(false)}>
                                <Button className="w-full bg-[#46EC13] hover:bg-[#3DD10F] text-black font-bold rounded-full py-6 text-lg">
                                    Create account
                                </Button>
                            </Link>
                        </nav>
                    </motion.div>
                )}
            </AnimatePresence>
        </header>
    );
}
