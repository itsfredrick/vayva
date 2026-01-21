"use client";
import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState, useEffect } from "react";
import Link from "next/link";
import { Button, Icon, cn } from "@vayva/ui";
import { motion, AnimatePresence } from "framer-motion";
export const CookieBanner = () => {
    const [isVisible, setIsVisible] = useState(false);
    const [showPreferences, setShowPreferences] = useState(false);
    const [preferences, setPreferences] = useState({
        necessary: true,
        analytics: true,
        marketing: true,
    });
    useEffect(() => {
        const consent = localStorage.getItem("vayva_cookie_consent");
        if (!consent) {
            setIsVisible(true);
        }
    }, []);
    const handleAcceptAll = () => {
        const consent = {
            necessary: true,
            analytics: true,
            marketing: true,
            updatedAt: new Date().toISOString(),
        };
        localStorage.setItem("vayva_cookie_consent", JSON.stringify(consent));
        setIsVisible(false);
    };
    const handleRejectNonEssential = () => {
        const consent = {
            necessary: true,
            analytics: false,
            marketing: false,
            updatedAt: new Date().toISOString(),
        };
        localStorage.setItem("vayva_cookie_consent", JSON.stringify(consent));
        setIsVisible(false);
    };
    const handleSavePreferences = () => {
        const consent = { ...preferences, updatedAt: new Date().toISOString() };
        localStorage.setItem("vayva_cookie_consent", JSON.stringify(consent));
        setIsVisible(false);
        setShowPreferences(false);
    };
    if (!isVisible)
        return null;
    return (_jsxs(_Fragment, { children: [_jsx(AnimatePresence, { children: isVisible && !showPreferences && (_jsx(motion.div, { initial: { y: 100, opacity: 0 }, animate: { y: 0, opacity: 1 }, exit: { y: 100, opacity: 0 }, className: "fixed bottom-6 left-6 right-6 z-[100] md:left-auto md:right-6 md:translate-x-0 md:w-[420px]", children: _jsx("div", { className: "bg-white border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.12)] rounded-2xl p-6 md:p-8", children: _jsxs("div", { className: "flex flex-col md:flex-row items-start md:items-center gap-6", children: [_jsxs("div", { className: "flex-1", children: [_jsx("h3", { className: "text-lg font-bold text-black mb-2", children: "We value your privacy" }), _jsxs("p", { className: "text-sm text-gray-500 leading-relaxed", children: ["We use cookies to enhance your browsing experience, serve personalized ads or content, and analyze our traffic. By clicking \"Accept All\", you consent to our use of cookies. Read our", " ", _jsx(Link, { href: "/legal/cookies", className: "text-black underline font-medium", children: "Cookie Policy" }), "."] })] }), _jsxs("div", { className: "flex flex-col gap-2 w-full md:w-auto shrink-0", children: [_jsx(Button, { onClick: handleAcceptAll, className: "!bg-black !text-white !rounded-xl whitespace-nowrap", children: "Accept All" }), _jsxs("div", { className: "flex gap-2", children: [_jsx(Button, { variant: "ghost", size: "sm", onClick: handleRejectNonEssential, className: "flex-1 text-gray-500 hover:text-black", children: "Reject" }), _jsx(Button, { variant: "ghost", size: "sm", onClick: () => setShowPreferences(true), className: "flex-1 text-gray-500 hover:text-black", children: "Manage" })] })] })] }) }) })) }), _jsx(AnimatePresence, { children: showPreferences && (_jsx("div", { className: "fixed inset-0 z-[110] flex items-center justify-center p-6 bg-black/20 backdrop-blur-sm", children: _jsxs(motion.div, { initial: { scale: 0.95, opacity: 0 }, animate: { scale: 1, opacity: 1 }, className: "bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden", children: [_jsxs("div", { className: "p-6 border-b border-gray-100 flex items-center justify-between", children: [_jsx("h3", { className: "font-bold text-lg", children: "Cookie Preferences" }), _jsx(Button, { onClick: () => setShowPreferences(false), className: "text-gray-400 hover:text-black", children: _jsx(Icon, { name: "X", size: 20 }) })] }), _jsxs("div", { className: "p-6 space-y-6", children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { children: [_jsx("h4", { className: "font-bold text-sm", children: "Necessary Cookies" }), _jsx("p", { className: "text-xs text-gray-500", children: "Essential for the website to function." })] }), _jsx("div", { className: "w-10 h-5 bg-black rounded-full relative", children: _jsx("div", { className: "absolute right-1 top-1 w-3 h-3 bg-white rounded-full" }) })] }), _jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { children: [_jsx("h4", { className: "font-bold text-sm", children: "Analytics" }), _jsx("p", { className: "text-xs text-gray-500", children: "Help us understand how visitors interact with the site." })] }), _jsx(Button, { onClick: () => setPreferences({
                                                    ...preferences,
                                                    analytics: !preferences.analytics,
                                                }), className: cn("w-10 h-5 rounded-full relative transition-colors", preferences.analytics ? "bg-black" : "bg-gray-200"), children: _jsx("div", { className: cn("absolute top-1 w-3 h-3 bg-white rounded-full transition-all", preferences.analytics ? "right-1" : "left-1") }) })] }), _jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { children: [_jsx("h4", { className: "font-bold text-sm", children: "Marketing" }), _jsx("p", { className: "text-xs text-gray-500", children: "Used to deliver more relevant advertisements." })] }), _jsx(Button, { onClick: () => setPreferences({
                                                    ...preferences,
                                                    marketing: !preferences.marketing,
                                                }), className: cn("w-10 h-5 rounded-full relative transition-colors", preferences.marketing ? "bg-black" : "bg-gray-200"), children: _jsx("div", { className: cn("absolute top-1 w-3 h-3 bg-white rounded-full transition-all", preferences.marketing ? "right-1" : "left-1") }) })] })] }), _jsxs("div", { className: "p-6 bg-gray-50 flex gap-3", children: [_jsx(Button, { variant: "ghost", onClick: () => setShowPreferences(false), className: "flex-1", children: "Cancel" }), _jsx(Button, { onClick: handleSavePreferences, className: "flex-1 !bg-black !text-white", children: "Save Preferences" })] })] }) })) })] }));
};
