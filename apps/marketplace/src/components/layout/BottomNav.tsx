"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCart } from "@/context/CartContext";
import { Home, Search, ShoppingCart, Package, User } from "lucide-react";
import { Button, cn } from "@vayva/ui";

export function BottomNav() {
    const pathname = usePathname();
    const { cart, isOpen, setIsOpen } = useCart();

    // Hide on specific routes if needed (e.g., auth, checkout might want less distraction)
    if (pathname.includes("/auth")) return null;

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

    return (
        <div className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 pb-safe md:hidden">
            <div className="flex justify-around items-center h-16">
                {navItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = item.isActive;

                    const content = (
                        <div className={cn(
                            "flex flex-col items-center justify-center w-full h-full space-y-1 relative",
                            isActive ? "text-primary" : "text-gray-500 hover:text-gray-900"
                        )}>
                            <div className="relative">
                                <Icon className="h-6 w-6" strokeWidth={isActive ? 2.5 : 2} />
                                {item.badge && item.badge > 0 ? (
                                    <span className="absolute -top-1 -right-2 bg-red-500 text-white text-[10px] font-bold px-1.5 min-w-[16px] h-4 rounded-full flex items-center justify-center border-2 border-white">
                                        {item.badge}
                                    </span>
                                ) : null}
                            </div>
                            <span className="text-[10px] font-medium">{item.label}</span>
                        </div>
                    );

                    if (item.onClick) {
                        return (
                            <Button key={item.label} onClick={item.onClick} variant="ghost" className="w-full h-full p-0">
                                {content}
                            </Button>
                        );
                    }

                    return (
                        <Link key={item.label} href={item.href || "#"} className="w-full h-full">
                            {content}
                        </Link>
                    );
                })}
            </div>
        </div>
    );
}
