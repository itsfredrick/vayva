"use client";

import React from "react";
import Link from "next/link";
import { Icon, Button } from "@vayva/ui";
import { useAuth } from "@/context/AuthContext";

export const ProFeatureUpsell = ({ featureName }: { featureName?: string }) => {
    const { merchant } = useAuth();

    if (!merchant || merchant.plan !== "STARTER") {
        return null;
    }

    return (
        <div className="rounded-xl border border-indigo-100 bg-gradient-to-r from-indigo-50 to-purple-50 p-6 relative overflow-hidden group hover:shadow-md transition-shadow">
            {/* Background Decor */}
            <div className="absolute top-0 right-0 p-4 opacity-10 transform translate-x-1/3 -translate-y-1/3 group-hover:scale-110 transition-transform duration-700">
                <Icon name="Crown" size={120} />
            </div>

            <div className="relative z-10">
                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-indigo-100 text-indigo-700 text-[10px] font-bold uppercase tracking-wide mb-3">
                    <Icon name="Sparkles" size={12} />
                    {featureName ? `${featureName} Locked` : "Upgrade Available"}
                </div>

                <h3 className="font-bold text-gray-900 mb-2">
                    Unlock Professional Powers
                </h3>
                <p className="text-sm text-gray-600 mb-4 max-w-[80%]">
                    Get access to AI automation, removed branding, priority support, and lower transaction fees.
                </p>

                <Link href="/dashboard/settings/billing">
                    <Button variant="primary" className="bg-indigo-600 hover:bg-indigo-700 text-sm px-4 py-2 shadow-sm shadow-indigo-200">
                        View Plans & Upgrade
                    </Button>
                </Link>
            </div>
        </div>
    );
};
