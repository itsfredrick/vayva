'use client';

import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Icon } from '@/components/ui/icon';

export default function MarketCheckoutPage() {
    return (
        <div className="min-h-screen bg-[#142210] text-white">
            <header className="border-b border-white/5 bg-[#142210]">
                <div className="max-w-5xl mx-auto px-4 h-20 flex items-center justify-between">
                    <Link href="/market" className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-emerald-600 flex items-center justify-center text-black font-bold">V</div>
                        <span className="font-bold text-lg hidden md:block">Vayva Market</span>
                    </Link>
                    <div className="flex items-center gap-2 text-sm text-text-secondary">
                        <Icon name="lock" size={14} /> Secure with Vayva Escrow
                    </div>
                </div>
            </header>

            <main className="max-w-5xl mx-auto px-4 py-8 grid grid-cols-1 md:grid-cols-2 gap-12">

                {/* Form */}
                <div className="space-y-8">
                    {/* Delivery */}
                    <section>
                        <h2 className="font-bold text-white text-lg mb-4 flex items-center gap-2">
                            <span className="w-6 h-6 rounded-full bg-primary/20 text-primary flex items-center justify-center text-xs">1</span>
                            Delivery Details
                        </h2>
                        <div className="grid grid-cols-2 gap-4">
                            <input className="col-span-2 bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary placeholder:text-text-secondary/50" placeholder="Full name" />
                            <input className="col-span-2 bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary placeholder:text-text-secondary/50" placeholder="Address" />
                            <input className="bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary placeholder:text-text-secondary/50" placeholder="State" />
                            <input className="bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary placeholder:text-text-secondary/50" placeholder="Phone" />
                        </div>
                        <div className="mt-4 p-3 bg-indigo-500/10 border border-indigo-500/20 rounded-lg text-xs text-indigo-300 flex items-center gap-2">
                            <Icon name="local_shipping" size={16} />
                            <span>Fulfilled by <strong>TechDepot</strong>. Tracking available after payment.</span>
                        </div>
                    </section>

                    {/* Payment */}
                    <section>
                        <h2 className="font-bold text-white text-lg mb-4 flex items-center gap-2">
                            <span className="w-6 h-6 rounded-full bg-primary/20 text-primary flex items-center justify-center text-xs">2</span>
                            Payment
                        </h2>
                        <div className="space-y-3">
                            <div className="flex items-center justify-between p-4 rounded-xl border border-primary/50 bg-primary/5 cursor-pointer">
                                <div className="flex items-center gap-3">
                                    <Icon name="credit_card" className="text-primary" />
                                    <span className="font-bold text-white">Pay with Card</span>
                                </div>
                                <Icon name="check_circle" className="text-primary" />
                            </div>
                            <div className="flex items-center justify-between p-4 rounded-xl border border-white/10 bg-white/5 cursor-pointer hover:bg-white/10">
                                <div className="flex items-center gap-3">
                                    <Icon name="account_balance" className="text-text-secondary" />
                                    <span className="font-bold text-white/70">Bank Transfer</span>
                                </div>
                            </div>
                        </div>
                        <div className="mt-4 flex items-center gap-2">
                            <input type="checkbox" id="wa" className="accent-primary" defaultChecked />
                            <label htmlFor="wa" className="text-sm text-text-secondary cursor-pointer">Receive order updates on WhatsApp</label>
                        </div>
                    </section>

                    <Link href="/market/order-confirmation">
                        <Button size="lg" className="w-full rounded-full bg-primary text-black hover:bg-primary/90 font-bold h-12 shadow-[0_0_20px_rgba(70,236,19,0.2)]">
                            Pay securely ₦ 3,501,500
                        </Button>
                    </Link>
                    <p className="text-center text-xs text-text-secondary">
                        Vayva holds your payment until the order is confirmed by the seller.
                    </p>
                </div>

                {/* Summary */}
                <div className="bg-white/5 rounded-2xl p-6 h-fit border border-white/5">
                    <div className="flex items-center gap-2 mb-6 pb-6 border-b border-white/10">
                        <div className="w-8 h-8 rounded-full bg-indigo-500 flex items-center justify-center text-white font-bold text-xs">T</div>
                        <span className="font-bold text-white text-sm">TechDepot</span>
                        <Icon name="verified" className="text-blue-400" size={14} />
                    </div>

                    <div className="flex gap-4 mb-6">
                        <div className="w-16 h-16 bg-[#0b141a] rounded-lg border border-white/5 relative flex items-center justify-center">
                            <Icon name="computer" size={24} className="text-white/20" />
                            <span className="absolute -top-2 -right-2 w-5 h-5 bg-white/20 rounded-full flex items-center justify-center text-[10px] font-bold text-white">1</span>
                        </div>
                        <div className="flex-1">
                            <h4 className="text-sm font-bold text-white">MacBook Pro M3 Max</h4>
                            <p className="text-xs text-text-secondary">Space Black • 1TB</p>
                        </div>
                        <div className="text-sm font-bold text-white">₦ 3.5M</div>
                    </div>

                    <div className="space-y-2 mb-6 text-sm pt-4 border-t border-white/10">
                        <div className="flex justify-between">
                            <span className="text-text-secondary">Subtotal</span>
                            <span className="text-white">₦ 3,500,000</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-text-secondary">Delivery</span>
                            <span className="text-white">₦ 1,000</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-text-secondary">Protection Fee</span>
                            <span className="text-white">₦ 500</span>
                        </div>
                    </div>
                    <div className="flex justify-between items-center border-t border-white/10 pt-4">
                        <span className="font-bold text-white">Total Pay</span>
                        <span className="text-2xl font-bold text-white">₦ 3,501,500</span>
                    </div>
                </div>

            </main>
        </div>
    );
}
