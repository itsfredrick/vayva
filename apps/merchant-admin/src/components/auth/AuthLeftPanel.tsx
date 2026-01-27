"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Icon } from "@vayva/ui";

type AuthLeftPanelVariant = "signin" | "signup" | "support";

interface AuthLeftPanelProps {
    showSignInLink?: boolean;
    showSignUpLink?: boolean;
    variant?: AuthLeftPanelVariant;
}

export const AuthLeftPanel = ({
    showSignInLink,
    showSignUpLink,
    variant = "support",
}: AuthLeftPanelProps) => {
    const content = (() => {
        switch (variant) {
            case "signin":
                return {
                    title: "Your Merchant Dashboard, ready when you are",
                    description:
                        "Log in to manage orders, track payments, and stay in control of your day — all from one place.",
                    bullets: ["Orders & Inventory", "Payments & Insights"],
                };
            case "signup":
                return {
                    title: "Welcome — let’s set you up for growth",
                    description:
                        "Create your account to organize your business, serve customers faster, and make smarter decisions with real-time visibility.",
                    bullets: ["Faster operations", "Clear visibility"],
                };
            default:
                return {
                    title: "Secure access to your Merchant Dashboard",
                    description:
                        "We’ll help you get in quickly and safely — so you can get back to running your business.",
                    bullets: ["Secure sign-in", "Account recovery"],
                };
        }
    })();

    return (
        <div className="hidden lg:flex lg:w-[38%] shrink-0 h-full bg-foreground flex-col justify-between p-8 relative overflow-hidden">
            {/* Background Ambience */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-600/20 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[120px] translate-y-1/2 -translate-x-1/2" />

            {/* Top: Branding */}
            <div className="relative z-10">
                <Link href="/" className="inline-flex items-center gap-2 group">
                    <Image
                        src="/vayva-logo-white.svg"
                        alt="Vayva"
                        width={48}
                        height={11}
                        className="object-contain"
                        priority
                    />
                    <span className="text-white font-semibold text-base tracking-tight">Merchant</span>
                </Link>
            </div>

            {/* Center: Hero Visual (CSS Mock Dashboard) */}
            <div className="relative z-10 flex-1 flex items-center justify-center py-8">
                {variant === "signup" ? (
                    <div className="relative w-full max-w-[260px] aspect-square rounded-3xl overflow-hidden border border-white/10 shadow-2xl">
                        <Image
                            src="/calm-solution.jpg"
                            alt="Merchant dashboard"
                            fill
                            className="object-cover"
                            sizes="260px"
                            priority
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/25 to-black/10" />
                        <div className="absolute bottom-4 left-4 right-4 bg-black/35 border border-white/10 backdrop-blur-md rounded-2xl p-3">
                            <div className="text-xs text-white/70">Today</div>
                            <div className="mt-1 flex items-end justify-between">
                                <div>
                                    <div className="text-sm font-semibold text-white">You’re in control</div>
                                    <div className="text-xs text-white/60">Set up once. Run daily.</div>
                                </div>
                                <div className="w-9 h-9 rounded-full bg-primary/20 flex items-center justify-center text-primary">
                                    <Icon name="TrendingUp" size={18} />
                                </div>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="relative w-full max-w-[208px] aspect-square">
                        {/* Main Card */}
                        <div className="absolute inset-0 bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6 transform -rotate-6 shadow-2xl overflow-hidden">
                            {/* Header */}
                            <div className="flex justify-between items-center mb-6">
                                <div>
                                    <div className="w-24 h-2 bg-white/20 rounded-full mb-2" />
                                    <div className="w-16 h-2 bg-white/10 rounded-full" />
                                </div>
                                <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                                    <Icon name="TrendingUp" size={16} className="text-primary" />
                                </div>
                            </div>
                            {/* Chart Mock */}
                            <div className="h-32 w-full flex items-end gap-2 mb-6">
                                {[40, 65, 45, 80, 55, 90, 75].map((h, i) => (
                                    <div key={i} className="flex-1 bg-gradient-to-t from-primary/20 to-primary/50 rounded-t-sm" style={{ height: `${h}%` }} />
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
                        <div className="absolute -bottom-4 -right-4 bg-white/5 border border-white/10 p-4 rounded-2xl shadow-xl flex items-center gap-4 animate-in fade-in slide-in-from-bottom-4 duration-1000">
                            <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary">
                                <Icon name="ShoppingBag" size={20} />
                            </div>
                            <div>
                                <div className="text-sm font-bold text-white">New Order</div>
                                <div className="text-xs text-primary">+ ₦45,000.00</div>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Bottom: Copy */}
            <div className="relative z-10 max-w-md">
                <h2 className="text-3xl font-bold text-white mb-5 leading-tight">
                    {content.title}
                </h2>

                <p className="text-gray-300 text-base mb-6 leading-relaxed">
                    {content.description}
                </p>

                <div className="flex items-center gap-6 text-sm font-medium text-primary">
                    <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-primary shadow-[0_0_10px_hsl(var(--primary)/0.45)]" />
                        {content.bullets[0]}
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-primary" />
                        {content.bullets[1]}
                    </div>
                </div>
            </div>
        </div>
    );
};
