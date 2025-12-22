'use client';

import React from 'react';
import { Button, GlassPanel, Icon, Input } from '@vayva/ui';

export default function BillingPage() {
    return (
        <div className="space-y-6 max-w-4xl">
            <GlassPanel className="p-6">
                <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-bold text-white">Payment Method</h3>
                    <Button variant="outline" size="sm">Update Card</Button>
                </div>

                <div className="flex items-center gap-4 p-4 rounded-xl bg-white/5 border border-white/10">
                    <div className="w-12 h-8 bg-white/10 rounded flex items-center justify-center">
                        <span className="font-bold text-xs text-white">VISA</span>
                    </div>
                    <div>
                        <p className="text-white font-medium">•••• •••• •••• 4242</p>
                        <p className="text-sm text-text-secondary">Expires 12/2025</p>
                    </div>
                    <div className="ml-auto">
                        <span className="text-xs bg-green-500/10 text-green-500 px-2 py-1 rounded-full font-medium">Default</span>
                    </div>
                </div>

                <div className="mt-8 flex items-center gap-2 text-text-secondary text-sm">
                    <Icon name={"Shield" as any} size={14} />
                    <span>Payments are secured by Paystack</span>
                </div>
            </GlassPanel>

            <GlassPanel className="p-6">
                <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-bold text-white">Billing Details</h3>
                    <Button variant="outline" size="sm">Edit Details</Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="text-xs text-text-secondary uppercase font-bold tracking-wider">Company Name</label>
                        <p className="text-white mt-1">Acme Corp Ltd</p>
                    </div>
                    <div>
                        <label className="text-xs text-text-secondary uppercase font-bold tracking-wider">Email for Invoices</label>
                        <p className="text-white mt-1">billing@acme.com</p>
                    </div>
                    <div>
                        <label className="text-xs text-text-secondary uppercase font-bold tracking-wider">Address</label>
                        <p className="text-white mt-1">123 Business Road, Lagos, Nigeria</p>
                    </div>
                    <div>
                        <label className="text-xs text-text-secondary uppercase font-bold tracking-wider">Tax ID</label>
                        <p className="text-white mt-1">TIN-12345678</p>
                    </div>
                </div>
            </GlassPanel>
        </div>
    );
}
