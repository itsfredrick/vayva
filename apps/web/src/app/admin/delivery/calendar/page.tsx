'use client';

import React from 'react';
import Link from 'next/link';
import { AdminShell } from '@/components/admin-shell';
import { GlassPanel } from '@/components/ui/glass-panel';
import { Button } from '@/components/ui/button';
import { Icon } from '@/components/ui/icon';

export default function DeliveryCalendarPage() {
    return (
        <AdminShell title="Delivery Calendar" breadcrumb="Delivery / Calendar">
            <div className="flex flex-col items-center justify-center h-[60vh] text-center max-w-2xl mx-auto px-6">
                <div className="w-24 h-24 rounded-full bg-white/5 flex items-center justify-center mb-6">
                    <Icon name="calendar_month" size={48} className="text-primary/50" />
                </div>
                <h1 className="text-3xl font-bold text-white mb-2">Delivery Scheduling Coming Soon</h1>
                <p className="text-text-secondary mb-8">
                    We're building a visual calendar to help you manage delivery windows and avoid double-booking.
                    For now, please use the tasks list to manage your schedule.
                </p>
                <Link href="/admin/delivery/tasks">
                    <Button>View Tasks List</Button>
                </Link>
            </div>
        </AdminShell>
    );
}
