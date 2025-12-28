
'use client';

import React from 'react';
import {
    Network,
    Workflow,
    ShieldCheck,
    Zap,
    Server,
    LifeBuoy,
    BookOpen,
    Settings,
    ArrowRight,
    Database,
    Cpu,
    Layers
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function OpsOverviewPage() {
    return (
        <div className="p-8 max-w-6xl mx-auto space-y-12">
            <div className="flex justify-between items-start">
                <div className="space-y-2">
                    <h1 className="text-4xl font-black tracking-tighter uppercase italic">Operational Overview</h1>
                    <p className="text-muted-foreground font-medium">Internal platform runbook and architecture documentation.</p>
                </div>
                <div className="px-4 py-2 bg-blue-50 border border-blue-100 rounded-lg flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
                    <span className="text-xs font-bold text-blue-700 uppercase tracking-widest">Environment: Staging</span>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <StatCard icon={Database} label="System Model" value="Prisma / PG" />
                <StatCard icon={Cpu} label="Workers" value="BullMQ / Redis" />
                <StatCard icon={Layers} label="Registry" value="34 Templates" />
                <StatCard icon={ShieldCheck} label="Security" value="RBAC / Sudo" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                <section className="space-y-6">
                    <h2 className="text-2xl font-bold flex items-center gap-3">
                        <Workflow className="w-6 h-6 text-primary" /> Merchant Lifecycle
                    </h2>
                    <div className="space-y-4">
                        <StepItem
                            num="01"
                            title="Onboarding"
                            desc="Registration -> Welcome -> Business Basics -> Template Select. Controlled by LAUNCH_MODE flag."
                        />
                        <StepItem
                            num="02"
                            title="Verification"
                            desc="BVN/NIN lookup via KycService. Results saved to KycRecord with immutable audit trail."
                        />
                        <StepItem
                            num="03"
                            title="Activation"
                            desc="Integration signals (WhatsApp/Paystack) trigger store publication. NotificationEngine alerts merchant."
                        />
                        <StepItem
                            num="04"
                            title="Operations"
                            desc="Order fulfillment, webhook processing, and automated dunning/payouts."
                        />
                    </div>
                </section>

                <section className="space-y-6">
                    <h2 className="text-2xl font-bold flex items-center gap-3">
                        <Server className="w-6 h-6 text-primary" /> System Architecture
                    </h2>
                    <Card className="p-8 bg-slate-50 border-2 border-dashed flex items-center justify-center min-h-[300px]">
                        <div className="text-center space-y-4">
                            <Layers className="w-12 h-12 text-slate-200 mx-auto" />
                            <p className="text-sm text-slate-400 font-medium max-w-[200px] mx-auto italic">
                                [Mermaid Diagram Placeholder]<br />
                                App -{'>'} Shared lib -{'>'} DB -{'>'} Workers
                            </p>
                            <Button variant="outline" size="sm" className="font-bold">View Source Graph</Button>
                        </div>
                    </Card>
                </section>
            </div>

            <div className="space-y-6">
                <h2 className="text-2xl font-bold flex items-center gap-3">
                    <LifeBuoy className="w-6 h-6 text-primary" /> Quick Resolution Guides
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <Card className="p-6 space-y-3">
                        <h4 className="font-bold text-sm">Webhook Failures</h4>
                        <p className="text-xs text-muted-foreground leading-relaxed">If Paystack webhooks fail verification, check PAYSTACK_SECRET_KEY rotation in Vercel.</p>
                        <Link href="/ops/audit-logs"><Button variant="link" className="p-0 h-auto text-[10px] font-bold">Inspect Trace Logs <ArrowRight className="w-3 h-3 ml-1" /></Button></Link>
                    </Card>
                    <Card className="p-6 space-y-3">
                        <h4 className="font-bold text-sm">KYC Mismatches</h4>
                        <p className="text-xs text-muted-foreground leading-relaxed">Name matching logic (fuzzy) can be overridden by Ops for valid ID cases with typos.</p>
                        <Link href="/ops/kyc"><Button variant="link" className="p-0 h-auto text-[10px] font-bold">Override KYC <ArrowRight className="w-3 h-3 ml-1" /></Button></Link>
                    </Card>
                    <Card className="p-6 space-y-3">
                        <h4 className="font-bold text-sm">Payout Blocks</h4>
                        <p className="text-xs text-muted-foreground leading-relaxed">Check for SECURITY_LOCK if user updated banking details. Requires Sudo to clear.</p>
                        <Link href="/ops/merchants"><Button variant="link" className="p-0 h-auto text-[10px] font-bold">Clear Locks <ArrowRight className="w-3 h-3 ml-1" /></Button></Link>
                    </Card>
                </div>
            </div>

            <div className="pt-12 border-t flex items-center justify-between">
                <div className="flex gap-8">
                    <Link href="/ops/audit-logs" className="text-xs font-bold text-muted-foreground hover:text-primary tracking-widest uppercase italic">Audit Suite</Link>
                    <Link href="/ops/jobs" className="text-xs font-bold text-muted-foreground hover:text-primary tracking-widest uppercase italic">Worker Monitor</Link>
                    <Link href="/ops/settings" className="text-xs font-bold text-muted-foreground hover:text-primary tracking-widest uppercase italic">System Settings</Link>
                </div>
                <p className="text-[10px] font-bold text-slate-300">© 2025 Vayva Engineering</p>
            </div>
        </div>
    );
}

function StatCard({ icon: Icon, label, value }: any) {
    return (
        <Card className="p-6 space-y-2 border-slate-100 shadow-none bg-slate-50/50">
            <div className="flex items-center gap-2 text-primary">
                <Icon className="w-4 h-4" />
                <span className="text-[10px] font-black uppercase tracking-[0.15em]">{label}</span>
            </div>
            <div className="text-xl font-bold tracking-tight">{value}</div>
        </Card>
    );
}

function StepItem({ num, title, desc }: any) {
    return (
        <div className="flex gap-4 group">
            <div className="text-2xl font-black text-slate-100 group-hover:text-primary/10 transition-colors tabular-nums">{num}</div>
            <div className="space-y-1">
                <h4 className="font-bold text-sm">{title}</h4>
                <p className="text-xs text-muted-foreground leading-relaxed">{desc}</p>
            </div>
        </div>
    );
}
