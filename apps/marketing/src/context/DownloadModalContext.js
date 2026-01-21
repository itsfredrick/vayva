"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { createContext, useContext, useState } from "react";
import { Button } from "@vayva/ui";
import { X } from "lucide-react";
const DownloadModalContext = createContext(undefined);
export function DownloadModalProvider({ children }) {
    const [isOpen, setIsOpen] = useState(false);
    const [installStep, setInstallStep] = useState("select");
    const [selectedPlatform, setSelectedPlatform] = useState(null);
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
    return (_jsxs(DownloadModalContext.Provider, { value: { openDownloadModal, closeDownloadModal }, children: [children, isOpen && (_jsxs("div", { className: "fixed inset-0 z-[200] flex items-center justify-center p-4", children: [_jsx("div", { className: "absolute inset-0 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200", onClick: closeDownloadModal }), _jsx("div", { className: "relative bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200", children: _jsxs("div", { className: "p-6", children: [_jsxs("div", { className: "flex justify-between items-center mb-6", children: [_jsx("h3", { className: "text-xl font-bold text-gray-900", children: installStep === "select" ? "Select your device" : "How to install" }), _jsx(Button, { onClick: closeDownloadModal, className: "p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-500", children: _jsx(X, { size: 20 }) })] }), installStep === "select" ? (_jsxs("div", { className: "grid grid-cols-2 gap-4", children: [_jsxs(Button, { onClick: handleIOSClick, className: "flex flex-col items-center justify-center gap-4 p-8 rounded-2xl border-2 border-gray-100 hover:border-gray-900 hover:bg-gray-50 transition-all group", children: [_jsx("div", { className: "w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center group-hover:bg-white group-hover:shadow-lg transition-all text-gray-900", children: _jsx("span", { className: "font-bold text-xl", children: "iOS" }) }), _jsx("span", { className: "font-bold text-gray-900", children: "iPhone" })] }), _jsxs(Button, { onClick: handleAndroidClick, className: "flex flex-col items-center justify-center gap-4 p-8 rounded-2xl border-2 border-gray-100 hover:border-[#22C55E] hover:bg-green-50 transition-all group", children: [_jsx("div", { className: "w-16 h-16 rounded-full bg-green-100 flex items-center justify-center group-hover:bg-[#22C55E] group-hover:shadow-lg transition-all text-[#22C55E] group-hover:text-white", children: _jsx("span", { className: "font-bold text-xl", children: "And" }) }), _jsx("span", { className: "font-bold text-gray-900", children: "Android" })] })] })) : (_jsxs("div", { className: "bg-gray-50 rounded-2xl p-6", children: [_jsxs("div", { className: "flex items-center gap-4 mb-4", children: [_jsx("div", { className: `w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${selectedPlatform === 'ios' ? 'bg-gray-900 text-white' : 'bg-[#22C55E] text-white'}`, children: _jsx("span", { className: "font-bold text-lg", children: selectedPlatform === 'ios' ? 'iOS' : 'And' }) }), _jsxs("div", { children: [_jsx("p", { className: "font-bold text-gray-900", children: "Follow these steps:" }), _jsx("p", { className: "text-sm text-gray-500", children: "Install Vayva on your home screen" })] })] }), _jsxs("div", { className: "space-y-4 text-sm text-gray-600", children: [_jsxs("div", { className: "flex gap-3", children: [_jsx("div", { className: "w-6 h-6 rounded-full bg-white border border-gray-200 flex items-center justify-center shrink-0 font-bold text-gray-900 mt-0.5", children: "1" }), _jsxs("p", { children: ["Tap the ", _jsx("span", { className: "font-bold", children: selectedPlatform === 'ios' ? 'Share' : 'Menu' }), " button."] })] }), _jsxs("div", { className: "flex gap-3", children: [_jsx("div", { className: "w-6 h-6 rounded-full bg-white border border-gray-200 flex items-center justify-center shrink-0 font-bold text-gray-900 mt-0.5", children: "2" }), _jsxs("p", { children: ["Select ", _jsx("span", { className: "font-bold", children: "Add to Home Screen" }), "."] })] })] }), _jsx(Button, { onClick: () => setInstallStep("select"), className: "w-full mt-6 text-gray-500 hover:text-gray-900 text-sm font-medium", children: "Back to selection" })] }))] }) })] }))] }));
}
export const useDownloadModal = () => {
    const context = useContext(DownloadModalContext);
    if (!context) {
        throw new Error("useDownloadModal must be used within a DownloadModalProvider");
    }
    return context;
};
