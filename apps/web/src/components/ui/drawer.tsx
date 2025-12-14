'use client';

import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { Icon } from './icon';
import { cn } from './glass-panel';

interface DrawerProps {
    isOpen: boolean;
    onClose: () => void;
    title?: string;
    children: React.ReactNode;
    width?: string; // e.g. "400px" or "max-w-md"
}

export const Drawer = ({ isOpen, onClose, title, children, width = 'w-[420px]' }: DrawerProps) => {
    const [mounted, setMounted] = useState(false);
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    useEffect(() => {
        if (isOpen) {
            setVisible(true);
            document.body.style.overflow = 'hidden';
        } else {
            const timer = setTimeout(() => setVisible(false), 300); // match transition duration
            document.body.style.overflow = '';
            return () => clearTimeout(timer);
        }
    }, [isOpen]);

    if (!mounted) return null;

    if (!visible && !isOpen) return null;

    return createPortal(
        <div className="fixed inset-0 z-50 flex justify-end transition-opacity duration-300">
            {/* Backdrop */}
            <div
                className={cn(
                    "absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300",
                    isOpen ? "opacity-100" : "opacity-0"
                )}
                onClick={onClose}
            />

            {/* Panel */}
            <div
                className={cn(
                    "relative h-full bg-[#142210]/95 backdrop-blur-xl border-l border-white/10 shadow-2xl transition-transform duration-300 ease-out transform",
                    width,
                    isOpen ? "translate-x-0" : "translate-x-full"
                )}
            >
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-white/5">
                    <h2 className="text-lg font-bold text-white">{title}</h2>
                    <button
                        onClick={onClose}
                        className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-text-secondary hover:text-white hover:bg-white/10 transition-colors"
                    >
                        <Icon name="close" size={20} />
                    </button>
                </div>

                {/* Content */}
                <div className="h-[calc(100vh-64px)] overflow-y-auto custom-scrollbar">
                    {children}
                </div>
            </div>
        </div>,
        document.body
    );
};
