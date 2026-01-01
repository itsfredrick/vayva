"use client";

import React, { useEffect, useState } from "react";
import { Download, X, Smartphone, Globe } from "lucide-react";
import { Button } from "@vayva/ui";

export function HeroDownloadButton() {
    const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
    const [isStandalone, setIsStandalone] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [installStep, setInstallStep] = useState<"select" | "instructions">("select");
    const [selectedPlatform, setSelectedPlatform] = useState<"ios" | "android" | null>(null);

    useEffect(() => {
        const isStandaloneMode =
            window.matchMedia("(display-mode: standalone)").matches ||
            (window.navigator as any).standalone ||
            document.referrer.includes("android-app://");
        setIsStandalone(isStandaloneMode);

        const handler = (e: any) => {
            e.preventDefault();
            setDeferredPrompt(e);
        };

        window.addEventListener("beforeinstallprompt", handler);

        return () => window.removeEventListener("beforeinstallprompt", handler);
    }, []);

    const handleOpenModal = () => {
        setShowModal(true);
        setInstallStep("select");
        setSelectedPlatform(null);
    };

    const handleAndroidClick = async () => {
        if (deferredPrompt) {
            // Native install available
            deferredPrompt.prompt();
            const { outcome } = await deferredPrompt.userChoice;
            if (outcome === "accepted") {
                setDeferredPrompt(null);
                setShowModal(false);
            }
        } else {
            // Show instructions
            setSelectedPlatform("android");
            setInstallStep("instructions");
        }
    };

    const handleIOSClick = () => {
        setSelectedPlatform("ios");
        setInstallStep("instructions");
    };

    if (isStandalone) {
        return null;
    }

    return (
        <>
            <Button
                onClick={handleOpenModal}
                className="bg-gray-900 hover:bg-black text-white px-8 py-4 rounded-xl flex items-center gap-2 font-bold shadow-xl transition-all hover:scale-105"
            >
                <Download className="w-5 h-5" />
                <span>Download App</span>
            </Button>

            {showModal && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    {/* Backdrop */}
                    <div
                        className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200"
                        onClick={() => setShowModal(false)}
                    />

                    {/* Modal Content */}
                    <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
                        <div className="p-6">
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="text-xl font-bold text-gray-900">
                                    {installStep === "select" ? "Select your device" : "How to install"}
                                </h3>
                                <button
                                    onClick={() => setShowModal(false)}
                                    className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-500"
                                >
                                    <X size={20} />
                                </button>
                            </div>

                            {installStep === "select" ? (
                                <div className="grid grid-cols-2 gap-4">
                                    <button
                                        onClick={handleIOSClick}
                                        className="flex flex-col items-center justify-center gap-4 p-8 rounded-2xl border-2 border-gray-100 hover:border-gray-900 hover:bg-gray-50 transition-all group"
                                    >
                                        <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center group-hover:bg-white group-hover:shadow-lg transition-all text-gray-900">
                                            <svg className="w-8 h-8" viewBox="0 0 24 24" fill="currentColor"><path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.21-1.96 1.08-3.11-1.06.05-2.32.71-3.06 1.61-.65.8-1.23 2.03-1.07 3.11 1.19.09 2.32-.79 3.05-1.61z" /></svg>
                                        </div>
                                        <span className="font-bold text-gray-900">iOS</span>
                                    </button>

                                    <button
                                        onClick={handleAndroidClick}
                                        className="flex flex-col items-center justify-center gap-4 p-8 rounded-2xl border-2 border-gray-100 hover:border-[#22C55E] hover:bg-green-50 transition-all group"
                                    >
                                        <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center group-hover:bg-[#22C55E] group-hover:shadow-lg transition-all text-[#22C55E] group-hover:text-white">
                                            <svg className="w-8 h-8" viewBox="0 0 24 24" fill="currentColor"><path d="M17.523 15.3414c-.5511 0-.9993-.4486-.9993-.9997s.4482-.9993.9993-.9993c.551 0 .9996.4482.9996.9993.0001.5511-.4486.9997-.9996.9997m-11.046 0c-.5511 0-.9993-.4486-.9993-.9997s.4482-.9993.9993-.9993c.551 0 .9996.4482.9996.9993 0 .5511-.4486.9997-.9996.9997m11.4045-6.02l1.9973-3.4592a.416.416 0 00-.1527-.5676.416.416 0 00-.5676.1527L17.2194 8.82c-2.039-1.2587-4.4897-1.9954-7.1472-2.028v-1.129H0v1.1611c-2.6575.0416-5.1083.7783-7.1473 2.028L.9772 5.4473a.416.416 0 00-.5676-.1527.416.416 0 00-.1527.5676l1.9973 3.4592C-.849 13.0649-1.8898 17.5947 1.259 21.056h21.482C25.8898 17.5947 24.849 13.0649 17.8815 9.3214" /></svg>
                                        </div>
                                        <span className="font-bold text-gray-900">Android</span>
                                    </button>
                                </div>
                            ) : (
                                <div className="bg-gray-50 rounded-2xl p-6">
                                    <div className="flex items-center gap-4 mb-4">
                                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${selectedPlatform === 'ios' ? 'bg-gray-900 text-white' : 'bg-[#22C55E] text-white'}`}>
                                            {selectedPlatform === 'ios' ? (
                                                <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor"><path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.21-1.96 1.08-3.11-1.06.05-2.32.71-3.06 1.61-.65.8-1.23 2.03-1.07 3.11 1.19.09 2.32-.79 3.05-1.61z" /></svg>
                                            ) : (
                                                <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor"><path d="M17.523 15.3414c-.5511 0-.9993-.4486-.9993-.9997s.4482-.9993.9993-.9993c.551 0 .9996.4482.9996.9993.0001.5511-.4486.9997-.9996.9997m-11.046 0c-.5511 0-.9993-.4486-.9993-.9997s.4482-.9993.9993-.9993c.551 0 .9996.4482.9996.9993 0 .5511-.4486.9997-.9996.9997m11.4045-6.02l1.9973-3.4592a.416.416 0 00-.1527-.5676.416.416 0 00-.5676.1527L17.2194 8.82c-2.039-1.2587-4.4897-1.9954-7.1472-2.028v-1.129H0v1.1611c-2.6575.0416-5.1083.7783-7.1473 2.028L.9772 5.4473a.416.416 0 00-.5676-.1527.416.416 0 00-.1527.5676l1.9973 3.4592C-.849 13.0649-1.8898 17.5947 1.259 21.056h21.482C25.8898 17.5947 24.849 13.0649 17.8815 9.3214" /></svg>
                                            )}
                                        </div>
                                        <div>
                                            <p className="font-bold text-gray-900">Follow these steps:</p>
                                            <p className="text-sm text-gray-500">Install Vayva on your home screen</p>
                                        </div>
                                    </div>
                                    <div className="space-y-4 text-sm text-gray-600">
                                        <div className="flex gap-3">
                                            <div className="w-6 h-6 rounded-full bg-white border border-gray-200 flex items-center justify-center shrink-0 font-bold text-gray-900 mt-0.5">1</div>
                                            <p>Tap the <span className="font-bold">{selectedPlatform === 'ios' ? 'Share' : 'Menu'}</span> button in your browser bar.</p>
                                        </div>
                                        <div className="flex gap-3">
                                            <div className="w-6 h-6 rounded-full bg-white border border-gray-200 flex items-center justify-center shrink-0 font-bold text-gray-900 mt-0.5">2</div>
                                            <p>Scroll down and select <span className="font-bold">Add to Home Screen</span>.</p>
                                        </div>
                                        <div className="flex gap-3">
                                            <div className="w-6 h-6 rounded-full bg-white border border-gray-200 flex items-center justify-center shrink-0 font-bold text-gray-900 mt-0.5">3</div>
                                            <p>Tap <span className="font-bold">Add</span> to confirm.</p>
                                        </div>
                                    </div>
                                    <Button
                                        onClick={() => setInstallStep("select")}
                                        variant="ghost"
                                        className="w-full mt-6 text-gray-500 hover:text-gray-900"
                                    >
                                        Back to selection
                                    </Button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
