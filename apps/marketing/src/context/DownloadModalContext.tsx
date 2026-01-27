"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";
import { Button } from "@vayva/ui";
import { X } from "lucide-react";

interface DownloadModalContextType {
    openDownloadModal: () => void;
    closeDownloadModal: () => void;
}

const DownloadModalContext = createContext<DownloadModalContextType | undefined>(
    undefined
);

export function DownloadModalProvider({ children }: { children: ReactNode }): React.JSX.Element {
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
                                <Button
                                    onClick={closeDownloadModal}
                                    className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-500"
                                >
                                    <X size={20} />
                                </Button>
                            </div>

                            {installStep === "select" ? (
                                <div className="grid grid-cols-2 gap-4">
                                    <Button
                                        onClick={handleIOSClick}
                                        className="flex flex-col items-center justify-center gap-3 p-6 rounded-2xl border-2 border-gray-200 hover:border-gray-900 hover:bg-gray-50 transition-all group"
                                    >
                                        <div className="w-14 h-14 rounded-2xl bg-gray-900 flex items-center justify-center group-hover:scale-110 transition-all">
                                            <svg className="w-7 h-7 text-white" viewBox="0 0 24 24" fill="currentColor">
                                                <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
                                            </svg>
                                        </div>
                                        <span className="font-bold text-gray-900">iOS</span>
                                    </Button>

                                    <Button
                                        onClick={handleAndroidClick}
                                        className="flex flex-col items-center justify-center gap-3 p-6 rounded-2xl border-2 border-gray-200 hover:border-[#22C55E] hover:bg-green-50 transition-all group"
                                    >
                                        <div className="w-14 h-14 rounded-2xl bg-[#22C55E] flex items-center justify-center group-hover:scale-110 transition-all">
                                            <svg className="w-7 h-7 text-white" viewBox="0 0 24 24" fill="currentColor">
                                                <path d="M17.6 9.48l1.84-3.18c.16-.31.04-.69-.26-.85-.29-.15-.65-.06-.83.22l-1.88 3.24c-1.4-.59-2.96-.92-4.61-.92s-3.21.33-4.61.92L5.37 5.67c-.19-.29-.58-.38-.87-.2-.28.18-.37.54-.22.83L6.18 9.5C3.3 11.16 1.44 14.01 1 17.3h22c-.44-3.29-2.3-6.14-5.18-7.82zM7 15.25c-.69 0-1.25-.56-1.25-1.25s.56-1.25 1.25-1.25 1.25.56 1.25 1.25-.56 1.25-1.25 1.25zm10 0c-.69 0-1.25-.56-1.25-1.25s.56-1.25 1.25-1.25 1.25.56 1.25 1.25-.56 1.25-1.25 1.25z"/>
                                            </svg>
                                        </div>
                                        <span className="font-bold text-gray-900">Android</span>
                                    </Button>
                                </div>
                            ) : (
                                <div className="bg-gray-50 rounded-2xl p-6">
                                    <div className="flex items-center gap-4 mb-4">
                                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${selectedPlatform === 'ios' ? 'bg-gray-900' : 'bg-[#22C55E]'}`}>
                                            {selectedPlatform === 'ios' ? (
                                                <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="currentColor">
                                                    <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
                                                </svg>
                                            ) : (
                                                <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="currentColor">
                                                    <path d="M17.6 9.48l1.84-3.18c.16-.31.04-.69-.26-.85-.29-.15-.65-.06-.83.22l-1.88 3.24c-1.4-.59-2.96-.92-4.61-.92s-3.21.33-4.61.92L5.37 5.67c-.19-.29-.58-.38-.87-.2-.28.18-.37.54-.22.83L6.18 9.5C3.3 11.16 1.44 14.01 1 17.3h22c-.44-3.29-2.3-6.14-5.18-7.82zM7 15.25c-.69 0-1.25-.56-1.25-1.25s.56-1.25 1.25-1.25 1.25.56 1.25 1.25-.56 1.25-1.25 1.25zm10 0c-.69 0-1.25-.56-1.25-1.25s.56-1.25 1.25-1.25 1.25.56 1.25 1.25-.56 1.25-1.25 1.25z"/>
                                                </svg>
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
                                            <p>Tap the <span className="font-bold">{selectedPlatform === 'ios' ? 'Share' : 'Menu'}</span> button.</p>
                                        </div>
                                        <div className="flex gap-3">
                                            <div className="w-6 h-6 rounded-full bg-white border border-gray-200 flex items-center justify-center shrink-0 font-bold text-gray-900 mt-0.5">2</div>
                                            <p>Select <span className="font-bold">Add to Home Screen</span>.</p>
                                        </div>
                                    </div>
                                    <Button
                                        onClick={() => setInstallStep("select")}
                                        className="w-full mt-6 text-gray-500 hover:text-gray-900 text-sm font-medium"
                                    >
                                        Back to selection
                                    </Button>
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
