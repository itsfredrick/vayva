"use client";

import React, { useEffect, useState } from "react";
import { X, Smartphone } from "lucide-react";

export function InstallPrompt() {
    const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        // Check for native install prompt
        const handler = (e: any) => {
            e.preventDefault();
            setDeferredPrompt(e);
            // Only show if user hasn't dismissed recently (implied simple logic here)
        };

        window.addEventListener("beforeinstallprompt", handler);

        // Scroll listener for bottom-left popup
        const scrollHandler = () => {
            if (window.scrollY > 300) {
                setIsVisible(true);
            } else {
                setIsVisible(false);
            }
        };

        window.addEventListener("scroll", scrollHandler);

        return () => {
            window.removeEventListener("beforeinstallprompt", handler);
            window.removeEventListener("scroll", scrollHandler);
        };
    }, []);

    const handleInstallClick = async () => {
        if (deferredPrompt) {
            deferredPrompt.prompt();
            const { outcome } = await deferredPrompt.userChoice;
            if (outcome === "accepted") {
                setDeferredPrompt(null);
                setIsVisible(false);
            }
        } else {
            // Fallback: alert instructions or open the hero modal?
            // For now, simple alert as "Install Vayva" usually implies PWA
            alert("To install Vayva, tap Share -> Add to Home Screen.");
        }
    };

    if (!deferredPrompt && !isVisible) return null;
    // If no deferredPrompt, we might strictly hide it, OR show it as instructions.
    // User said "ui that pops... says install vayva".
    // Let's hide if not visible (scroll < 300).
    // But wait, if (!deferredPrompt) it returns null in line 51.
    // So it only shows if deferredPrompt exists AND visible.
    // We can relax this to show even if not installable (as instruction)?
    // Standard PWA practice: Only prompt if installable.
    if (!deferredPrompt) return null; // Only show if PWA available
    if (!isVisible) return null;

    return (
        <div className="fixed bottom-6 left-6 z-50 animate-in slide-in-from-bottom-5 fade-in duration-500">
            <div className="bg-white border border-gray-200 shadow-xl rounded-2xl p-4 flex items-center gap-4 max-w-sm">
                <div className="bg-green-100 p-3 rounded-lg text-[#22C55E]">
                    <Smartphone size={24} />
                </div>
                <div>
                    <h4 className="font-bold text-[#0F172A] text-sm">Install Vayva</h4>
                    <p className="text-xs text-gray-500">Get the full app experience</p>
                </div>
                <button
                    onClick={handleInstallClick}
                    className="bg-[#22C55E] hover:bg-[#16A34A] text-white px-4 py-2 rounded-lg text-sm font-bold shadow-md transition-all"
                >
                    Install
                </button>
                <button
                    onClick={() => setIsVisible(false)}
                    className="text-gray-400 hover:text-gray-600 self-start -mt-1 -mr-1"
                >
                    <X size={16} />
                </button>
            </div>
        </div>
    );
}
