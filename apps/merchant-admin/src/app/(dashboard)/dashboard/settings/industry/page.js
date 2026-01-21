"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { INDUSTRY_CONFIG } from "@/config/industry";
import { Button, Icon } from "@vayva/ui";
import { toast } from "sonner";
import { useAuth } from "@/context/AuthContext";
// Groupings for UI
const INDUSTRY_GROUPS = {
    "Commerce & Retail": ["retail", "fashion", "electronics", "beauty", "grocery", "food", "b2b", "marketplace"],
    "Services & Knowledge": ["services", "education", "events", "digital"],
    "Specialized & Other": ["real_estate", "automotive", "travel_hospitality", "blog_media", "creative_portfolio", "nonprofit"],
};
export default function IndustrySettingsPage() {
    const router = useRouter();
    const { merchant } = useAuth();
    const [selectedSlug, setSelectedSlug] = useState(merchant?.industrySlug || "retail");
    const [isLoading, setIsLoading] = useState(false);
    const handleSave = async () => {
        if (!selectedSlug)
            return;
        setIsLoading(true);
        try {
            const res = await fetch("/api/settings/industry", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ industrySlug: selectedSlug }),
            });
            if (!res.ok)
                throw new Error("Failed to save industry");
            toast.success("Industry updated successfully");
            // Force reload to update sidebar and app context
            window.location.href = "/dashboard";
        }
        catch (error) {
            toast.error("Something went wrong");
        }
        finally {
            setIsLoading(false);
        }
    };
    return (_jsxs("div", { className: "max-w-5xl mx-auto py-8 px-4 pb-24", children: [_jsxs("div", { className: "mb-8", children: [_jsx("h1", { className: "text-2xl font-bold mb-2", children: "Select Your Industry" }), _jsx("p", { className: "text-gray-500", children: "This will customize your dashboard, sidebar, and product forms to match your business needs." })] }), Object.entries(INDUSTRY_GROUPS).map(([groupTitle, slugs]) => (_jsxs("div", { className: "mb-10", children: [_jsx("h2", { className: "text-sm font-bold uppercase tracking-wider text-gray-500 mb-4 border-b border-gray-100 pb-2", children: groupTitle }), _jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4", children: slugs.map((slug) => {
                            // Safe access to config
                            const config = INDUSTRY_CONFIG[slug];
                            if (!config)
                                return null;
                            const isSelected = selectedSlug === slug;
                            return (_jsxs("div", { onClick: () => setSelectedSlug(slug), className: `
                    cursor-pointer rounded-xl border-2 p-6 transition-all relative overflow-hidden group
                    ${isSelected
                                    ? "border-black bg-gray-50 shadow-sm"
                                    : "border-gray-200 hover:border-gray-300 hover:bg-white"}
                  `, children: [_jsxs("div", { className: "flex items-center justify-between mb-3", children: [_jsx("div", { className: `p-2 rounded-lg ${isSelected ? "bg-white border border-gray-200" : "bg-gray-100"}`, children: _jsx(Icon, { name: "Briefcase", size: 20, className: "text-gray-900" }) }), isSelected && (_jsx("div", { className: "bg-black text-white text-xs font-bold px-2 py-1 rounded-full", children: "SELECTED" }))] }), _jsx("h3", { className: "font-bold text-lg mb-1", children: config.displayName }), _jsxs("p", { className: "text-sm text-gray-500 mb-4 line-clamp-2", children: ["Optimization for ", config.displayName] }), _jsxs("div", { className: "flex flex-wrap gap-2", children: [config.features?.bookings && _jsx("span", { className: "text-[10px] bg-blue-50 text-blue-700 px-2 py-1 rounded", children: "Bookings" }), config.features?.delivery && _jsx("span", { className: "text-[10px] bg-green-50 text-green-700 px-2 py-1 rounded", children: "Delivery" }), config.features?.content && _jsx("span", { className: "text-[10px] bg-pink-50 text-pink-700 px-2 py-1 rounded", children: "Content" })] })] }, slug));
                        }) })] }, groupTitle))), _jsx("div", { className: "flex justify-end p-4 bg-white border-t border-gray-100 fixed bottom-0 left-0 right-0 md:bg-transparent md:border-none md:relative md:p-0 z-10", children: _jsx(Button, { onClick: handleSave, isLoading: isLoading, disabled: !selectedSlug, size: "lg", className: "w-full md:w-auto", children: "Save & Apply Changes" }) })] }));
}
