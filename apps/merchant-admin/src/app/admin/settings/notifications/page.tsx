'use client';

import React, { useState, useEffect } from 'react';
import {
    AppShell,
    Button,
    GlassPanel,
    Input,
    Icon,
    cn
} from '@vayva/ui';

export default function NotificationsPage() {
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [prefs, setPrefs] = useState<any>({
        ORDER_PLACED: true,
        ORDER_PAID: true,
        LOW_STOCK: true,
        PAYOUT_SUCCESS: true,
        MARKETING_TIPS: false
    });

    useEffect(() => {
        fetch('/api/settings/notifications')
            .then(res => res.json())
            .then(json => {
                setPrefs(json);
                setLoading(false);
            })
            .catch(console.error);
    }, []);

    const togglePref = (key: string) => {
        setPrefs({ ...prefs, [key]: !(prefs as any)[key] });
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            const res = await fetch('/api/settings/notifications', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(prefs)
            });
            if (!res.ok) throw new Error('Save failed');
            alert('Preferences saved');
        } catch (err) {
            console.error(err);
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <div className="p-8 text-white">Loading preferences...</div>;

    const sections = [
        {
            title: 'Transactional',
            desc: 'Critical alerts about your store operations.',
            items: [
                { key: 'ORDER_PLACED', label: 'New Order Received', desc: 'Notify me whenever a customer places an order.' },
                { key: 'ORDER_PAID', label: 'Order Payment Confirmed', desc: 'Get alerted when a payment is successfully processed.' },
                { key: 'PAYOUT_SUCCESS', label: 'Payout Successful', desc: 'When earnings are sent to your bank account.' }
            ]
        },
        {
            title: 'Inventory & Marketing',
            desc: 'Updates to help you sell more and manage stock.',
            items: [
                { key: 'LOW_STOCK', label: 'Low Stock Alerts', desc: 'Get warned when products fall below your threshold.' },
                { key: 'MARKETING_TIPS', label: 'Vayva Tips & Growth', desc: 'Occasional emails about platform features and sales strategy.' }
            ]
        }
    ];

    return (
        <div className="max-w-4xl mx-auto py-8 px-4 space-y-8 animate-in fade-in duration-500">
            <div>
                <h1 className="text-3xl font-extrabold text-white">Notification Preferences</h1>
                <p className="text-text-secondary font-medium mt-1">Control how and when we reach out to you.</p>
            </div>

            <div className="space-y-8">
                {sections.map(section => (
                    <GlassPanel key={section.title} className="p-8 space-y-6">
                        <div className="border-b border-white/5 pb-4">
                            <h2 className="text-xl font-bold text-white">{section.title}</h2>
                            <p className="text-xs text-text-secondary">{section.desc}</p>
                        </div>

                        <div className="space-y-4">
                            {section.items.map(item => (
                                <div key={item.key} className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/10 hover:bg-white/10 transition-all cursor-pointer" onClick={() => togglePref(item.key)}>
                                    <div className="space-y-1">
                                        <h3 className="text-sm font-bold text-white">{item.label}</h3>
                                        <p className="text-[10px] text-text-secondary">{item.desc}</p>
                                    </div>
                                    <div className={cn(
                                        "w-12 h-7 rounded-full p-1 transition-all duration-300",
                                        (prefs as any)[item.key] ? "bg-primary" : "bg-white/10"
                                    )}>
                                        <div className={cn(
                                            "w-5 h-5 bg-white rounded-full transition-all duration-300",
                                            (prefs as any)[item.key] ? "translate-x-5" : "translate-x-0"
                                        )} />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </GlassPanel>
                ))}

                <div className="flex justify-end pt-4">
                    <Button onClick={handleSave} isLoading={saving} className="px-12">Save Preferences</Button>
                </div>
            </div>
        </div>
    );
}
