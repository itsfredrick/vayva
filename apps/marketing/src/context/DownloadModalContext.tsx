"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";
import { X } from "lucide-react";

interface DownloadModalContextType {
    openDownloadModal: () => void;
    closeDownloadModal: () => void;
}

const DownloadModalContext = createContext<DownloadModalContextType | undefined>(
    undefined
);

export function DownloadModalProvider({ children }: { children: ReactNode }) {
    const [isOpen, setIsOpen] = useState(false);
    const [installStep, setInstallStep] = useState<"select" | "instructions">("select");
    const [selectedPlatform, setSelectedPlatform] = useState<"ios" | "android" | null>(null);

    const openDownloadModal = () => {
        setIsOpen(true);
        setInstallStep("select");
        setSelectedPlatform(null);
    };

    const closeDownloadModal = () => setIsOpen(false);

    const handleAndroidClick = () => {
        // Android logic (simplified for context vs local hook, assumed universal for now)
        setSelectedPlatform("android");
        setInstallStep("instructions");
    };

    const handleIOSClick = () => {
        setSelectedPlatform("ios");
        setInstallStep("instructions");
    };

    return (
        <DownloadModalContext.Provider value={{ openDownloadModal, closeDownloadModal }}>
            {children}
            {isOpen && (
                <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
                    <div
                        className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200"
                        onClick={closeDownloadModal}
                    />
                    <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
                        <div className="p-6">
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="text-xl font-bold text-gray-900">
                                    {installStep === "select" ? "Select your device" : "How to install"}
                                </h3>
                                <button
                                    onClick={closeDownloadModal}
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
                                            <span className="font-bold text-xl">iOS</span>
                                        </div>
                                        <span className="font-bold text-gray-900">iPhone</span>
                                    </button>

                                    <button
                                        onClick={handleAndroidClick}
                                        className="flex flex-col items-center justify-center gap-4 p-8 rounded-2xl border-2 border-gray-100 hover:border-[#22C55E] hover:bg-green-50 transition-all group"
                                    >
                                        <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center group-hover:bg-[#22C55E] group-hover:shadow-lg transition-all text-[#22C55E] group-hover:text-white">
                                            <span className="font-bold text-xl">And</span>
                                        </div>
                                        <span className="font-bold text-gray-900">Android</span>
                                    </button>
                                </div>
                            ) : (
                                <div className="bg-gray-50 rounded-2xl p-6">
                                    <div className="flex items-center gap-4 mb-4">
                                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${selectedPlatform === 'ios' ? 'bg-gray-900 text-white' : 'bg-[#22C55E] text-white'}`}>
                                            <span className="font-bold text-lg">
                                                {selectedPlatform === 'ios' ? 'iOS' : 'And'}
                                            </span>
                                        </div>
                                        <div>
                                            <p className="font-bold text-gray-900">Follow these steps:</p>
                                            <p className="text-sm text-gray-500">Install Vayva on your home screen</p>
                                        </div>
                                    </div>
                                    <div className="space-y-4 text-sm text-gray-600">
                                        <div className="flex gap-3">
                                            <div className="w-6 h-6 rounded-full bg-white border border-gray-200 flex items-center justify-center shrink-0 font-bold text-gray-900 mt-0.5">1</div>
                                            <p>Tap the <span className="font-bold">{selectedPlatform === 'ios' ? 'Share' : 'Menu'}</span> button.</p>
                                        </div>
                                        <div className="flex gap-3">
                                            <div className="w-6 h-6 rounded-full bg-white border border-gray-200 flex items-center justify-center shrink-0 font-bold text-gray-900 mt-0.5">2</div>
                                            <p>Select <span className="font-bold">Add to Home Screen</span>.</p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => setInstallStep("select")}
                                        className="w-full mt-6 text-gray-500 hover:text-gray-900 text-sm font-medium"
                                    >
                                        Back to selection
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </DownloadModalContext.Provider>
    );
}

export const useDownloadModal = () => {
    const context = useContext(DownloadModalContext);
    if (!context) {
        throw new Error("useDownloadModal must be used within a DownloadModalProvider");
    }
    return context;
};
