
'use client';

import React from 'react';
import {
    HelpCircle,
    ShieldCheck,
    CreditCard,
    RefreshCw,
    Mail,
    MessageSquare,
    ExternalLink,
    LifeBuoy,
    FileText,
    AlertCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import Link from 'next/link';

export default function HelpPage() {
    return (
        <div className="p-6 max-w-5xl mx-auto space-y-8">
            <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tight">Help & Support</h1>
                <p className="text-muted-foreground">Get assistance with your store, identity verification, and platform integrations.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="p-6 space-y-4 hover:border-primary/50 transition-colors">
                    <div className="p-2 bg-primary/10 rounded-lg w-fit">
                        <ShieldCheck className="w-5 h-5 text-primary" />
                    </div>
                    <h3 className="font-bold">Identity Verification</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                        KYC failed or pending? Re-submit your BVN/NIN for instant verification.
                    </p>
                    <Link href="/admin/account/compliance-kyc" className="block">
                        <Button variant="outline" size="sm" className="w-full gap-2 font-semibold">
                            Verify Identity <ExternalLink className="w-3 h-3" />
                        </Button>
                    </Link>
                </Card>

                <Card className="p-6 space-y-4 hover:border-primary/50 transition-colors">
                    <div className="p-2 bg-primary/10 rounded-lg w-fit">
                        <CreditCard className="w-5 h-5 text-primary" />
                    </div>
                    <h3 className="font-bold">Payout Details</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                        Funds not arriving? Update your settlement bank account to resume payouts.
                    </p>
                    <Link href="/admin/settings/payouts" className="block">
                        <Button variant="outline" size="sm" className="w-full gap-2 font-semibold">
                            Update Banking <ExternalLink className="w-3 h-3" />
                        </Button>
                    </Link>
                </Card>

                <Card className="p-6 space-y-4 hover:border-primary/50 transition-colors">
                    <div className="p-2 bg-primary/10 rounded-lg w-fit">
                        <RefreshCw className="w-5 h-5 text-primary" />
                    </div>
                    <h3 className="font-bold">Integrations</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                        Webhooks disconnected? Reconnect your WhatsApp or Payment provider.
                    </p>
                    <Link href="/admin/status" className="block">
                        <Button variant="outline" size="sm" className="w-full gap-2 font-semibold">
                            Check Connection <ExternalLink className="w-3 h-3" />
                        </Button>
                    </Link>
                </Card>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-6">
                    <h2 className="text-xl font-bold flex items-center gap-2">
                        <LifeBuoy className="w-5 h-5 text-muted-foreground" /> Common Issues
                    </h2>
                    <div className="space-y-4">
                        {[
                            { q: "Why is my store still on the 'Free' plan?", a: "Billing cycles refresh at the start of the month. Check your 'Invoices' section for status." },
                            { q: "Can I use multiple WhatsApp numbers?", a: "Currently, Vayva supports one primary number per store for automated workflows." },
                            { q: "What documents are required for KYC?", a: "A valid BVN or NIN is mandatory for all merchants to receive payouts." }
                        ].map((faq, i) => (
                            <div key={i} className="space-y-1">
                                <h4 className="font-semibold text-sm">{faq.q}</h4>
                                <p className="text-xs text-muted-foreground leading-relaxed">{faq.a}</p>
                            </div>
                        ))}
                    </div>
                    <Button variant="link" className="p-0 h-auto text-xs font-bold text-primary">
                        View Full Documentation <ExternalLink className="w-3 h-3 ml-1" />
                    </Button>
                </div>

                <Card className="p-8 bg-slate-50 dark:bg-slate-900 border-2 border-dashed space-y-6">
                    <div className="text-center space-y-2">
                        <h2 className="text-xl font-bold">Contact Support</h2>
                        <p className="text-sm text-muted-foreground">Need a human? We're available 9am - 6pm (WAT).</p>
                    </div>

                    <div className="grid grid-cols-1 gap-4">
                        <Button className="h-12 gap-2 bg-slate-900 dark:bg-slate-50 dark:text-slate-900" onClick={() => window.location.href = 'mailto:support@vayva.com'}>
                            <Mail className="w-4 h-4" /> Email support@vayva.com
                        </Button>
                        <Button className="h-12 gap-2 bg-green-600 hover:bg-green-700 text-white border-0 shadow-lg" onClick={() => window.location.href = 'https://wa.me/vayva-support'}>
                            <MessageSquare className="w-4 h-4 text-white fill-white" /> WhatsApp Chat
                        </Button>
                    </div>

                    <div className="pt-4 border-t flex items-center justify-between text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                        <span>Platform Health</span>
                        <Link href="/status" className="flex items-center gap-1 text-green-600 hover:underline">
                            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" /> All Systems Operational
                        </Link>
                    </div>
                </Card>
            </div>

            <div className="flex justify-center gap-6 pt-4 text-xs text-muted-foreground font-medium">
                <Link href="/legal/terms" className="hover:text-primary underline-offset-4 decoration-slate-200">Terms of Service</Link>
                <Link href="/legal/privacy" className="hover:text-primary underline-offset-4 decoration-slate-200">Privacy Policy</Link>
                <Link href="/legal/kyc-safety" className="hover:text-primary underline-offset-4 decoration-slate-200">Data Safety</Link>
            </div>
        </div>
    );
}
