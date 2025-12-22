'use client';

import React from 'react';
import Link from 'next/link';
import { StoreShell } from '@/components/storefront/store-shell';
import { Button , Icon } from '@vayva/ui';

export default function CartPage({ params }: { params: { slug: string } }) {
    return (
        <StoreShell slug={params.slug}>
            <div className="max-w-7xl mx-auto px-4 py-8 md:py-16">
                <h1 className="text-3xl font-bold text-white mb-8">Shopping Cart</h1>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">

                    {/* Items List */}
                    <div className="lg:col-span-2 space-y-6">
                        {[1, 2].map((item) => (
                            <div key={item} className="flex gap-4 p-4 rounded-xl bg-white/5 border border-white/5">
                                <div className="w-24 h-24 bg-white/5 rounded-lg flex items-center justify-center shrink-0">
                                    <Icon name="Image" className="text-white/20" size={32} />
                                </div>
                                <div className="flex-1 flex flex-col justify-between">
                                    <div>
                                        <div className="flex justify-between items-start mb-1">
                                            <h3 className="font-bold text-white">Premium Cotton Tee</h3>
                                            <button className="text-text-secondary hover:text-state-danger"><Icon name="X" size={18} /></button>
                                        </div>
                                        <p className="text-sm text-text-secondary">Size: M • Color: Black</p>
                                    </div>
                                    <div className="flex justify-between items-end">
                                        <div className="flex items-center gap-3">
                                            <div className="flex items-center bg-white/5 border border-white/10 rounded-full h-8 px-2">
                                                <button className="w-6 h-full flex items-center justify-center text-white/50 hover:text-white"><Icon name="Minus" size={14} /></button>
                                                <span className="w-6 text-center text-xs text-white font-bold">1</span>
                                                <button className="w-6 h-full flex items-center justify-center text-white/50 hover:text-white"><Icon name="Plus" size={14} /></button>
                                            </div>
                                        </div>
                                        <div className="font-bold text-white">₦ 12,000</div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Summary Panel */}
                    <div>
                        <div className="p-6 rounded-2xl bg-white/5 border border-white/5 sticky top-24">
                            <h2 className="font-bold text-white text-lg mb-6">Order Summary</h2>

                            <div className="space-y-4 mb-6 border-b border-white/10 pb-6">
                                <div className="flex justify-between text-sm">
                                    <span className="text-text-secondary">Subtotal</span>
                                    <span className="text-white font-medium">₦ 24,000</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-text-secondary">Shipping</span>
                                    <span className="text-text-secondary italic">Calculated at checkout</span>
                                </div>
                            </div>

                            <div className="flex justify-between items-end mb-6">
                                <span className="font-bold text-white">Total</span>
                                <div className="text-right">
                                    <span className="text-2xl font-bold text-white block">₦ 24,000</span>
                                    <span className="text-xs text-text-secondary">Including VAT</span>
                                </div>
                            </div>

                            <Link href={`/store/${params.slug}/checkout`}>
                                <Button className="w-full h-12 rounded-full bg-primary text-black hover:bg-primary/90 font-bold mb-3">
                                    Checkout
                                </Button>
                            </Link>
                            <Link href={`/store/${params.slug}/collections/all`}>
                                <Button variant="ghost" className="w-full text-text-secondary hover:text-white">Continue Shopping</Button>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </StoreShell>
    );
}
