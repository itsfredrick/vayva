"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Icon } from "@vayva/ui";

interface AuthLeftPanelProps {
    showSignInLink?: boolean;
    showSignUpLink?: boolean;
}

export const AuthLeftPanel = ({
    showSignInLink,
    showSignUpLink,
}: AuthLeftPanelProps) => {
    return (
        <div className="hidden lg:flex lg:w-[45%] bg-[#0A0A0A] flex-col justify-between p-12 relative overflow-hidden">
            {/* Background Ambience */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-600/20 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-green-500/10 rounded-full blur-[120px] translate-y-1/2 -translate-x-1/2" />

            {/* Top: Branding */}
            <div className="relative z-10">
                <Link href="/" className="inline-flex items-center gap-3 group">
                    <Image
                        src="/vayva-logo-white.svg"
                        alt="Vayva"
                        width={140}
                        height={40}
                        className="object-contain"
                        priority
                    />
                </Link>
            </div>

            {/* Center: Hero Visual (CSS Mock Dashboard) */}
            <div className="relative z-10 flex-1 flex items-center justify-center py-12">
                <div className="relative w-full max-w-sm aspect-square">
                    {/* Main Card */}
                    <div className="absolute inset-0 bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6 transform -rotate-6 shadow-2xl overflow-hidden">
                        {/* Header */}
                        <div className="flex justify-between items-center mb-6">
                            <div>
                                <div className="w-24 h-2 bg-white/20 rounded-full mb-2" />
                                <div className="w-16 h-2 bg-white/10 rounded-full" />
                            </div>
                            <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center">
                                <Icon name="TrendingUp" size={16} className="text-green-400" />
                            </div>
                        </div>
                        {/* Chart Mock */}
                        <div className="h-32 w-full flex items-end gap-2 mb-6">
                            {[40, 65, 45, 80, 55, 90, 75].map((h, i) => (
                                <div key={i} className="flex-1 bg-gradient-to-t from-green-500/20 to-green-500/50 rounded-t-sm" style={{ height: `${h}%` }} />
                            ))}
                        </div>
                        {/* Stats Row */}
                        <div className="grid grid-cols-2 gap-4">
                            <div className="bg-white/5 p-3 rounded-xl">
                                <div className="text-xs text-white/40 mb-1">Total Sales</div>
                                <div className="text-lg font-bold text-white">₦2.4M</div>
                            </div>
                            <div className="bg-white/5 p-3 rounded-xl">
                                <div className="text-xs text-white/40 mb-1">Orders</div>
                                <div className="text-lg font-bold text-white">1,248</div>
                            </div>
                        </div>
                    </div>

                    {/* Floating Notification Card */}
                    <div className="absolute -bottom-4 -right-4 bg-[#111] border border-gray-800 p-4 rounded-2xl shadow-xl flex items-center gap-4 animate-in fade-in slide-in-from-bottom-4 duration-1000">
                        <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center text-green-400">
                            <Icon name="ShoppingBag" size={20} />
                        </div>
                        <div>
                            <div className="text-sm font-bold text-white">New Order</div>
                            <div className="text-xs text-green-400">+ ₦45,000.00</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom: Copy */}
            <div className="relative z-10 max-w-md">
                <h2 className="text-4xl font-bold text-white mb-6 leading-tight">
                    Run your business on WhatsApp
                </h2>

                <p className="text-gray-300 text-lg mb-8 leading-relaxed">
                    Transform chaotic conversations into organized orders, payments, and delivery tracking. The operating system for modern African commerce.
                </p>

                <div className="flex items-center gap-6 text-sm font-medium text-green-400">
                    <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.5)]" />
                        Real-time Sync
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-green-500" />
                        Automated Invoices
                    </div>
                </div>
            </div>
        </div>
    );
};
