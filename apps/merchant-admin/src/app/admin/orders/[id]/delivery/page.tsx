'use client';

import React from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { AppShell } from '@vayva/ui';
import { GlassPanel } from '@vayva/ui';
import { Button } from '@vayva/ui';
import { Input } from '@vayva/ui';
import { Icon } from '@vayva/ui';

export default function CreateDeliveryTaskPage() {
    const params = useParams();
    const router = useRouter();
    const id = params.id as string;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Simulate API call
        router.push(`/admin/orders/${id}`);
    };

    return (
        <AppShell sidebar={<></>} header={<></>}>
            <div className="flex flex-col gap-6 max-w-5xl mx-auto">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-white">Create Delivery Task</h1>
                        <p className="text-text-secondary">Order {id} • Chinedu Okafor</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Left: Form */}
                    <GlassPanel className="md:col-span-2 p-8">
                        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-xs text-text-secondary uppercase font-bold tracking-wider mb-2 block">Method</label>
                                    <div className="flex p-1 bg-white/5 rounded-full border border-white/10">
                                        <button type="button" className="flex-1 py-2 rounded-full bg-primary text-background-dark font-bold text-sm shadow-lg">Delivery</button>
                                        <button type="button" className="flex-1 py-2 rounded-full text-text-secondary text-sm font-medium hover:text-white">Pickup</button>
                                    </div>
                                </div>
                                <div>
                                    <label className="text-xs text-text-secondary uppercase font-bold tracking-wider mb-2 block">Fee (₦)</label>
                                    <Input defaultValue="1,500" readOnly className="bg-white/5 text-white/50 cursor-not-allowed" />
                                </div>
                            </div>

                            <div>
                                <label className="text-xs text-text-secondary uppercase font-bold tracking-wider mb-2 block">Delivery Window</label>
                                <div className="grid grid-cols-2 gap-4">
                                    <Input type="date" className="w-full" />
                                    <select className="h-12 w-full rounded-full bg-white/5 border border-white/10 px-4 text-white outline-none focus:border-primary">
                                        <option>Morning (9AM - 12PM)</option>
                                        <option>Afternoon (12PM - 4PM)</option>
                                        <option>Evening (4PM - 7PM)</option>
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label className="text-xs text-text-secondary uppercase font-bold tracking-wider mb-2 block">Assign To (Optional)</label>
                                <select className="h-12 w-full rounded-full bg-white/5 border border-white/10 px-4 text-white outline-none focus:border-primary">
                                    <option value="">Unassigned</option>
                                    <option value="1">Self (You)</option>
                                    <option value="2">Dispatch Rider A</option>
                                </select>
                            </div>

                            <div>
                                <label className="text-xs text-text-secondary uppercase font-bold tracking-wider mb-2 block">Notes for Rider</label>
                                <textarea
                                    className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-sm text-white resize-none focus:outline-none focus:border-primary transition-colors"
                                    rows={4}
                                    placeholder="Gate code, landmark, call before arrival..."
                                ></textarea>
                            </div>

                            <div className="pt-4 flex gap-4 border-t border-white/5">
                                <Button type="submit" className="flex-1">Create Task</Button>
                                <Button type="button" variant="ghost" onClick={() => router.back()}>Cancel</Button>
                            </div>
                        </form>
                    </GlassPanel>

                    {/* Right: Info */}
                    <div className="flex flex-col gap-6">
                        <GlassPanel className="p-6">
                            <h3 className="font-bold text-white mb-4 flex items-center gap-2">
                                <Icon name={"MapPin" as any} size={20} className="text-primary" />
                                Destination
                            </h3>
                            <p className="text-white font-medium mb-1">12 Admiralty Way</p>
                            <p className="text-text-secondary text-sm">Lekki Phase 1, Lagos</p>
                            <div className="mt-4 pt-4 border-t border-white/5 flex gap-2">
                                <Button size="sm" variant="outline" className="w-full text-xs">View on Map</Button>
                                <Button size="sm" variant="outline" className="w-full text-xs">Copy</Button>
                            </div>
                        </GlassPanel>

                        <GlassPanel className="p-6">
                            <h3 className="font-bold text-white mb-4">Items to Deliver</h3>
                            <div className="flex flex-col gap-3">
                                <div className="flex justify-between text-sm">
                                    <span className="text-white">1x Nike Air Max 90</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-white">2x White Sports Socks</span>
                                </div>
                            </div>
                        </GlassPanel>
                    </div>
                </div>
            </div>
        </AppShell>
    );
}
