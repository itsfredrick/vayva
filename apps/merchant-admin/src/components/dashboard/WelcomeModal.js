"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect } from "react";
import confetti from "canvas-confetti";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@vayva/ui";
import { useRouter } from "next/navigation";
export function WelcomeModal({ isOpen, onClose, merchantName, storeSlug, category, }) {
    const router = useRouter();
    useEffect(() => {
        if (isOpen) {
            // Fire confetti
            const duration = 2000;
            const animationEnd = Date.now() + duration;
            const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 9999 };
            const randomInRange = (min, max) => Math.random() * (max - min) + min;
            const interval = setInterval(function () {
                const timeLeft = animationEnd - Date.now();
                if (timeLeft <= 0) {
                    return clearInterval(interval);
                }
                const particleCount = 50 * (timeLeft / duration);
                confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } });
                confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } });
            }, 250);
            return () => clearInterval(interval);
        }
    }, [isOpen]);
    const getSuccessMessage = (cat) => {
        const c = cat.toLowerCase();
        if (c === "real-estate")
            return "Let's get your first property viewing scheduled!";
        if (c === "food")
            return "Ready to take your first order? Your menu is live.";
        if (c === "services" || c === "beauty")
            return "Your calendar is open for bookings!";
        return "Ready to make your first sale?";
    };
    const storeUrl = `https://${storeSlug}.vayva.ng`;
    return (_jsx(Dialog, { open: isOpen, onOpenChange: onClose, children: _jsxs(DialogContent, { className: "sm:max-w-md text-center p-8 overflow-hidden bg-white", children: [_jsx("div", { className: "mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-6 animate-bounce", children: _jsx("span", { className: "text-4xl", children: "\uD83C\uDF89" }) }), _jsxs("h2", { className: "text-2xl font-bold text-gray-900 mb-2", children: ["Congratulations, ", merchantName, "!"] }), _jsxs("p", { className: "text-gray-500 mb-6", children: ["Your store is officially live. \uD83C\uDF8A", _jsx("br", {}), getSuccessMessage(category)] }), _jsxs("div", { className: "bg-gray-50 p-4 rounded-xl border border-gray-100 mb-6", children: [_jsx("p", { className: "text-xs text-gray-400 uppercase font-bold mb-2", children: "Your Live Storefront" }), _jsxs("a", { href: storeUrl, target: "_blank", rel: "noopener noreferrer", className: "text-lg font-bold text-black border-b border-black border-dashed hover:text-indigo-600 transition-colors", children: [storeSlug, ".vayva.ng"] })] }), _jsx(Button, { onClick: onClose, size: "lg", className: "w-full bg-black text-white hover:bg-gray-800 rounded-xl h-12", children: "Let's Get Started" })] }) }));
}
