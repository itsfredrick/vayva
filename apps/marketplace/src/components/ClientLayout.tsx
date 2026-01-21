
"use client";

import { CartProvider } from "@/context/CartContext";
import { CartDrawer } from "./cart/CartDrawer";
import { BottomNav } from "./layout/BottomNav";
import { PropsWithChildren } from "react";
import { SessionProvider } from "next-auth/react";

export function ClientLayout({ children }: PropsWithChildren) {
    return (
        <SessionProvider>
            <CartProvider>
                <div className="flex flex-col min-h-screen">
                    {/* Main content area padding for bottom nav on mobile */}
                    <div className="flex-1 pb-16 md:pb-0">
                        {children}
                    </div>
                </div>
                <CartDrawer />
                <BottomNav />
            </CartProvider>
        </SessionProvider>
    );
}
