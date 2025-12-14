'use client';

import React from 'react';
import Link from 'next/link';
import { StoreShell } from '@/components/storefront/store-shell';
import { Button } from '@/components/ui/button';
import { Icon } from '@/components/ui/icon';

export default function OrderConfirmationPage({ params }: { params: { slug: string } }) {
    return (
        <StoreShell slug={params.slug}>
            <div className="max-w-3xl mx-auto px-4 py-16 text-center">
                <div className="w-20 h-20 bg-state-success rounded-full flex items-center justify-center text-black mx-auto mb-6">
                    <Icon name="check" size={40} />
                </div>

                <h1 className="text-3xl font-bold text-white mb-2">Order Confirmed!</h1>
                <p className="text-text-secondary mb-8">Thank you for shopping with us. Your order <span className="text-white font-mono">#VV-90123</span> has been received.</p>

                <div className="bg-white/5 rounded-2xl border border-white/5 p-6 mb-8 text-left">
                    <h3 className="font-bold text-white mb-4 border-b border-white/5 pb-2">Order Details</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
                        <div>
                            <div className="text-text-secondary mb-1">Contact</div>
                            <div className="text-white">chidinma@example.com</div>
                            <div className="text-white">+234 812 345 6789</div>
                        </div>
                        <div>
                            <div className="text-text-secondary mb-1">Shipping Address</div>
                            <div className="text-white">12 Lekki Phase 1</div>
                            <div className="text-white">Lagos, Nigeria</div>
                        </div>
                        <div>
                            <div className="text-text-secondary mb-1">Payment Method</div>
                            <div className="text-white flex items-center gap-2"><Icon name="credit_card" size={14} /> Ending in 4242</div>
                        </div>
                        <div>
                            <div className="text-text-secondary mb-1">Expected Delivery</div>
                            <div className="text-state-success font-bold">Tomorrow, 12PM - 4PM</div>
                        </div>
                    </div>
                </div>

                <div className="flex gap-4 justify-center">
                    <Link href={`/store/${params.slug}/track`}>
                        <Button variant="outline" className="border-white/10 text-white hover:bg-white/5">Track Order</Button>
                    </Link>
                    <Link href={`/store/${params.slug}/collections/all`}>
                        <Button className="bg-primary text-black hover:bg-primary/90">Continue Shopping</Button>
                    </Link>
                </div>

                <div className="mt-12 p-4 bg-emerald-500/10 rounded-xl border border-emerald-500/20 max-w-lg mx-auto">
                    <div className="flex items-center gap-3 justify-center mb-2">
                        <Icon name="chat" className="text-emerald-400" />
                        <span className="font-bold text-emerald-400">Need updates?</span>
                    </div>
                    <p className="text-emerald-200/70 text-sm mb-3">Get real-time delivery updates on WhatsApp.</p>
                    <Button size="sm" className="bg-emerald-600 text-white hover:bg-emerald-500 border-none rounded-full">Enable WhatsApp Updates</Button>
                </div>
            </div>
        </StoreShell>
    );
}
