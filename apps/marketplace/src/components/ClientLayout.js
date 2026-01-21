"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { CartProvider } from "@/context/CartContext";
import { CartDrawer } from "./cart/CartDrawer";
import { BottomNav } from "./layout/BottomNav";
import { SessionProvider } from "next-auth/react";
export function ClientLayout({ children }) {
    return (_jsx(SessionProvider, { children: _jsxs(CartProvider, { children: [_jsx("div", { className: "flex flex-col min-h-screen", children: _jsx("div", { className: "flex-1 pb-16 md:pb-0", children: children }) }), _jsx(CartDrawer, {}), _jsx(BottomNav, {})] }) }));
}
