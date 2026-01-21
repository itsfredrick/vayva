import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from "react";
import { Button, Icon, cn } from "@vayva/ui";
export const GlobalBanner = () => {
    const [banners, setBanners] = useState([]);
    useEffect(() => {
        // Fetch only critical or action_required notifications that should be banners
        // For simplicity, reusing the search endpoint, but filtering client side for demo
        const fetchBanners = async () => {
            try {
                // Fetch unread critical/action_required items
                const res = await fetch("/api/merchant/notifications?status=unread&limit=5");
                const data = await res.json();
                const items = data.items || [];
                const activeBanners = items.filter((n) => (n.type === "critical" || n.type === "action_required") &&
                    n.channels.includes("banner"));
                setBanners(activeBanners);
            }
            catch (err) {
                console.error("Failed to load banners", err);
            }
        };
        fetchBanners();
    }, []);
    if (banners.length === 0)
        return null;
    // Show only the most critical one at a time to avoid stacking too much
    const banner = banners[0];
    const isCritical = banner.type === "critical";
    return (_jsxs("div", { className: cn("w-full px-4 py-3 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-sm animate-in slide-in-from-top duration-300", isCritical ? "bg-red-600 text-white" : "bg-amber-100 text-amber-900"), children: [_jsxs("div", { className: "flex items-center gap-3", children: [_jsx("div", { className: cn("p-1.5 rounded-full shrink-0", isCritical ? "bg-white/20" : "bg-amber-200"), children: _jsx(Icon, { name: isCritical ? "TriangleAlert" : "CircleAlert", size: 16 }) }), _jsxs("div", { children: [_jsxs("span", { className: "font-bold mr-2", children: [banner.title, ":"] }), _jsx("span", { className: isCritical ? "text-red-100" : "text-amber-800", children: banner.message })] })] }), _jsxs("div", { className: "flex items-center gap-2 w-full sm:w-auto mt-2 sm:mt-0", children: [banner.actionUrl && (_jsx("a", { href: banner.actionUrl, className: cn("px-4 py-1.5 rounded-lg text-xs font-bold transition-colors whitespace-nowrap text-center flex-1 sm:flex-none", isCritical
                            ? "bg-white text-red-600 hover:bg-gray-100"
                            : "bg-amber-900 text-white hover:bg-amber-800"), children: banner.actionLabel || "Fix Issue" })), !isCritical && (_jsx(Button, { variant: "ghost", size: "icon", className: "h-6 w-6 hover:bg-black/5 rounded-lg transition-colors p-0", children: _jsx(Icon, { name: "X", size: 16 }) }))] })] }));
};
