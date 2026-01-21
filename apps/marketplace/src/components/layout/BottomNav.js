"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCart } from "@/context/CartContext";
import { Home, Search, ShoppingCart, Package } from "lucide-react";
import { Button, cn } from "@vayva/ui";
export function BottomNav() {
    const pathname = usePathname();
    const { cart, isOpen, setIsOpen } = useCart();
    // Hide on specific routes if needed (e.g., auth, checkout might want less distraction)
    if (pathname.includes("/auth"))
        return null;
    const toggleCart = () => setIsOpen(!isOpen);
    const navItems = [
        {
            label: "Home",
            href: "/",
            icon: Home,
            isActive: pathname === "/" || (pathname !== "/search" && pathname !== "/orders" && pathname !== "/profile")
        },
        {
            label: "Search",
            href: "/search",
            icon: Search,
            isActive: pathname.startsWith("/search")
        },
        {
            label: "Cart",
            onClick: toggleCart, // Open Sidebar instead of navigating
            icon: ShoppingCart,
            isActive: false, // Cart is a modal/drawer usually
            badge: cart?.items.length
        },
        {
            label: "Orders",
            href: "/orders",
            icon: Package,
            isActive: pathname.startsWith("/orders")
        },
        // {
        //     label: "Profile",
        //     href: "/profile",
        //     icon: User,
        //     isActive: pathname.startsWith("/profile")
        // }
    ];
    return (_jsx("div", { className: "fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 pb-safe md:hidden", children: _jsx("div", { className: "flex justify-around items-center h-16", children: navItems.map((item) => {
                const Icon = item.icon;
                const isActive = item.isActive;
                const content = (_jsxs("div", { className: cn("flex flex-col items-center justify-center w-full h-full space-y-1 relative", isActive ? "text-primary" : "text-gray-500 hover:text-gray-900"), children: [_jsxs("div", { className: "relative", children: [_jsx(Icon, { className: "h-6 w-6", strokeWidth: isActive ? 2.5 : 2 }), item.badge && item.badge > 0 ? (_jsx("span", { className: "absolute -top-1 -right-2 bg-red-500 text-white text-[10px] font-bold px-1.5 min-w-[16px] h-4 rounded-full flex items-center justify-center border-2 border-white", children: item.badge })) : null] }), _jsx("span", { className: "text-[10px] font-medium", children: item.label })] }));
                if (item.onClick) {
                    return (_jsx(Button, { onClick: item.onClick, variant: "ghost", className: "w-full h-full p-0", children: content }, item.label));
                }
                return (_jsx(Link, { href: item.href || "#", className: "w-full h-full", children: content }, item.label));
            }) }) }));
}
