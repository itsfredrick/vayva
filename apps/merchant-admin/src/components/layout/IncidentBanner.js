"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from "react";
import { Button } from "@vayva/ui";
import { AlertTriangle, X } from "lucide-react";
import { usePathname } from "next/navigation";
export function IncidentBanner() {
    const [incident, setIncident] = useState(null);
    const [dismissed, setDismissed] = useState(false);
    const pathname = usePathname();
    useEffect(() => {
        // Check local storage for dismissal
        const dismissedId = localStorage.getItem("vayva_dismissed_incident");
        // Fetch active incidents (mocked for now, will wire next)
        // Real wiring: fetch('/api/system/incidents/active')
        const checkIncidents = async () => {
            try {
                const res = await fetch('/api/system/incidents/active');
                if (res.ok) {
                    const data = await res.json();
                    if (data && data.id !== dismissedId) {
                        setIncident(data);
                    }
                }
            }
            catch (e) {
                // Fail silently for banners
            }
        };
        checkIncidents();
    }, []);
    // Don't show on auth pages
    if (pathname.includes("/signin") || pathname.includes("/signup")) {
        return null;
    }
    if (!incident || dismissed)
        return null;
    const getStyle = (impact) => {
        switch (impact) {
            case "CRITICAL": return "bg-red-600 text-white";
            case "MAJOR": return "bg-orange-500 text-white";
            case "MAINTENANCE": return "bg-blue-600 text-white";
            default: return "bg-yellow-500 text-white";
        }
    };
    const handleDismiss = () => {
        setDismissed(true);
        localStorage.setItem("vayva_dismissed_incident", incident.id);
    };
    return (_jsxs("div", { className: `${getStyle(incident.impact)} px-4 py-2 relative flex items-center justify-center text-sm font-medium z-50`, children: [_jsx(AlertTriangle, { className: "w-4 h-4 mr-2" }), _jsxs("span", { children: [_jsxs("strong", { children: [incident.title, ":"] }), " ", incident.description] }), _jsx(Button, { onClick: handleDismiss, className: "absolute right-4 p-1 hover:bg-white/20 rounded-full transition-colors", "aria-label": "Dismiss banner", children: _jsx(X, { className: "w-4 h-4" }) })] }));
}
