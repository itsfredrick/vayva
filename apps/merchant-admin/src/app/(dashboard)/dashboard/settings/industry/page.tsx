"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { INDUSTRY_CONFIG } from "@/config/industry";
import { IndustrySlug, IndustryConfig } from "@/lib/templates/types";
import { Button, Icon } from "@vayva/ui";
import { toast } from "sonner";
import { useAuth } from "@/context/AuthContext";

// Groupings for UI
const INDUSTRY_GROUPS = {
    "Commerce & Retail": ["retail", "fashion", "electronics", "beauty", "grocery", "one_product", "b2b", "marketplace"],
    "Food & Services": ["food", "services"],
    "Education & Digital": ["education", "events", "digital"],
    "Entertainment & Hospitality": ["nightlife", "travel_hospitality"],
    "Specialized": ["real_estate", "automotive", "blog_media", "creative_portfolio", "nonprofit"],
};

export default function IndustrySettingsPage() {
    const router = useRouter();
    const { merchant } = useAuth();
    const [selectedSlug, setSelectedSlug] = useState<IndustrySlug | null>(((merchant as any))?.industrySlug || "retail");
    const [isLoading, setIsLoading] = useState(false);

    const handleSave = async () => {
        if (!selectedSlug) return;
        setIsLoading(true);

        try {
            const res = await fetch("/api/settings/industry", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ industrySlug: selectedSlug }),
            });

            if (!res.ok) throw new Error("Failed to save industry");

            toast.success("Industry updated successfully");

            // Force reload to update sidebar and app context
            window.location.href = "/dashboard";
        } catch (error: any) {
            toast.error("Something went wrong");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="max-w-5xl mx-auto py-8 px-4 pb-24">
            <div className="mb-8">
                <h1 className="text-2xl font-bold mb-2">Select Your Industry</h1>
                <p className="text-gray-500">
                    This will customize your dashboard, sidebar, and product forms to match your business needs.
                </p>
            </div>

            {Object.entries(INDUSTRY_GROUPS).map(([groupTitle, slugs]) => (
                <div key={groupTitle} className="mb-10">
                    <h2 className="text-sm font-bold uppercase tracking-wider text-gray-500 mb-4 border-b border-gray-100 pb-2">
                        {groupTitle}
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {slugs.map((slug: any) => {
                            // Safe access to config
                            const config = INDUSTRY_CONFIG[slug as IndustrySlug];
                            if (!config) return null;

                            const isSelected = selectedSlug === slug;
                            return (
                                <div
                                    key={slug}
                                    onClick={() => setSelectedSlug(slug as IndustrySlug)}
                                    className={`
                    cursor-pointer rounded-xl border-2 p-6 transition-all relative overflow-hidden group
                    ${isSelected
                                            ? "border-black bg-gray-50 shadow-sm"
                                            : "border-gray-200 hover:border-gray-300 hover:bg-white"
                                        }
                  `}
                                >
                                    <div className="flex items-center justify-between mb-3">
                                        <div className={`p-2 rounded-lg ${isSelected ? "bg-white border border-gray-200" : "bg-gray-100"}`}>
                                            <Icon name="Briefcase" size={20} className="text-gray-900" />
                                        </div>
                                        {isSelected && (
                                            <div className="bg-black text-white text-xs font-bold px-2 py-1 rounded-full">
                                                SELECTED
                                            </div>
                                        )}
                                    </div>

                                    <h3 className="font-bold text-lg mb-1">{config.displayName}</h3>
                                    <p className="text-sm text-gray-500 mb-4 line-clamp-2">
                                        {config.description || `Optimized for ${config.displayName.toLowerCase()} businesses`}
                                    </p>

                                    {/* Feature Tags */}
                                    <div className="flex flex-wrap gap-1.5">
                                        {config.features?.bookings && <span className="text-[10px] bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full">Bookings</span>}
                                        {config.features?.delivery && <span className="text-[10px] bg-green-50 text-green-700 px-2 py-0.5 rounded-full">Delivery</span>}
                                        {config.features?.inventory && <span className="text-[10px] bg-amber-50 text-amber-700 px-2 py-0.5 rounded-full">Inventory</span>}
                                        {config.features?.content && <span className="text-[10px] bg-pink-50 text-pink-700 px-2 py-0.5 rounded-full">Content</span>}
                                        {config.features?.reservations && <span className="text-[10px] bg-purple-50 text-purple-700 px-2 py-0.5 rounded-full">Reservations</span>}
                                        {config.features?.tickets && <span className="text-[10px] bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded-full">Tickets</span>}
                                        {config.features?.quotes && <span className="text-[10px] bg-cyan-50 text-cyan-700 px-2 py-0.5 rounded-full">Quotes</span>}
                                        {config.features?.donations && <span className="text-[10px] bg-rose-50 text-rose-700 px-2 py-0.5 rounded-full">Donations</span>}
                                        {config.features?.enrollments && <span className="text-[10px] bg-teal-50 text-teal-700 px-2 py-0.5 rounded-full">Enrollments</span>}
                                        {config.features?.viewings && <span className="text-[10px] bg-orange-50 text-orange-700 px-2 py-0.5 rounded-full">Viewings</span>}
                                        {config.features?.testDrives && <span className="text-[10px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded-full">Test Drives</span>}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            ))}

            <div className="flex justify-end p-4 bg-white border-t border-gray-100 fixed bottom-0 left-0 right-0 md:bg-transparent md:border-none md:relative md:p-0 z-10">
                <Button
                    onClick={handleSave}
                    isLoading={isLoading}
                    disabled={!selectedSlug}
                    size="lg"
                    className="w-full md:w-auto"
                >
                    Save & Apply Changes
                </Button>
            </div>
        </div>
    );
}
