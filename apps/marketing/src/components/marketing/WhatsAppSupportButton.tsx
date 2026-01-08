"use client";

import React from "react";
import { MessageCircle } from "lucide-react";
import * as motion from "framer-motion/client";

export function WhatsAppSupportButton() {
    const WHATSAPP_NUMBER = "2348000000000"; // Replace with real support number
    const MESSAGE = "Hi Vayva Team! 🚀 I'm interested in using Vayva for my business and have a few questions.";

    const handleClick = () => {
        const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(MESSAGE)}`;
        window.open(url, "_blank");
    };

    return (
        <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={handleClick}
            className="fixed bottom-6 right-6 z-50 flex items-center gap-2 bg-[#25D366] text-white px-5 py-3 rounded-full shadow-2xl hover:bg-[#128C7E] transition-all group"
        >
            <MessageCircle className="w-6 h-6 fill-white" />
            <span className="font-bold text-sm">Chat with us</span>

            {/* Notification Badge */}
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full border-2 border-white animate-pulse" />
        </motion.button>
    );
}
