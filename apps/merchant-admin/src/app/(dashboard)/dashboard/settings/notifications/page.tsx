"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Bell, Mail, Smartphone, AlertTriangle, ShoppingBag, Wallet } from "lucide-react";

export default function NotificationsPage() {
    const [preferences, setPreferences] = useState({
        orders_email: true,
        orders_push: true,
        payouts_email: true,
        payouts_push: false,
        security_email: true,
        security_push: true,
        marketing_email: false,
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPrefs = async () => {
            try {
                const res = await fetch("/api/notifications/preferences");
                if (res.ok) {
                    const data = await res.json();
                    setPreferences(data);
                }
            } catch (error: any) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };
        fetchPrefs();
    }, []);

    const toggle = async (key: keyof typeof preferences) => {
        const next = { ...preferences, [key]: !preferences[key] };
        setPreferences(next); // Optimistic update

        try {
            const res = await fetch("/api/notifications/preferences", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(next)
            });
            if (!res.ok) throw new Error("Failed to save");
            toast.success("Preferences saved");
        } catch (error: any) {
            toast.error("Failed to save preferences");
            setPreferences(preferences); // Revert
        }
    };

    return (
        <div className="space-y-6 max-w-4xl">
            <div>
                <h1 className="text-2xl font-bold tracking-tight text-slate-900">Notifications</h1>
                <p className="text-slate-500">Control how and when we communicate with you.</p>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-slate-200 divide-y divide-slate-100">
                {/* Orders */}
                <div className="p-6 flex items-start gap-4">
                    <div className="p-2 bg-blue-50 text-blue-600 rounded-lg mt-1">
                        <ShoppingBag className="h-5 w-5" />
                    </div>
                    <div className="flex-1">
                        <h3 className="font-medium text-slate-900">New Orders</h3>
                        <p className="text-sm text-slate-500 mb-4">Get notified when a customer places an order.</p>
                        <div className="flex gap-6">
                            <Toggle
                                {...({
                                    label: "Email",
                                    icon: Mail,
                                    checked: preferences.orders_email,
                                    onChange: () => toggle('orders_email')
                                } as any)}
                            />
                            <Toggle
                                {...({
                                    label: "Push",
                                    icon: Smartphone,
                                    checked: preferences.orders_push,
                                    onChange: () => toggle('orders_push')
                                } as any)}
                            />
                        </div>
                    </div>
                </div>

                {/* Payouts */}
                <div className="p-6 flex items-start gap-4">
                    <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg mt-1">
                        <Wallet className="h-5 w-5" />
                    </div>
                    <div className="flex-1">
                        <h3 className="font-medium text-slate-900">Payouts</h3>
                        <p className="text-sm text-slate-500 mb-4">Updates on withdrawal requests and deposits.</p>
                        <div className="flex gap-6">
                            <Toggle
                                {...({
                                    label: "Email",
                                    icon: Mail,
                                    checked: preferences.payouts_email,
                                    onChange: () => toggle('payouts_email')
                                } as any)}
                            />
                            <Toggle
                                {...({
                                    label: "Push",
                                    icon: Smartphone,
                                    checked: preferences.payouts_push,
                                    onChange: () => toggle('payouts_push')
                                } as any)}
                            />
                        </div>
                    </div>
                </div>

                {/* Security */}
                <div className="p-6 flex items-start gap-4">
                    <div className="p-2 bg-red-50 text-red-600 rounded-lg mt-1">
                        <ShieldAlert className="h-5 w-5" />
                    </div>
                    <div className="flex-1">
                        <h3 className="font-medium text-slate-900">Security Alerts</h3>
                        <p className="text-sm text-slate-500 mb-4">Critical security alerts and login attempts.</p>
                        <div className="flex gap-6">
                            <Toggle
                                {...({
                                    label: "Email",
                                    icon: Mail,
                                    checked: preferences.security_email,
                                    onChange: () => toggle('security_email'),
                                    disabled: true
                                } as any)}
                            />
                            <Toggle
                                {...({
                                    label: "Push",
                                    icon: Smartphone,
                                    checked: preferences.security_push,
                                    onChange: () => toggle('security_push'),
                                    disabled: true
                                } as any)}
                            />
                        </div>
                        <p className="text-xs text-slate-400 mt-2">Security notifications cannot be disabled.</p>
                    </div>
                </div>
            </div>
        </div>
    );
}

function Toggle({ label, icon: Icon, checked, onChange, disabled }: any) {
    return (
        <label className={`flex items-center gap-2 cursor-pointer ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}>
            <div className={`w-10 h-6 rounded-full p-1 transition-colors ${checked ? 'bg-indigo-600' : 'bg-slate-200'}`}>
                <div className={`bg-white w-4 h-4 rounded-full shadow-sm transform transition-transform ${checked ? 'translate-x-4' : ''}`} />
            </div>
            <input type="checkbox" className="hidden" checked={(checked as any)} onChange={(onChange as any)} disabled={(disabled as any)} />
            <div className="flex items-center gap-1.5 text-sm font-medium text-slate-700">
                <Icon className="h-3.5 w-3.5" />
                {(label as any)}
            </div>
        </label>
    );
}

function ShieldAlert(props: any) {
    return (
        <svg
            {...(props as any)}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" />
            <path d="M12 8v4" />
            <path d="M12 16h.01" />
        </svg>
    )
}
