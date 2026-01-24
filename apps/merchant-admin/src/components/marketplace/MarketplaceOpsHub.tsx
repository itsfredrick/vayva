
"use client";

import React from "react";
import { Button, Icon } from "@vayva/ui";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { TrendingUp, Users, DollarSign, ArrowRight, ShieldCheck, Zap } from "lucide-react";

export const MarketplaceMetrics = () => {
    const stats = [
        { label: "Active Vendors", value: "12", icon: Users, color: "text-blue-600", bg: "bg-blue-50" },
        { label: "Platform GMV", value: "₦1.2M", icon: TrendingUp, color: "text-green-600", bg: "bg-green-50" },
        { label: "Owed Commission", value: "₦45,000", icon: DollarSign, color: "text-purple-600", bg: "bg-purple-50" },
        { label: "Pending Payouts", value: "4", icon: Zap, color: "text-orange-600", bg: "bg-orange-50" },
    ];

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {stats.map((stat, i) => (
                <Card key={i} className="border-none shadow-sm bg-white/50 backdrop-blur-sm">
                    <CardContent className="p-6">
                        <div className="flex items-center gap-4">
                            <div className={`p-3 rounded-2xl ${stat.bg} ${stat.color}`}>
                                <stat.icon size={20} />
                            </div>
                            <div>
                                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">{stat.label}</p>
                                <h3 className="text-2xl font-black text-gray-900">{stat.value}</h3>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            ))}
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
