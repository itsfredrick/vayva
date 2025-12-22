'use client';

import React from 'react';
import Link from 'next/link';
import { MarketShell } from '@/components/market/market-shell';
import { Button } from '@vayva/ui';
import { Icon } from '@vayva/ui';

export default function MarketCartPage() {
    return (
        <MarketShell>
            <div className="max-w-[1200px] mx-auto px-4 lg:px-6 py-8 md:py-16">
                <h1 className="text-3xl font-bold text-white mb-8">Your Cart</h1>

                {/* Single Seller Notice */}
                <div className="mb-6 p-4 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-start gap-3">
                    <Icon name="Store" className="text-indigo-400 mt-1" />
                    <div>
                        <h4 className="font-bold text-indigo-400 text-sm">Selling by TechDepot</h4>
                        <p className="text-xs text-indigo-200/70">
                            You are purchasing items from <strong>TechDepot</strong>. Marketplace carts can only contain items from one seller at a time.
                        </p>
                    </div>
                    <Link href="/market/sellers/techdepot" className="ml-auto text-xs font-bold text-indigo-400 hover:text-indigo-300">View Profile</Link>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                    <div className="lg:col-span-2 space-y-4">
                        {[1].map((item) => (
                            <div key={item} className="flex gap-4 p-4 rounded-xl bg-white/5 border border-white/5">
                                <div className="w-24 h-24 bg-[#0b141a] rounded-lg flex items-center justify-center shrink-0 border border-white/5">
                                    <Icon name={"CircleHelp" as any} size={14} className="text-gray-400" />
                                </div>
                                <div className="flex-1 flex flex-col justify-between">
                                    <div>
                                        <div className="flex justify-between items-start mb-1">
                                            <h3 className="font-bold text-white">MacBook Pro M3 Max</h3>
                                            <button className="text-text-secondary hover:text-state-danger"><Icon name={"CircleHelp" as any} size={16} /> Need help with this order?</button>
                                        </div>
                                        <p className="text-sm text-text-secondary">Space Black • 1TB</p>
                                    </div>
                                    <div className="flex justify-between items-end">
                                        <div className="flex items-center gap-3">
                                            <div className="flex items-center bg-white/5 border border-white/10 rounded-full h-8 px-2">
                                                <button className="w-6 h-full flex items-center justify-center text-white/50 hover:text-white"><Icon name="Minus" size={14} /></button>
                                                <span className="w-6 text-center text-xs text-white font-bold">1</span>
                                                <button className="w-6 h-full flex items-center justify-center text-white/50 hover:text-white"><Icon name="Plus" size={14} /></button>
                                            </div>
                                        </div>
                                        <div className="font-bold text-white">₦ 3,500,000</div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div>
                        <div className="p-6 rounded-2xl bg-white/5 border border-white/5 sticky top-24">
                            <h2 className="font-bold text-white text-lg mb-6">Summary</h2>

                            <div className="space-y-2 mb-6 border-b border-white/10 pb-6 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-text-secondary">Subtotal</span>
                                    <span className="text-white font-medium">₦ 3,500,000</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-text-secondary">Vayva Protection Fee</span>
                                    <span className="text-white font-medium">₦ 500</span>
                                </div>
                            </div>

                            <div className="flex justify-between items-end mb-6">
                                <span className="font-bold text-white">Total</span>
                                <div className="text-right">
                                    <span className="text-2xl font-bold text-white block">₦ 3,500,500</span>
                                    <span className="text-xs text-text-secondary">Excludes delivery</span>
                                </div>
                            </div>

                            <Link href="/market/checkout">
                                <Button className="w-full h-12 rounded-full bg-primary text-black hover:bg-primary/90 font-bold mb-3 shadow-[0_0_20px_rgba(70,236,19,0.2)]">
                                    Proceed to Checkout
                                </Button>
                            </Link>

                        </div>
                    </div>

                </div>
            </div>
        </MarketShell>
    );
}
