"use client";

import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { Button, Card, Icon } from "@vayva/ui";
import { PLANS, formatNGN } from "@/config/pricing";
import { toast } from "sonner";

export default function TrialExpiredPage() {
    const { data: session } = useSession();
    const [stats, setStats] = useState({ products: 0, leads: 0 });
    const [isLoading, setIsLoading] = useState(true);
    const [isProcessing, setIsProcessing] = useState<string | null>(null);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const res = await fetch("/api/billing/subscription");
                const data = await res.json();
                // Simulating stat fetch if not in subscription API
                setStats({
                    products: data.usage?.products || 0,
                    leads: data.usage?.leads || 0,
                });
            } catch (error) {
                console.error("Failed to fetch trial stats", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchStats();
    }, []);

    const handleUpgrade = async (planKey: string) => {
        setIsProcessing(planKey);
        try {
            const res = await fetch("/api/billing/subscription", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ newPlan: planKey.toUpperCase() }),
            });
            const data = await res.json();
            if (data.paymentUrl) {
                window.location.href = data.paymentUrl;
            } else {
                toast.error("Failed to initiate upgrade");
            }
        } catch (error) {
            toast.error("Error processing upgrade");
        } finally {
            setIsProcessing(null);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6">
            <div className="max-w-4xl w-full space-y-12 text-center">
                {/* Hero Section */}
                <div className="space-y-4">
                    <div className="inline-flex items-center justify-center w-20 h-20 bg-orange-100 rounded-full mb-4">
                        <Icon name="Lock" size={40} className="text-orange-600" />
                    </div>
                    <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">
                        Your trial has ended, but your progress is safe. 🛡️
                    </h1>
                    <p className="text-xl text-gray-500 max-w-2xl mx-auto">
                        Your store is currently paused. Upgrade now to keep your business live and continue growing.
                    </p>
                </div>

                {/* Value Recap Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto">
                    <Card className="p-6 bg-white border-2 border-gray-100 hover:border-black transition-all">
                        <div className="flex flex-col items-center gap-2">
                            <span className="text-3xl font-bold text-black">{isLoading ? "..." : stats.products}</span>
                            <span className="text-sm font-bold uppercase tracking-wider text-gray-400">Products Online</span>
                        </div>
                    </Card>
                    <Card className="p-6 bg-white border-2 border-gray-100 hover:border-black transition-all">
                        <div className="flex flex-col items-center gap-2">
                            <span className="text-3xl font-bold text-black">{isLoading ? "..." : stats.leads}</span>
                            <span className="text-sm font-bold uppercase tracking-wider text-gray-400">Leads Waiting ⏳</span>
                        </div>
                    </Card>
                </div>

                <div className="bg-blue-50 border border-blue-100 p-4 rounded-xl max-w-md mx-auto">
                    <p className="text-sm text-blue-800">
                        <strong>Scarcity Alert:</strong> Your customer leads are currently on hold and will be released immediately upon payment.
                    </p>
                </div>

                {/* Pricing Bridge */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12">
                    {PLANS.filter(p => p.key !== 'STARTER').map((plan) => (
                        <Card key={plan.key} className={`p-8 bg-white flex flex-col relative ${plan.key === 'PRO' ? 'border-2 border-black scale-105 z-10' : 'border border-gray-200'}`}>
                            {plan.key === 'PRO' && (
                                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-black text-white px-4 py-1 rounded-full text-xs font-bold uppercase tracking-widest shadow-lg">
                                    Best for Growth & Team
                                </div>
                            )}

                            <div className="mb-6">
                                <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                                <p className="text-gray-500 text-sm h-10">{plan.tagline}</p>
                            </div>

                            <div className="flex items-baseline gap-1 mb-8">
                                <span className="text-4xl font-extrabold text-black">{formatNGN(plan.monthlyAmount)}</span>
                                <span className="text-gray-400 font-medium">/month</span>
                            </div>

                            <ul className="space-y-4 mb-10 text-left flex-grow">
                                {plan.bullets.map((bullet, i) => (
                                    <li key={i} className="flex items-start gap-3 text-sm text-gray-600">
                                        <Icon name="CheckCircle2" size={18} className="text-green-500 flex-shrink-0 mt-0.5" />
                                        <span>{bullet}</span>
                                    </li>
                                ))}
                                {plan.key === 'PRO' && (
                                    <li className="flex items-start gap-3 text-sm text-black font-bold">
                                        <Icon name="Sparkles" size={18} className="text-orange-500 flex-shrink-0 mt-0.5" />
                                        <span>Includes Vayva Cut Pro</span>
                                    </li>
                                )}
                            </ul>

                            <Button
                                className={`w-full h-14 text-lg font-bold rounded-xl transition-transform active:scale-95 ${plan.key === 'PRO' ? 'bg-black text-white hover:bg-gray-900 shadow-xl' : 'bg-white text-black border-2 border-gray-200 hover:border-black'}`}
                                onClick={() => handleUpgrade(plan.key)}
                                isLoading={isProcessing === plan.key}
                            >
                                Pay Now & Unlock
                            </Button>
                        </Card>
                    ))}
                </div>

                <div className="pt-12">
                    <p className="text-gray-400 text-sm">
                        Secure payment via Paystack. Your data is encrypted and safe.
                    </p>
                </div>
            </div>
        </div>
    );
}
