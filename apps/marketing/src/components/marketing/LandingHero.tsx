"use client";

import React from "react";
import Image from "next/image";
import * as motion from "framer-motion/client";
import { CheckCircle2, CreditCard, LayoutDashboard, Package, Truck } from "lucide-react";
import { PremiumButton } from "@/components/marketing/PremiumButton";
import { Button } from "@vayva/ui";
import { APP_URL } from "@/lib/constants";
import Link from "next/link";

interface LandingHeroProps {
    headline: React.ReactNode;
    sub: string;
}

export function LandingHero({ headline, sub }: LandingHeroProps): React.JSX.Element {
    const controlPillars: Array<{ label: string; Icon: React.ComponentType<{ className?: string }> }> = [
        { label: "Orders", Icon: LayoutDashboard },
        { label: "Payments", Icon: CreditCard },
        { label: "Inventory", Icon: Package },
        { label: "Delivery", Icon: Truck },
    ];

    return (
        <section className="relative overflow-hidden pt-10 pb-16 md:pt-16 md:pb-24 px-4">
            <div className="pointer-events-none absolute inset-0">
                <div className="absolute -top-24 -left-24 h-64 w-64 rounded-full bg-green-100 blur-3xl opacity-60" />
                <div className="absolute -bottom-24 -right-24 h-64 w-64 rounded-full bg-blue-100 blur-3xl opacity-50" />
            </div>
            <div className="relative max-w-[1760px] mx-auto">
                <div className="grid lg:grid-cols-2 gap-10 xl:gap-14 items-center">
                    {/* Left: Text Content */}
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-[#0F172A] mb-6 leading-[1.1] tracking-tight">
                            {headline}
                        </h1>

                        <p className="text-lg text-[#64748B] mb-8 leading-relaxed max-w-xl">
                            {sub}
                        </p>

                        <div className="max-w-xl space-y-3 text-sm text-[#0F172A]">
                            <div className="flex items-start gap-3">
                                <span className="mt-1 w-2 h-2 rounded-full bg-[#22C55E] flex-shrink-0" />
                                <p className="leading-relaxed">
                                    Turn DMs into <span className="font-bold">tracked orders</span> — no more “I forgot this order” or “I didn’t see the message”.
                                </p>
                            </div>
                            <div className="flex items-start gap-3">
                                <span className="mt-1 w-2 h-2 rounded-full bg-[#22C55E] flex-shrink-0" />
                                <p className="leading-relaxed">
                                    Send <span className="font-bold">payment links</span>, confirm payment faster, and keep receipts/records clean for every sale.
                                </p>
                            </div>
                            <div className="flex items-start gap-3">
                                <span className="mt-1 w-2 h-2 rounded-full bg-[#22C55E] flex-shrink-0" />
                                <p className="leading-relaxed">
                                    Manage <span className="font-bold">inventory & delivery</span> from one dashboard — from packing to dispatch updates.
                                </p>
                            </div>
                        </div>

                        {/* CTA Buttons */}
                        <div className="flex flex-col sm:flex-row gap-4 mb-8">
                            <a href={`${APP_URL}/signup`}>
                                <PremiumButton data-testid="landing-get-started" className="px-8 py-4">
                                    Start Selling for Free
                                </PremiumButton>
                            </a>
                            <Link href="/how-vayva-works">
                                <Button variant="outline" className="px-8 py-4 border-2 border-gray-200 text-[#0F172A] font-bold rounded-xl hover:bg-gray-50 flex items-center gap-2">
                                    <span className="w-2 h-2 bg-[#22C55E] rounded-full" />
                                    View Demo
                                </Button>
                            </Link>
                        </div>

                        {/* Trust Badges */}
                        <div className="flex flex-wrap items-center gap-6 text-sm text-[#64748B]">
                            <span className="flex items-center gap-2">
                                <CheckCircle2 className="w-4 h-4 text-[#22C55E]" />
                                No credit card required
                            </span>
                            <span className="flex items-center gap-2">
                                <span className="w-2 h-2 bg-[#22C55E] rounded-full" />
                                Built for African commerce (network-friendly)
                            </span>
                        </div>

                        <div className="mt-6 grid grid-cols-2 gap-3 max-w-xl md:grid-cols-4">
                            {controlPillars.map((p) => (
                                <div key={p.label} className="rounded-2xl border border-gray-100 bg-white px-4 py-3 shadow-sm">
                                    <div className="flex items-center gap-2">
                                        <div className="w-8 h-8 rounded-xl bg-green-50 flex items-center justify-center">
                                            <p.Icon className="w-4 h-4 text-[#22C55E]" />
                                        </div>
                                        <div className="text-xs font-bold text-slate-800">{p.label}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </motion.div>

                    {/* Right: Product Visual */}
                    <motion.div
                        initial={{ opacity: 0, x: 30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="relative"
                    >
                        <div className="relative rounded-3xl bg-white border border-gray-100 shadow-2xl overflow-hidden">
                            <div className="absolute inset-0 bg-gradient-to-br from-green-50 via-white to-blue-50" />
                            <div className="relative p-4 sm:p-6 lg:p-7">
                                <div className="flex items-center justify-between">
                                    <div className="text-[10px] font-black uppercase tracking-widest text-slate-500">Preview</div>
                                    <div className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-1 text-[11px] font-bold text-slate-700 border border-slate-200">
                                        <span className="w-1.5 h-1.5 bg-[#22C55E] rounded-full" />
                                        Storefront + Dashboard
                                    </div>
                                </div>

                                <div className="mt-5">
                                    <Image
                                        src="/images/mobile-showcase.png"
                                        alt="Vayva storefront preview"
                                        width={900}
                                        height={650}
                                        className="w-full h-auto object-contain"
                                        priority
                                    />
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
