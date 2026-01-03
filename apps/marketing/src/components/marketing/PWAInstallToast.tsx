"use client";

import React, { useEffect, useState } from "react";
import { X } from "lucide-react";
import { useDownloadModal } from "@/context/DownloadModalContext";

export function PWAInstallToast() {
    const [isVisible, setIsVisible] = useState(false);
    const { openDownloadModal } = useDownloadModal();

    useEffect(() => {
        // Try to detect PWA status. If standalone, hide.
        const isStandalone =
            window.matchMedia("(display-mode: standalone)").matches ||
            (window.navigator as any).standalone;

        if (isStandalone) return;

        // Show after scrolling a bit, similar to Cookie Banner but right side
        const scrollHandler = () => {
            if (window.scrollY > 400) {
                setIsVisible(true);
            } else {
                setIsVisible(false);
            }
        };
        window.addEventListener("scroll", scrollHandler);
        return () => window.removeEventListener("scroll", scrollHandler);
    }, []);

    if (!isVisible) return null;

    return (
        <div className="fixed bottom-6 right-6 z-[90] animate-in slide-in-from-bottom-5 fade-in duration-500">
            <div className="bg-white border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.12)] rounded-2xl p-4 w-[320px]">
                <div className="flex justify-between items-start mb-3">
                    <div className="w-10 h-10 bg-[#0F172A] rounded-lg flex items-center justify-center text-white font-bold text-lg">
                        V
                    </div>
                    <button
                        onClick={() => setIsVisible(false)}
                        className="text-gray-400 hover:text-gray-600"
                    >
                        <X size={16} />
                    </button>
                </div>
                <h4 className="font-bold text-[#0F172A] mb-1">Install Vayva App</h4>
                <p className="text-xs text-gray-500 leading-relaxed mb-4">
                    Install our web app for a faster, full-screen experience on your device.
                </p>
                <div className="flex gap-3">
                    <button
                        onClick={openDownloadModal}
                        className="flex-1 bg-[#22C55E] hover:bg-[#16A34A] text-white py-2 rounded-lg text-xs font-bold transition-all"
                    >
                        Install App
                    </button>
                    <button
                        onClick={() => setIsVisible(false)}
                        className="flex-1 bg-white border border-gray-200 text-gray-600 hover:bg-gray-50 py-2 rounded-lg text-xs font-bold transition-all"
                    >
                        Later
                    </button>
                </div>
            </div>
        </div>
    );
}
