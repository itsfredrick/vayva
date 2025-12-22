'use client';

import { AdminShell } from '@/components/admin-shell';
import { Button, cn } from '@vayva/ui';
import { api } from '@/services/api';
import Link from 'next/link';

export default function DashboardPage() {
    return (
        <AdminShell
            title="Overview"
            breadcrumb="Dashboard"
        >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="p-6 bg-white/5 border border-white/10 rounded-xl">
                    <h3 className="text-text-secondary text-sm mb-1">Total Sales</h3>
                    <div className="text-2xl font-bold text-white">$0.00</div>
                </div>
                <div className="p-6 bg-white/5 border border-white/10 rounded-xl">
                    <h3 className="text-text-secondary text-sm mb-1">Active Orders</h3>
                    <div className="text-2xl font-bold text-white">0</div>
                </div>
                <div className="p-6 bg-white/5 border border-white/10 rounded-xl">
                    <h3 className="text-text-secondary text-sm mb-1">Store Status</h3>
                    <div className="inline-flex items-center px-2 py-1 rounded bg-yellow-500/20 text-yellow-500 text-sm font-medium">Draft</div>
                </div>
            </div>
        </AdminShell>
    );
}
