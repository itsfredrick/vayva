
"use client";

import React from "react";
import { Button, Icon } from "@vayva/ui";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { TrendingUp, Users, DollarSign, ArrowRight, ShieldCheck, Zap } from "lucide-react";

export const MarketplaceMetrics = () => {
    return (
        <div className="bg-blue-50 border border-blue-100 rounded-xl p-6">
            <div className="flex items-center gap-3">
                <div className="bg-blue-100 p-2 rounded-lg">
                    <Zap className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                    <h3 className="font-semibold text-blue-900">Marketplace Coming Soon</h3>
                    <p className="text-sm text-blue-700 mt-1">
                        We're working on an exciting new marketplace experience. Stay tuned for updates!
                    </p>
                </div>
            </div>
        </div>
    );
};

export const OpsActionCards = ({ onAction }: { onAction: (route: string) => void }) => {
    const actions = [
        {
            title: "Vendor Management",
            description: "Approve, suspend, or invite new branch vendors.",
            icon: "Users",
            route: "/dashboard/ops-console/vendors",
            color: "bg-blue-600"
        },
        {
            title: "Commission Logs",
            description: "Track platform revenue from every vendor sale.",
            icon: "Percent",
            route: "/dashboard/ops-console/commissions",
            color: "bg-green-600"
        },
        {
            title: "Payout Terminal",
            description: "Manage settlements and bank transfers to partners.",
            icon: "CreditCard",
            route: "/dashboard/finance/payouts",
            color: "bg-purple-600"
        },
        {
            title: "Compliance & Safety",
            description: "Review flagged products or suspicious activity.",
            icon: "ShieldAlert",
            route: "/dashboard/ops-console/safety",
            color: "bg-orange-600"
        },
    ];

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {actions.map((action, i) => (
                <Card
                    key={i}
                    className="group hover:border-black transition-all cursor-pointer overflow-hidden border-gray-100"
                    onClick={() => onAction(action.route)}
                >
                    <div className="p-6 flex flex-col h-full">
                        <div className="flex items-center gap-4 mb-4">
                            <div className={`p-3 rounded-xl ${action.color} text-white shadow-lg shadow-black/10`}>
                                <Icon name={action.icon as any} size={20} />
                            </div>
                            <h3 className="font-black text-gray-900">{action.title}</h3>
                        </div>
                        <p className="text-sm text-gray-500 mb-6 flex-1">
                            {action.description}
                        </p>
                        <div className="flex items-center text-xs font-bold text-gray-400 group-hover:text-black transition-colors uppercase tracking-widest gap-2">
                            Manage Center <ArrowRight size={14} />
                        </div>
                    </div>
                </Card>
            ))}
        </div>
    );
};
