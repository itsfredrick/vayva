"use client";

import { useEffect, useState } from "react";
import { Button } from "@vayva/ui";
import { AlertTriangle, X } from "lucide-react";
import { usePathname } from "next/navigation";

interface Incident {
    id: string;
    title: string;
    description: string;
    impact: "CRITICAL" | "MAJOR" | "MINOR" | "MAINTENANCE";
}

export function IncidentBanner() {
    const [incident, setIncident] = useState<Incident | null>(null);
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
            } catch (e: any) {
                // Fail silently for banners
            }
        };

        checkIncidents();
    }, []);

    // Don't show on auth pages
    if (pathname.includes("/signin") || pathname.includes("/signup")) {
        return null;
    }

    if (!incident || dismissed) return null;

    const getStyle = (impact: string) => {
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

    return (
        <div className={`${getStyle(incident.impact)} px-4 py-2 relative flex items-center justify-center text-sm font-medium z-50`}>
            <AlertTriangle className="w-4 h-4 mr-2" />
            <span>
                <strong>{incident.title}:</strong> {incident.description}
            </span>
            <Button
                onClick={handleDismiss}
                className="absolute right-4 p-1 hover:bg-white/20 rounded-full transition-colors"
                aria-label="Dismiss banner"
            >
                <X className="w-4 h-4" />
            </Button>
        </div>
    );
}
