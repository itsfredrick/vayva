'use client';

import React, { useState } from 'react';
import { AdminShell } from '@/components/admin-shell';
import { GlassPanel } from '@/components/ui/glass-panel';
import { Button } from '@/components/ui/button';
import { Icon } from '@/components/ui/icon';

export default function DeliverySettingsPage() {
    const [offerDelivery, setOfferDelivery] = useState(true);
    const [offerPickup, setOfferPickup] = useState(false);
    const [isAddingZone, setIsAddingZone] = useState(false);

    return (
        <AdminShell title="Delivery & Shipping" breadcrumb="Settings / Delivery">
            <div className="flex flex-col gap-8 max-w-4xl mx-auto pb-20">
                {/* Sticky Header */}
                <div className="flex items-center justify-between sticky top-[80px] z-30 py-4 bg-[#142210]/95 backdrop-blur-xl border-b border-white/5 -mx-6 px-6 sm:mx-0 sm:px-0 sm:bg-transparent sm:border-none sm:backdrop-blur-none sm:static">
                    <div>
                        <h1 className="text-2xl font-bold text-white">Delivery Configuration</h1>
                        <p className="text-text-secondary text-sm">Manage how customers receive their orders.</p>
                    </div>
                    <div className="flex gap-2">
                        <Button variant="ghost">Discard</Button>
                        <Button>Save Changes</Button>
                    </div>
                </div>

                {/* Panel 1: Fulfillment Methods */}
                <div className="space-y-4">
                    <h2 className="text-xl font-bold text-white">Fulfillment Methods</h2>
                    <GlassPanel className="p-6 space-y-4">
                        <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg border border-white/5">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary">
                                    <Icon name="local_shipping" size={20} />
                                </div>
                                <div>
                                    <h3 className="font-bold text-white">Offer Delivery</h3>
                                    <p className="text-sm text-text-secondary">Customers can choose shipping at checkout.</p>
                                </div>
                            </div>
                            <input type="checkbox" className="toggle toggle-primary" checked={offerDelivery} onChange={(e) => setOfferDelivery(e.target.checked)} />
                        </div>

                        <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg border border-white/5">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary">
                                    <Icon name="storefront" size={20} />
                                </div>
                                <div>
                                    <h3 className="font-bold text-white">Offer Pickup</h3>
                                    <p className="text-sm text-text-secondary">Customers can pick up orders from your store.</p>
                                </div>
                            </div>
                            <input type="checkbox" className="toggle toggle-primary" checked={offerPickup} onChange={(e) => setOfferPickup(e.target.checked)} />
                        </div>

                        {!offerDelivery && !offerPickup && (
                            <div className="p-3 bg-state-danger/10 border border-state-danger/20 rounded-lg flex items-center gap-3">
                                <Icon name="warning" className="text-state-danger" />
                                <span className="text-state-danger font-bold text-sm">At least one option must be enabled.</span>
                            </div>
                        )}
                    </GlassPanel>
                </div>

                {/* Panel 2 & 3: Delivery Details (if enabled) */}
                {offerDelivery && (
                    <>
                        <div className="space-y-4 animate-in fade-in slide-in-from-top-4">
                            <h2 className="text-xl font-bold text-white">Delivery Fees</h2>
                            <GlassPanel className="p-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="text-xs text-text-secondary uppercase font-bold tracking-wider mb-2 block">Fee Model</label>
                                        <select className="w-full bg-white/5 border border-white/10 rounded-lg p-2 text-sm text-white focus:outline-none focus:border-primary mb-2">
                                            <option>Flat Fee</option>
                                            <option>Free over ₦X</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="text-xs text-text-secondary uppercase font-bold tracking-wider mb-2 block">Standard Fee (₦)</label>
                                        <input className="w-full bg-white/5 border border-white/10 rounded-lg p-2 text-sm text-white focus:outline-none focus:border-primary" defaultValue="2500" />
                                    </div>
                                    <div className="md:col-span-2">
                                        <label className="text-xs text-text-secondary uppercase font-bold tracking-wider mb-2 block">Typical Delivery Time</label>
                                        <input className="w-full bg-white/5 border border-white/10 rounded-lg p-2 text-sm text-white focus:outline-none focus:border-primary" defaultValue="Typically 1-2 business days" />
                                    </div>
                                </div>
                            </GlassPanel>
                        </div>

                        <div className="space-y-4 animate-in fade-in slide-in-from-top-4">
                            <div className="flex items-center justify-between">
                                <h2 className="text-xl font-bold text-white">Delivery Zones</h2>
                                <Button size="sm" variant="outline" onClick={() => setIsAddingZone(true)}>Add Zone</Button>
                            </div>
                            <GlassPanel className="p-0 overflow-hidden">
                                <table className="w-full text-left text-sm">
                                    <thead className="bg-white/5 text-text-secondary uppercase text-xs font-bold border-b border-white/5">
                                        <tr>
                                            <th className="p-4">Zone Name</th>
                                            <th className="p-4">Status</th>
                                            <th className="p-4">Fee Override</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-white/5">
                                        {[
                                            { name: 'Lagos Mainland', active: true, fee: 'Standard' },
                                            { name: 'Lagos Island', active: true, fee: 'Standard' },
                                            { name: 'Abuja (FCT)', active: true, fee: '₦ 4,500' },
                                        ].map((zone, i) => (
                                            <tr key={i} className="group hover:bg-white/5 transition-colors">
                                                <td className="p-4 font-bold text-white">{zone.name}</td>
                                                <td className="p-4">
                                                    <input type="checkbox" className="toggle toggle-xs toggle-primary" checked={zone.active} readOnly />
                                                </td>
                                                <td className="p-4 text-text-secondary">{zone.fee}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                                {isAddingZone && (
                                    <div className="p-4 bg-white/5 border-t border-white/5 animate-in fade-in">
                                        <div className="flex gap-2">
                                            <input placeholder="Zone Name (e.g. Port Harcourt)" className="flex-1 bg-black/20 border border-white/10 rounded-lg p-2 text-sm text-white focus:outline-none focus:border-primary" />
                                            <input placeholder="Fee Override (Optional)" className="w-32 bg-black/20 border border-white/10 rounded-lg p-2 text-sm text-white focus:outline-none focus:border-primary" />
                                            <Button size="sm" onClick={() => setIsAddingZone(false)}>Add</Button>
                                            <Button size="sm" variant="ghost" onClick={() => setIsAddingZone(false)}>Cancel</Button>
                                        </div>
                                    </div>
                                )}
                            </GlassPanel>
                        </div>
                    </>
                )}

                {/* Panel 4: Pickup Details (if enabled) */}
                {offerPickup && (
                    <div className="space-y-4 animate-in fade-in slide-in-from-top-4">
                        <h2 className="text-xl font-bold text-white">Pickup Settings</h2>
                        <GlassPanel className="p-6">
                            <div className="space-y-4">
                                <div>
                                    <label className="text-xs text-text-secondary uppercase font-bold tracking-wider mb-2 block">Pickup Address</label>
                                    <textarea className="w-full bg-white/5 border border-white/10 rounded-lg p-2 text-sm text-white focus:outline-none focus:border-primary min-h-[80px]" defaultValue="12 Admiralty Way, Lekki Phase 1, Lagos" />
                                </div>
                                <div>
                                    <label className="text-xs text-text-secondary uppercase font-bold tracking-wider mb-2 block">Instructions for Customer</label>
                                    <input className="w-full bg-white/5 border border-white/10 rounded-lg p-2 text-sm text-white focus:outline-none focus:border-primary" defaultValue="Call when you arrive at the gate." />
                                </div>
                            </div>
                        </GlassPanel>
                    </div>
                )}
            </div>
        </AdminShell>
    );
}
