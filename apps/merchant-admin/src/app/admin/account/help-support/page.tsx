'use client';

import React from 'react';
import { GlassPanel, Button, Icon } from '@vayva/ui';

export default function HelpSupportPage() {
    return (
        <div className="space-y-6 max-w-4xl">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <GlassPanel className="p-6 text-center">
                    <div className="w-12 h-12 rounded-full bg-green-500/10 text-green-500 flex items-center justify-center mx-auto mb-4">
                        <Icon name={"MessageSquare" as any} size={24} />
                    </div>
                    <h3 className="text-white font-bold text-lg">WhatsApp Support</h3>
                    <p className="text-sm text-text-secondary mt-2 mb-6">Chat directly with our support team.</p>
                    <Button variant="primary" className="w-full">Start Chat</Button>
                </GlassPanel>

                <GlassPanel className="p-6 text-center">
                    <div className="w-12 h-12 rounded-full bg-blue-500/10 text-blue-500 flex items-center justify-center mx-auto mb-4">
                        <Icon name={"Mail" as any} size={24} />
                    </div>
                    <h3 className="text-white font-bold text-lg">Email Support</h3>
                    <p className="text-sm text-text-secondary mt-2 mb-6">Get help via email within 24 hours.</p>
                    <Button variant="outline" className="w-full">Send Email</Button>
                </GlassPanel>
            </div>

            <GlassPanel className="p-6">
                <h3 className="text-lg font-bold text-white mb-4">Frequently Asked Questions</h3>
                <div className="space-y-4">
                    <details className="group">
                        <summary className="flex items-center justify-between cursor-pointer list-none py-3 border-b border-white/5 text-sm font-medium text-white">
                            How do I get paid?
                            <Icon name={"ChevronDown" as any} className="transition-transform group-open:rotate-180" size={16} />
                        </summary>
                        <p className="text-text-secondary text-sm py-2">
                            Payouts are processed automatically to your connected bank account/wallet usually within 24 hours of settlement.
                        </p>
                    </details>
                    <details className="group">
                        <summary className="flex items-center justify-between cursor-pointer list-none py-3 border-b border-white/5 text-sm font-medium text-white">
                            How does the 4-day trial work?
                            <Icon name={"ChevronDown" as any} className="transition-transform group-open:rotate-180" size={16} />
                        </summary>
                        <p className="text-text-secondary text-sm py-2">
                            You have full access to the WhatsApp AI Agent for 4 days. After the trial, you'll need to upgrade to a Growth or Pro plan to continue using automation.
                        </p>
                    </details>
                    <details className="group">
                        <summary className="flex items-center justify-between cursor-pointer list-none py-3 border-b border-white/5 text-sm font-medium text-white">
                            Can I use my own domain?
                            <Icon name={"ChevronDown" as any} className="transition-transform group-open:rotate-180" size={16} />
                        </summary>
                        <p className="text-text-secondary text-sm py-2">
                            Yes! Custom domains are available as an add-on for Growth plans and included for free in Pro plans.
                        </p>
                    </details>
                </div>
            </GlassPanel>
        </div>
    );
}
