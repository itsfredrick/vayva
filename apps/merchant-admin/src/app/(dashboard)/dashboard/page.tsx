'use client';

import React, { Suspense } from 'react';
import dynamic from 'next/dynamic';
import { Skeleton } from '@/components/LoadingSkeletons';

// Lazy Load Heavy Components
const GoLiveCard = dynamic(() => import('@/components/dashboard/GoLiveCard').then(mod => mod.GoLiveCard), {
    loading: () => <Skeleton className="h-48 w-full rounded-xl" />,
    ssr: false // Client-side interaction mostly
});

const DashboardSetupChecklist = dynamic(() => import('@/components/dashboard/DashboardSetupChecklist').then(mod => mod.DashboardSetupChecklist), {
    loading: () => <Skeleton className="h-64 w-full rounded-xl" />
});

const ActivationWelcome = dynamic(() => import('@/components/dashboard/ActivationWelcome').then(mod => mod.ActivationWelcome), {
    loading: () => <Skeleton className="h-32 w-full rounded-xl" />
});

// Import Widgets lazily as well
const BusinessHealthWidget = dynamic(() => import('@/components/dashboard/BusinessHealthWidget').then(mod => mod.BusinessHealthWidget), {
    loading: () => <Skeleton className="h-64 w-full rounded-xl" />
});

const AiUsageWidget = dynamic(() => import('@/components/dashboard/AiUsageWidget').then(mod => mod.AiUsageWidget), {
    loading: () => <Skeleton className="h-64 w-full rounded-xl" />
});

// Mock Data for BusinessHealthWidget
const HEALTH_DATA = {
    score: 85,
    status: 'healthy' as const,
    trend: 'up' as const,
    factors: [
        { id: '1', text: 'Consistent daily active users', sentiment: 'positive' as const },
        { id: '2', text: 'Low refund rate (<1%)', sentiment: 'positive' as const }
    ]
};

export default function DashboardPage() {
    return (
        <div className="p-4 md:p-6 max-w-7xl mx-auto space-y-6">

            {/* ... Header and other components ... */}

            <header className="mb-4 md:mb-8">
                <h1 className="text-2xl md:text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600">
                    Overview
                </h1>
                <p className="text-sm md:text-base text-gray-500 mt-1">Welcome back to Vayva.</p>
            </header>

            <Suspense fallback={<Skeleton className="h-32 w-full" />}>
                <ActivationWelcome />
            </Suspense>

            <Suspense fallback={<Skeleton className="h-64 w-full" />}>
                <DashboardSetupChecklist />
            </Suspense>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                    {/* Main Metrics Area */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Suspense fallback={<Skeleton className="h-64 w-full" />}>
                            <BusinessHealthWidget data={HEALTH_DATA} />
                        </Suspense>
                        <Suspense fallback={<Skeleton className="h-64 w-full" />}>
                            <AiUsageWidget />
                        </Suspense>
                    </div>
                </div>

                {/* ... Right Column components ... */}
                <div className="space-y-6">
                    {/* Operations Column */}
                    <Suspense fallback={<Skeleton className="h-48 w-full" />}>
                        <GoLiveCard />
                    </Suspense>

                    {/* Quick Actions */}
                    <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
                        <h3 className="font-bold mb-4 text-gray-900">Quick Actions</h3>
                        <div className="space-y-2">
                            <button className="w-full text-left px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 hover:text-black rounded-lg transition-colors flex items-center justify-between group">
                                <span>Add Product</span>
                                <span className="opacity-0 group-hover:opacity-100 transition-opacity">→</span>
                            </button>
                            <button className="w-full text-left px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 hover:text-black rounded-lg transition-colors flex items-center justify-between group">
                                <span>Customize Theme</span>
                                <span className="opacity-0 group-hover:opacity-100 transition-opacity">→</span>
                            </button>
                            <button className="w-full text-left px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 hover:text-black rounded-lg transition-colors flex items-center justify-between group">
                                <span>View Orders</span>
                                <span className="opacity-0 group-hover:opacity-100 transition-opacity">→</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
