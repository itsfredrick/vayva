"use client";

import React, { useEffect, useState } from "react";
import {
    User,
    Building2,
    CreditCard,
    LogOut,
    ChevronRight,
    Shield,
    ExternalLink,
    HelpCircle,
    Mail
} from "lucide-react";
import { Button, Card, Avatar } from "@vayva/ui";
import Link from "next/link";

interface AccountData {
    user: {
        firstName: string;
        lastName: string;
        email: string;
    };
    merchant: {
        storeName: string;
        businessType: string;
        plan: string;
    };
}

export default function AccountHubPage() {
    const [data, setData] = useState<AccountData | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch("/api/auth/merchant/me")
            .then(res => res.json())
            .then(res => {
                setData(res);
                setLoading(false);
            })
            .catch(() => setLoading(false));
    }, []);

    const handleSignOut = () => {
        // Standard signout flow - redirect to auth signout
        window.location.href = "/api/auth/signout";
    };

    if (loading) {
        return (
            <div className="p-8 max-w-4xl mx-auto space-y-8 animate-pulse">
                <div className="h-20 w-48 bg-gray-100 rounded-lg" />
                <div className="space-y-4">
                    <div className="h-40 w-full bg-gray-50 rounded-xl border border-gray-100" />
                    <div className="h-40 w-full bg-gray-50 rounded-xl border border-gray-100" />
                </div>
            </div>
        );
    }

    const initials = data?.user ? `${data.user.firstName?.[0] || ""}${data.user.lastName?.[0] || ""}` : "??";

    return (
        <div className="p-4 md:p-8 max-w-4xl mx-auto space-y-8 pb-12">
            <header>
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Account Hub</h1>
                <p className="text-gray-500 mt-1">Manage your profiles, subscription, and security settings.</p>
            </header>

            {/* User Section */}
            <section className="space-y-4">
                <div className="flex items-center justify-between">
                    <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">Your Profile</h2>
                </div>
                <Card className="p-6">
                    <div className="flex items-center gap-4">
                        <div className="h-16 w-16 bg-gray-900 rounded-full flex items-center justify-center text-xl font-bold text-white border-4 border-gray-50">
                            {initials}
                        </div>
                        <div>
                            <h3 className="text-lg font-bold text-gray-900">{data?.user.firstName} {data?.user.lastName}</h3>
                            <p className="text-sm text-gray-500">{data?.user.email}</p>
                        </div>
                        <Button variant="outline" size="sm" className="ml-auto md:flex hidden">Edit Profile</Button>
                    </div>
                </Card>
            </section>

            {/* Business Section */}
            <section className="space-y-4">
                <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">Business Details</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Card className="p-6 flex flex-col justify-between space-y-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-indigo-50 rounded-lg">
                                <Building2 className="w-5 h-5 text-indigo-600" />
                            </div>
                            <div>
                                <p className="text-xs text-gray-500 font-medium">Business Name</p>
                                <p className="font-bold text-gray-900">{data?.merchant.storeName}</p>
                            </div>
                        </div>
                        <Link href="/dashboard/settings/profile">
                            <Button variant="ghost" size="sm" className="w-full justify-between text-indigo-600 px-0 hover:bg-transparent">
                                Update Store Profile <ChevronRight className="w-4 h-4" />
                            </Button>
                        </Link>
                    </Card>

                    <Card className="p-6 flex flex-col justify-between space-y-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-emerald-50 rounded-lg">
                                <CreditCard className="w-5 h-5 text-emerald-600" />
                            </div>
                            <div>
                                <p className="text-xs text-gray-500 font-medium">Current Plan</p>
                                <p className="font-bold text-gray-900">{data?.merchant.plan}</p>
                            </div>
                        </div>
                        <Link href="/dashboard/billing">
                            <Button variant="ghost" size="sm" className="w-full justify-between text-emerald-600 px-0 hover:bg-transparent">
                                Manage Subscription <ChevronRight className="w-4 h-4" />
                            </Button>
                        </Link>
                    </Card>
                </div>
            </section>

            {/* Utilities */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Link href="/dashboard/support" className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors border border-gray-100 group">
                    <HelpCircle className="w-5 h-5 text-gray-500 group-hover:text-black" />
                    <span className="text-sm font-medium text-gray-700">Get Help</span>
                </Link>
                <Link href="/dashboard/settings/security" className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors border border-gray-100 group">
                    <Shield className="w-5 h-5 text-gray-500 group-hover:text-black" />
                    <span className="text-sm font-medium text-gray-700">Security</span>
                </Link>
                <a href="mailto:support@vayva.ng" className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors border border-gray-100 group">
                    <Mail className="w-5 h-5 text-gray-500 group-hover:text-black" />
                    <span className="text-sm font-medium text-gray-700">Compliance</span>
                </a>
            </div>

            {/* Sign Out */}
            <div className="pt-4 border-t border-gray-100">
                <Button
                    variant="ghost"
                    className="w-full md:w-auto text-red-600 hover:bg-red-50 hover:text-red-700 gap-2 font-bold"
                    onClick={handleSignOut}
                >
                    <LogOut className="w-5 h-5" />
                    Sign Out of Vayva
                </Button>
            </div>
        </div>
    );
}
