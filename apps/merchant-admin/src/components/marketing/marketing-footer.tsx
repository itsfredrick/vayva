'use client';

import React from 'react';
import Link from 'next/link';
import { Icon } from '@vayva/ui';

const FOOTER_LINKS = {
    Product: [
        { label: 'Store Builder', href: '/features/store-builder' },
        { label: 'Vayva Market', href: '/features/marketplace' },
        { label: 'WhatsApp AI', href: '/features/whatsapp' },
        { label: 'Pricing', href: '/pricing' },
        { label: 'Templates', href: '/templates' },
    ],
    Company: [
        { label: 'About Vayva', href: '/about' },
        { label: 'Careers', href: '/careers' },
        { label: 'Blog', href: '/blog' },
        { label: 'Contact', href: '/contact' },
    ],
    Resources: [
        { label: 'Help Center', href: '/help' },
        { label: 'Community', href: '#' },
        { label: 'Status', href: '/status' },
        { label: 'Legal Hub', href: '/legal' },
        { label: 'Terms of Service', href: '/legal/terms' },
        { label: 'Privacy Policy', href: '/legal/privacy' },
        { label: 'Manage Cookies', href: '/legal/cookies' },
    ],
    Compliance: [
        { label: 'Acceptable Use', href: '/legal/acceptable-use' },
        { label: 'Prohibited Items', href: '/legal/prohibited-items' },
        { label: 'Refund Policy', href: '/legal/refund-policy' },
        { label: 'KYC & Safety', href: '/legal/kyc-explainer' },
    ],
};

export function MarketingFooter() {
    return (
        <footer className="bg-[#0B1220] pt-20 pb-10">
            <div className="max-w-[1440px] mx-auto px-4 lg:px-6">
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-10 mb-16">
                    {/* Brand Column */}
                    <div className="col-span-2 lg:col-span-2 space-y-6">
                        <Link href="/" className="flex items-center gap-2">
                            <div className="w-8 h-8 bg-[#46EC13] rounded-lg flex items-center justify-center">
                                <span className="text-black font-bold text-xl">V</span>
                            </div>
                            <span className="text-white font-bold text-xl tracking-tight">Vayva</span>
                        </Link>
                        <p className="text-gray-400 max-w-xs text-sm leading-relaxed">
                            The all-in-one execution platform for African merchants. Build, sell, and grow with automated tools designed for our market.
                        </p>
                        <div className="flex gap-4">
                            {['twitter', 'instagram', 'linkedin', 'facebook'].map((social) => (
                                <a
                                    key={social}
                                    href={`#${social}`}
                                    className="w-10 h-10 rounded-full bg-black/5 flex items-center justify-center text-[#1d1d1f]/60 hover:text-[#46EC13] hover:bg-black/10 transition-all"
                                >
                                    {/* Use a generic icon if specific ones aren't available in mapping, or just placeholder */}
                                    <Icon name="Globe" size={20} />
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Links Columns */}
                    {Object.entries(FOOTER_LINKS).map(([category, links]) => (
                        <div key={category} className="col-span-1">
                            <h4 className="font-bold text-white mb-6">{category}</h4>
                            <ul className="space-y-4">
                                {links.map((link) => (
                                    <li key={link.href}>
                                        <Link
                                            href={link.href}
                                            className="text-sm text-gray-400 hover:text-[#22C55E] transition-colors"
                                        >
                                            {link.label}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>

                {/* Bottom Bar */}
                <div className="pt-8 border-t border-black/5 flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-gray-500 text-xs">
                        © {new Date().getFullYear()} Vayva Inc. Built for Africa.
                    </p>
                    <div className="flex gap-6">
                        <Link href="/legal/privacy" className="text-xs text-gray-500 hover:text-white">Privacy Policy</Link>
                        <Link href="/legal/terms" className="text-xs text-gray-500 hover:text-white">Terms of Service</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}
