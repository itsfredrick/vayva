"use client";

import React, { useEffect, useState } from "react";
import { Download, X, Smartphone, Globe } from "lucide-react";
import { Button } from "@vayva/ui";
import { useDownloadModal } from "@/context/DownloadModalContext";

export function HeroDownloadButton() {
    const [isStandalone, setIsStandalone] = useState(false);
    const { openDownloadModal } = useDownloadModal();

    useEffect(() => {
        const isStandaloneMode =
            window.matchMedia("(display-mode: standalone)").matches ||
            (window.navigator as any).standalone ||
            document.referrer.includes("android-app://");
        setIsStandalone(isStandaloneMode);
    }, []);

    if (isStandalone) {
        return null;
    }

    return (
        <Button
            onClick={openDownloadModal}
            className="bg-gray-900 hover:bg-black text-white px-8 py-4 rounded-xl flex items-center gap-2 font-bold shadow-xl transition-all hover:scale-105"
        >
            <Download className="w-5 h-5" />
            <span>Download App</span>
        </Button>
    );
}
