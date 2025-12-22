'use client';

import React from 'react';
import { AdminShell } from '@/components/admin-shell';
import { GlassPanel } from '@vayva/ui';
import { AnalyticsFilterBar } from '@/components/analytics-filter-bar';
import { Icon } from '@vayva/ui';

export default function ConversionFunnelPage() {
    return (
        <AdminShell title="Conversion Funnel" breadcrumb="Analytics / Conversions">
            <div className="flex flex-col gap-6">
                <AnalyticsFilterBar />

                <GlassPanel className="p-8">
                    <div className="flex flex-col items-center max-w-3xl mx-auto space-y-4">

                        {/* Step 1 */}
                        <div className="w-full">
                            <div className="flex justify-between text-sm font-bold text-white mb-2">
                                <span>Product Views</span>
                                <span>4,521</span>
                            </div>
                            <div className="h-12 bg-white/10 rounded-lg w-full relative group">
                                <div className="absolute inset-y-0 left-0 bg-primary/20 rounded-lg w-full" />
                                <div className="absolute inset-y-0 left-0 flex items-center px-4 text-xs font-bold text-primary">100%</div>
                            </div>
                        </div>

                        <Icon name={"ArrowDown" as any} className="text-white/20" />

                        {/* Step 2 */}
                        <div className="w-full">
                            <div className="flex justify-between text-sm font-bold text-white mb-2">
                                <span>Add to Cart</span>
                                <span>850</span>
                            </div>
                            <div className="h-12 bg-white/5 rounded-lg w-[80%] relative mx-auto group">
                                <div className="absolute inset-y-0 left-0 bg-primary/30 rounded-lg w-full" />
                                <div className="absolute inset-y-0 left-0 flex items-center px-4 text-xs font-bold text-white">18.8% of views</div>
                                <div className="absolute right-[-100px] top-3 text-xs text-state-danger font-bold">-81% dropoff</div>
                            </div>
                        </div>

                        <Icon name={"ArrowDown" as any} className="text-white/20" />

                        {/* Step 3 */}
                        <div className="w-full">
                            <div className="flex justify-between text-sm font-bold text-white mb-2">
                                <span>Checkout Started</span>
                                <span>420</span>
                            </div>
                            <div className="h-12 bg-white/5 rounded-lg w-[60%] relative mx-auto group">
                                <div className="absolute inset-y-0 left-0 bg-primary/40 rounded-lg w-full" />
                                <div className="absolute inset-y-0 left-0 flex items-center px-4 text-xs font-bold text-white">49% of carts</div>
                            </div>
                        </div>

                        <Icon name={"ArrowDown" as any} className="text-white/20" />

                        {/* Step 4 */}
                        <div className="w-full">
                            <div className="flex justify-between text-sm font-bold text-white mb-2">
                                <span>Purchase</span>
                                <span>142</span>
                            </div>
                            <div className="h-12 bg-white/5 rounded-lg w-[40%] relative mx-auto group">
                                <div className="absolute inset-y-0 left-0 bg-primary rounded-lg w-full" />
                                <div className="absolute inset-y-0 left-0 flex items-center px-4 text-xs font-bold text-black">33% conversion</div>
                            </div>
                        </div>
                    </div>
                </GlassPanel>

                <div className="p-4 rounded-xl bg-white/5 border border-white/5 flex gap-4 items-start">
                    <Icon name={"Lightbulb" as any} className="text-primary mt-1" />
                    <div>
                        <h3 className="font-bold text-white text-sm">Optimization Tip</h3>
                        <p className="text-xs text-text-secondary">
                            High drop-off between Cart and Checkout. Consider enabling "WhatsApp Checkout" to simplify the process for mobile users.
                        </p>
                    </div>
                </div>
            </div>
        </AdminShell>
    );
}
