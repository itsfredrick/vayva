"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Icon, Button } from "@vayva/ui";
import { useAuth } from "@/context/AuthContext";
export const CommandPalette = () => {
    const [open, setOpen] = useState(false);
    const router = useRouter();
    const { merchant } = useAuth();
    const [query, setQuery] = useState("");
    useEffect(() => {
        const down = (e) => {
            if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
                e.preventDefault();
                setOpen((open) => !open);
            }
        };
        document.addEventListener("keydown", down);
        return () => document.removeEventListener("keydown", down);
    }, []);
    const navItems = [
        { name: "Home", href: "/dashboard", icon: "LayoutDashboard" },
        { name: "Products", href: "/dashboard/products", icon: "Package" },
        { name: "Orders", href: "/dashboard/orders", icon: "ShoppingBag" },
        { name: "Customers", href: "/dashboard/customers", icon: "Users" },
        { name: "Settings", href: "/dashboard/settings/overview", icon: "Settings" },
        { name: "Help", href: "/dashboard/help", icon: "HelpCircle" },
    ];
    const filteredItems = navItems.filter((item) => item.name.toLowerCase().includes(query.toLowerCase()));
    const handleSelect = (href) => {
        router.push(href);
        setOpen(false);
        setQuery("");
    };
    if (!open)
        return null;
    return (_jsxs("div", { className: "fixed inset-0 z-50 flex items-start justify-center pt-[20vh] px-4", children: [_jsx("div", { className: "fixed inset-0 bg-black/40 backdrop-blur-sm transition-opacity", onClick: () => setOpen(false) }), _jsxs("div", { className: "relative w-full max-w-lg bg-white rounded-xl shadow-2xl overflow-hidden border border-gray-200 animate-in fade-in zoom-in-95 duration-200", children: [_jsxs("div", { className: "flex items-center border-b border-gray-100 px-3", children: [_jsx(Icon, { name: "Search", className: "mr-2 h-5 w-5 shrink-0 opacity-50" }), _jsx("input", { className: "flex h-12 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-gray-400 disabled:cursor-not-allowed disabled:opacity-50", placeholder: "Type a command or search...", value: query, onChange: (e) => setQuery(e.target.value), autoFocus: true }), _jsx("div", { className: "flex items-center gap-1 text-xs text-gray-400", children: _jsx("kbd", { className: "bg-gray-100 px-1.5 py-0.5 rounded border border-gray-200", children: "ESC" }) })] }), _jsxs("div", { className: "max-h-[300px] overflow-y-auto p-2", children: [filteredItems.length === 0 ? (_jsx("p", { className: "p-4 text-center text-sm text-gray-500", children: "No results found." })) : (_jsxs("div", { className: "space-y-1", children: [_jsx("p", { className: "px-2 py-1.5 text-xs font-semibold text-gray-400 uppercase tracking-wider", children: "Navigation" }), filteredItems.map((item) => (_jsxs(Button, { onClick: () => handleSelect(item.href), variant: "ghost", className: "w-full flex items-center gap-3 px-2 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-black rounded-lg transition-colors text-left", children: [_jsx(Icon, { name: item.icon, size: 16, className: "text-gray-500" }), item.name, _jsx(Icon, { name: "ArrowRight", size: 14, className: "ml-auto opacity-0 group-hover:opacity-50" })] }, item.href)))] })), _jsxs("div", { className: "mt-2 border-t border-gray-100 pt-2", children: [_jsxs("p", { className: "px-2 py-1.5 text-xs font-semibold text-indigo-500 uppercase tracking-wider flex items-center gap-1", children: [_jsx(Icon, { name: "Sparkles", size: 10 }), "Ask AI (Coming Soon)"] }), _jsx("div", { className: "px-2 py-2 text-xs text-gray-400 italic", children: "Try \"How do I add a product?\"" })] })] })] })] }));
};
