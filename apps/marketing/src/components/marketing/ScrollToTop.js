"use client";
import { jsx as _jsx } from "react/jsx-runtime";
import { useState, useEffect } from "react";
import { Button } from "@vayva/ui";
import { ArrowUp } from "lucide-react";
export function ScrollToTop() {
    const [isVisible, setIsVisible] = useState(false);
    useEffect(() => {
        const handleScroll = () => {
            // Show button when page is scrolled down
            if (window.scrollY > 500) {
                setIsVisible(true);
            }
            else {
                setIsVisible(false);
            }
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);
    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: "smooth",
        });
    };
    if (!isVisible)
        return null;
    return (_jsx(Button, { onClick: scrollToTop, className: "fixed bottom-24 right-5 z-[80] p-3 rounded-full bg-black text-white shadow-lg hover:bg-gray-800 hover:scale-110 transition-all duration-300 animate-in fade-in zoom-in", "aria-label": "Scroll to top", children: _jsx(ArrowUp, { size: 20 }) }));
}
