'use client';

import React, { useState, useEffect } from 'react';
import { AdminShell } from '@/components/admin-shell';
import { Button, cn } from '@vayva/ui';
import { api } from '@/services/api';
import Link from 'next/link';

export default function UsagePage() {
    const [usage, setUsage] = useState<any[]>([]);

    useEffect(() => {
        const fetchUsage = async () => {
            const keys = ['whatsapp_messages_sent', 'orders_created', 'staff_seats', 'campaigns_sent'];
            const results = await Promise.all(
                keys.map(key => api.get(`/billing/usage/${key}`).then(res => ({ key, ...res.data })))
            );
            setUsage(results);
        };
        fetchUsage();
    }, []);

    const getLabel = (key: string) => {
        const labels: any = {
            'whatsapp_messages_sent': 'WhatsApp Messages',
            'orders_created': 'Orders',
            'staff_seats': 'Staff Seats',
            'campaigns_sent': 'Campaign Sends'
        };
        return labels[key] || key;
    };

    return (
        <AdminShell title="Usage & Limits" breadcrumb="Billing">
            <div className="max-w-4xl mx-auto flex flex-col gap-8">

                <div>
                    <h1 className="text-2xl font-bold text-[#0B1220] mb-2">Usage & Limits</h1>
                    <p className="text-[#525252]">Track your usage against plan limits.</p>
                </div>

                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-6">
                    {usage.map(item => {
                        const percentage = item.limit > 0 ? (item.used / item.limit) * 100 : 0;
                        const isNearLimit = percentage >= 80;

                        return (
                            <div key={item.key}>
                                <div className="flex items-center justify-between mb-2">
                                    <h3 className="font-medium text-[#0B1220]">{getLabel(item.key)}</h3>
                                    <span className="text-sm text-[#525252]">
                                        {item.used} / {item.limit}
                                    </span>
                                </div>
                                <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
                                    <div
                                        className={cn(
                                            "h-full rounded-full transition-all",
                                            isNearLimit ? "bg-orange-500" : "bg-green-500"
                                        )}
                                        style={{ width: `${Math.min(100, percentage)}%` }}
                                    />
                                </div>
                                {isNearLimit && (
                                    <p className="text-xs text-orange-600 mt-1">
                                        ⚠️ Approaching limit. Consider upgrading your plan.
                                    </p>
                                )}
                            </div>
                        );
                    })}
                </div>

                <Link href="/admin/billing/plans">
                    <Button variant="outline">
                        View Plans
                    </Button>
                </Link>

            </div>
        </AdminShell>
    );
}
