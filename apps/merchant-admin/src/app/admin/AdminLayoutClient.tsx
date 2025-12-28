'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import { AdminShell } from '@/components/admin-shell';
import { SupportProvider } from '@/components/support/SupportContext';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { SecurityProvider } from '@/context/SecurityContext';

export function AdminLayoutClient({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const isAccountOverview = pathname.includes('/account/overview');

    const content = isAccountOverview ? (
        <div className="min-h-screen bg-gray-900 flex flex-col">
            <main className="flex-1 w-full h-full p-8">
                {children}
            </main>
        </div>
    ) : (
        <SecurityProvider>
            <AdminShell>
                {children}
            </AdminShell>
        </SecurityProvider>
    );

    return (
        <SupportProvider>
            <ErrorBoundary>
                {content}
            </ErrorBoundary>
        </SupportProvider>
    );
}
