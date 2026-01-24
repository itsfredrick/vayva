"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import {
    Store,
    Mail,
    Phone,
    MapPin,
    Globe,
    Camera,
    Loader2,
    Save,
    Smartphone,
    Clock,
    Lock,
    Unlock
} from "lucide-react";
import { Button } from "@vayva/ui";

interface StoreProfile {
    name: string;
    slug: string;
    businessType: string;
    description: string;
    supportEmail: string;
    supportPhone: string;
    logoUrl: string;
    whatsappNumber: string;
    address: {
        street: string;
        city: string;
        state: string;
        country: string;
        landmark: string;
    };
    isActive: boolean;
    operatingHours: Record<string, {
        isClosed: boolean;
        open?: string;
        close?: string;
    }>;
}

const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

export default function StoreSettingsPage() {
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [profile, setProfile] = useState<StoreProfile | null>(null);

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            const res = await fetch("/api/account/store");
            if (!res.ok) throw new Error("Failed to load store profile");
            const data = await res.json();
            setProfile(data);
        } catch (error: any) {
            console.error(error);
            toast.error("Could not load store profile");
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!profile) return;

        setSaving(true);
        try {
            const res = await fetch("/api/account/store", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(profile),
            });

            if (!res.ok) {
                const err = await res.json();
                throw new Error(err.error || "Failed to update profile");
            }

            toast.success("Store profile updated successfully");
        } catch (error: any) {
            toast.error(error.message || "Failed to update profile");
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="flex h-[400px] items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-slate-400" />
            </div>
        );
    }

    if (!profile) return null;

    return (
        <div className="max-w-4xl space-y-8">
            <div>
                <h1 className="text-2xl font-bold tracking-tight text-slate-900">Store Settings</h1>
                <p className="text-slate-500">Manage your public store profile and contact information.</p>
            </div>

            <form onSubmit={handleSave} className="space-y-6">
                {/* Branding Section */}
                <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                    <h2 className="text-lg font-semibold text-slate-900 mb-6 flex items-center gap-2">
                        <Store className="h-5 w-5 text-indigo-600" />
                        Branding & Identity
                    </h2>

                    <div className="flex flex-col md:flex-row gap-8">
                        <div className="flex-shrink-0">
                            <label className="block text-sm font-medium text-slate-700 mb-2">Store Logo</label>
                            <div className="relative h-24 w-24 rounded-xl border-2 border-dashed border-slate-200 bg-slate-50 flex items-center justify-center overflow-hidden group">
                                {profile.logoUrl ? (
                                    <img src={profile.logoUrl} alt="Logo" className="h-full w-full object-contain" />
                                ) : (
                                    <Camera className="h-8 w-8 text-slate-300" />
                                )}
                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity cursor-pointer">
                                    <span className="text-[10px] text-white font-bold">CHANGE</span>
                                </div>
                            </div>
                        </div>

                        <div className="flex-grow grid gap-4 sm:grid-cols-2">
                            <div className="sm:col-span-2">
                                <label htmlFor="store-name" className="block text-sm font-medium text-slate-700 mb-1.5 text-left">Store Name</label>
                                <input
                                    id="store-name"
                                    type="text"
                                    placeholder="Enter your store name"
                                    value={(profile.name as any)}
                                    onChange={(e: any) => setProfile({ ...profile, name: e.target.value })}
                                    className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all text-slate-900"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1.5 text-left">Store URL Slug</label>
                                <div className="flex items-center gap-1 bg-slate-50 px-3 py-2 rounded-lg border border-slate-300 text-slate-500 text-sm">
                                    <Globe className="h-4 w-4" />
                                    <span>vayva.store/</span>
                                    <span className="font-medium text-slate-900">{profile.slug}</span>
                                </div>
                            </div>
                            <div>
                                <label htmlFor="store-category" className="block text-sm font-medium text-slate-700 mb-1.5 text-left">Business Category</label>
                                <select
                                    id="store-category"
                                    value={(profile.businessType as any)}
                                    onChange={(e: any) => setProfile({ ...profile, businessType: e.target.value })}
                                    className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-indigo-500 outline-none text-slate-900"
                                >
                                    <option value="fashion">Fashion & Apparel</option>
                                    <option value="electronics">Electronics</option>
                                    <option value="beauty">Beauty & Personal Care</option>
                                    <option value="food">Food & Groceries</option>
                                    <option value="services">Professional Services</option>
                                    <option value="general">General Retail</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    <div className="mt-6">
                        <label htmlFor="store-description" className="block text-sm font-medium text-slate-700 mb-1.5 text-left">Short Description</label>
                        <textarea
                            id="store-description"
                            value={(profile.description as any)}
                            onChange={(e: any) => setProfile({ ...profile, description: e.target.value })}
                            rows={3}
                            placeholder="A brief bio that appears on your store profile..."
                            className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-indigo-500 outline-none text-slate-900 resize-none"
                        />
                    </div>
                </div>

                {/* Contact Section */}
                <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                    <h2 className="text-lg font-semibold text-slate-900 mb-6 flex items-center gap-2">
                        <Mail className="h-5 w-5 text-indigo-600" />
                        Support & Communication
                    </h2>

                    <div className="grid gap-6 sm:grid-cols-2">
                        <div>
                            <label htmlFor="support-email" className="block text-sm font-medium text-slate-700 mb-1.5 text-left">Support Email</label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                                <input
                                    id="support-email"
                                    type="email"
                                    placeholder="support@yourstore.com"
                                    value={(profile.supportEmail as any)}
                                    onChange={(e: any) => setProfile({ ...profile, supportEmail: e.target.value })}
                                    className="w-full pl-10 pr-3 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-indigo-500 outline-none text-slate-900"
                                    required
                                />
                            </div>
                        </div>
                        <div>
                            <label htmlFor="support-phone" className="block text-sm font-medium text-slate-700 mb-1.5 text-left">Support Phone</label>
                            <div className="relative">
                                <Phone className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                                <input
                                    id="support-phone"
                                    type="tel"
                                    placeholder="+234..."
                                    value={(profile.supportPhone as any)}
                                    onChange={(e: any) => setProfile({ ...profile, supportPhone: e.target.value })}
                                    className="w-full pl-10 pr-3 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-indigo-500 outline-none text-slate-900"
                                />
                            </div>
                        </div>
                        <div className="sm:col-span-2">
                            <label htmlFor="whatsapp-number" className="block text-sm font-medium text-slate-700 mb-1.5 text-left">Official WhatsApp Number (E.164)</label>
                            <div className="relative">
                                <Smartphone className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                                <input
                                    id="whatsapp-number"
                                    type="text"
                                    placeholder="+234..."
                                    value={(profile.whatsappNumber as any)}
                                    onChange={(e: any) => setProfile({ ...profile, whatsappNumber: e.target.value })}
                                    className="w-full pl-10 pr-3 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-indigo-500 outline-none text-slate-900 font-mono"
                                />
                                <p className="mt-1 text-xs text-slate-400">This number will be used for AI Agent responses and customer contact.</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Store Status Section */}
                <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                    <h2 className="text-lg font-semibold text-slate-900 mb-6 flex items-center gap-2">
                        {profile.isActive ? <Unlock className="h-5 w-5 text-green-600" /> : <Lock className="h-5 w-5 text-red-600" />}
                        Store Status
                    </h2>

                    <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                        <div>
                            <p className="font-semibold text-slate-900">
                                {profile.isActive ? "Store is Open" : "Store is Closed (Maintenance Mode)"}
                            </p>
                            <p className="text-sm text-slate-500">
                                {profile.isActive
                                    ? "Customers can see your products and place orders."
                                    : "Customers cannot place orders, but can still browse (if enabled)."}
                            </p>
                        </div>
                        <Button
                            type="button"
                            variant={profile.isActive ? "outline" : "primary"}
                            onClick={() => setProfile({ ...profile, isActive: !profile.isActive })}
                            className={profile.isActive ? "border-red-200 text-red-600 hover:bg-red-50" : "bg-green-600 hover:bg-green-700"}
                        >
                            {profile.isActive ? "Stop Orders" : "Resume Orders"}
                        </Button>
                    </div>
                </div>

                {/* Operating Hours Section */}
                <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                    <h2 className="text-lg font-semibold text-slate-900 mb-6 flex items-center gap-2">
                        <Clock className="h-5 w-5 text-indigo-600" />
                        Operating Hours
                    </h2>

                    <div className="space-y-4">
                        {DAYS.map(day => {
                            const hours = profile.operatingHours[day] || { isClosed: false, open: "08:00", close: "18:00" };
                            return (
                                <div key={day} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-3 border-b border-slate-50 last:border-0">
                                    <div className="w-24 font-medium text-slate-700">{day}</div>
                                    <div className="flex items-center gap-4 flex-grow sm:justify-end">
                                        <label className="flex items-center gap-2 cursor-pointer">
                                            <input
                                                type="checkbox"
                                                checked={hours.isClosed}
                                                onChange={(e: any) => {
                                                    const newHours = { ...profile.operatingHours };
                                                    newHours[day] = { ...hours, isClosed: e.target.checked };
                                                    setProfile({ ...profile, operatingHours: newHours });
                                                }}
                                                className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                                            />
                                            <span className="text-sm text-slate-500">Closed</span>
                                        </label>

                                        {!hours.isClosed && (
                                            <div className="flex items-center gap-2">
                                                <input
                                                    type="time"
                                                    value={hours.open || "08:00"}
                                                    aria-label={`${day} opening time`}
                                                    onChange={(e: any) => {
                                                        const newHours = { ...profile.operatingHours };
                                                        newHours[day] = { ...hours, open: e.target.value };
                                                        setProfile({ ...profile, operatingHours: newHours });
                                                    }}
                                                    className="px-2 py-1 rounded border border-slate-300 text-sm outline-none focus:ring-1 focus:ring-indigo-500"
                                                />
                                                <span className="text-slate-400">-</span>
                                                <input
                                                    type="time"
                                                    value={hours.close || "18:00"}
                                                    aria-label={`${day} closing time`}
                                                    onChange={(e: any) => {
                                                        const newHours = { ...profile.operatingHours };
                                                        newHours[day] = { ...hours, close: e.target.value };
                                                        setProfile({ ...profile, operatingHours: newHours });
                                                    }}
                                                    className="px-2 py-1 rounded border border-slate-300 text-sm outline-none focus:ring-1 focus:ring-indigo-500"
                                                />
                                            </div>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                <div className="flex justify-end pt-4 border-t border-slate-200">
                    <Button
                        type="submit"
                        disabled={saving}
                        className="bg-indigo-600 hover:bg-indigo-700 text-white flex items-center gap-2 px-8"
                    >
                        {saving ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                            <Save className="h-4 w-4" />
                        )}
                        Save Changes
                    </Button>
                </div>
            </form>
        </div>
    );
}
