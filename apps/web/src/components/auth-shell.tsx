'use client';

import React from 'react';
import Link from 'next/link';
import { Icon } from './ui/icon';

export const AuthShell = ({ children }: { children: React.ReactNode }) => {
    return (
        <div className="flex flex-col min-h-screen w-full bg-background-dark overflow-hidden relative">
            {/* Background Treatment */}
            <div className="absolute inset-0 z-0 bg-[url('https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2564&auto=format&fit=crop')] bg-cover opacity-10 mix-blend-overlay pointer-events-none"></div>

            {/* Header */}
            <header className="h-[72px] w-full px-8 flex items-center justify-between border-b border-border-subtle bg-[rgba(20,34,16,0.30)] backdrop-blur-sm z-10 relative">
                <Link href="/" className="flex items-center gap-2">
                    <h1 className="text-2xl font-bold text-primary flex items-center gap-2">
                        <Icon name="verified" className="text-primary" />
                        Vayva
                    </h1>
                    <p className="text-xs text-text-secondary uppercase tracking-widest mt-1 border-l border-border-subtle pl-2 ml-2">Seller Dashboard</p>
                </Link>

                <div>
                    <Link href="/help" className="text-sm text-text-secondary hover:text-white transition-colors">
                        Need help?
                    </Link>
                </div>
            </header>

            {/* Main Content */}
            <main className="flex-1 flex flex-col items-center justify-center p-6 z-10 relative">
                {children}

                <footer className="mt-8 text-xs text-text-secondary text-center">
                    By continuing you agree to <Link href="/terms" className="hover:text-white underline">Terms</Link> & <Link href="/privacy" className="hover:text-white underline">Privacy</Link>.
                </footer>
            </main>
        </div>
    );
};
