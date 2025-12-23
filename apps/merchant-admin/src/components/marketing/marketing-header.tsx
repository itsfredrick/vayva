'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@vayva/ui';

const NAV_LINKS = [
    { href: '/features', label: 'Features' },
    { href: '/pricing', label: 'Pricing' },
    { href: '/templates', label: 'Templates' },
    { href: '/marketplace', label: 'Marketplace' },
    { href: '/help', label: 'Help' },
];

export function MarketingHeader() {
    return (
        <header className="sticky top-0 z-50 bg-white border-b border-[#E5E7EB]">
            <div className="max-w-7xl mx-auto px-4 lg:px-6 h-20 flex items-center justify-between">
                {/* Logo */}
                <Link href="/" className="flex items-center gap-2">
                    <Image
                        src="/vayva-logo.png"
                        alt="Vayva"
                        width={64}
                        height={64}
                        className="object-contain"
                    />
                    <span className="text-[#0F172A] font-semibold text-xl tracking-tight">Vayva</span>
                </Link>

                {/* Desktop Nav */}
                <nav className="hidden lg:flex items-center gap-8">
                    {NAV_LINKS.map((link) => (
                        <Link
                            key={link.href}
                            href={link.href}
                            className="text-[#0F172A] hover:text-[#22C55E] transition-colors font-medium"
                        >
                            {link.label}
                        </Link>
                    ))}
                </nav>

                {/* CTA Buttons */}
                <div className="flex items-center gap-4">
                    <Link href="/signin" className="hidden sm:block">
                        <Button variant="ghost" className="text-[#0F172A]">
                            Login
                        </Button>
                    </Link>
                    <Link href="/signup">
                        <Button className="bg-[#22C55E] hover:bg-[#16A34A] text-white">
                            Get Started
                        </Button>
                    </Link>
                </div>
            </div>
        </header>
    );
}
