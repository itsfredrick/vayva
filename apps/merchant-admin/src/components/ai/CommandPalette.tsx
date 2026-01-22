"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Icon, Button } from "@vayva/ui";
import { useAuth } from "@/context/AuthContext";

export const CommandPalette = () => {
    const [open, setOpen] = useState(false);
    const router = useRouter();
    const { merchant } = useAuth();
    const [query, setQuery] = useState("");

    useEffect(() => {
        const down = (e: KeyboardEvent) => {
            if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
                e.preventDefault();
                setOpen((open) => !open);
            }
        };

        // Expose trigger globally for button clicks
        (window as unknown).triggerCommandPalette = () => setOpen(prev => !prev);

        document.addEventListener("keydown", down);
        return () => {
            document.removeEventListener("keydown", down);
            delete (window as unknown).triggerCommandPalette;
        };
    }, []);

    const navItems = [
        { name: "Home", href: "/dashboard", icon: "LayoutDashboard" },
        { name: "Products", href: "/dashboard/products", icon: "Package" },
        { name: "Orders", href: "/dashboard/orders", icon: "ShoppingBag" },
        { name: "Customers", href: "/dashboard/customers", icon: "Users" },
        { name: "Settings", href: "/dashboard/settings/overview", icon: "Settings" },
        { name: "Help", href: "/dashboard/help", icon: "HelpCircle" },
    ];

    const filteredItems = navItems.filter((item) =>
        item.name.toLowerCase().includes(query.toLowerCase())
    );

    const handleSelect = (href: string) => {
        router.push(href);
        setOpen(false);
        setQuery("");
    };

    if (!open) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-[20vh] px-4">
            <div
                className="fixed inset-0 bg-black/40 backdrop-blur-sm transition-opacity"
                onClick={() => setOpen(false)}
            />

            <div className="relative w-full max-w-lg bg-white rounded-xl shadow-2xl overflow-hidden border border-gray-200 animate-in fade-in zoom-in-95 duration-200">
                <div className="flex items-center border-b border-gray-100 px-3">
                    <Icon name="Search" className="mr-2 h-5 w-5 shrink-0 opacity-50" />
                    <input
                        className="flex h-12 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-gray-400 disabled:cursor-not-allowed disabled:opacity-50"
                        placeholder="Type a command or search..."
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        autoFocus
                    />
                    <div className="flex items-center gap-1 text-xs text-gray-400">
                        <kbd className="bg-gray-100 px-1.5 py-0.5 rounded border border-gray-200">ESC</kbd>
                    </div>
                </div>

                <div className="max-h-[300px] overflow-y-auto p-2">
                    {filteredItems.length === 0 ? (
                        <p className="p-4 text-center text-sm text-gray-500">
                            No results found.
                        </p>
                    ) : (
                        <div className="space-y-1">
                            <p className="px-2 py-1.5 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                                Navigation
                            </p>
                            {filteredItems.map((item) => (
                                <Button
                                    key={item.href}
                                    onClick={() => handleSelect(item.href)}
                                    variant="ghost"
                                    className="w-full flex items-center gap-3 px-2 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-black rounded-lg transition-colors text-left"
                                >
                                    <Icon name={item.icon as unknown} size={16} className="text-gray-500" />
                                    {item.name}
                                    <Icon name="ArrowRight" size={14} className="ml-auto opacity-0 group-hover:opacity-50" />
                                </Button>
                            ))}
                        </div>
                    )}

                    {/* AI Section Upsell */}
                    <div className="mt-2 border-t border-gray-100 pt-2">
                        <p className="px-2 py-1.5 text-xs font-semibold text-indigo-500 uppercase tracking-wider flex items-center gap-1">
                            <Icon name="Sparkles" size={10} />
                            Ask AI (Coming Soon)
                        </p>
                        <div className="px-2 py-2 text-xs text-gray-400 italic">
                            Try "How do I add a product?"
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
