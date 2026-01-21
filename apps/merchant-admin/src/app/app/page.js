"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { getAuthRedirect } from "@/lib/auth/redirects";
import Image from "next/image";
export default function AppLaunchPage() {
    const router = useRouter();
    const { user, merchant, isLoading } = useAuth();
    useEffect(() => {
        if (isLoading)
            return;
        if (!user) {
            router.replace("/signin");
            return;
        }
        const destination = getAuthRedirect(user, merchant);
        router.replace(destination);
    }, [user, merchant, isLoading, router]);
    return (_jsxs("div", { className: "fixed inset-0 bg-black flex flex-col items-center justify-center z-50", children: [_jsx("div", { className: "animate-pulse", children: _jsx(Image, { src: "/icons/icon-192.png", alt: "Vayva", width: 100, height: 100, className: "w-24 h-24 mb-4", priority: true }) }), _jsxs("div", { className: "mt-8 flex space-x-2", children: [_jsx("div", { className: "w-2 h-2 bg-white rounded-full animate-bounce [animation-delay:-0.3s]" }), _jsx("div", { className: "w-2 h-2 bg-white rounded-full animate-bounce [animation-delay:-0.15s]" }), _jsx("div", { className: "w-2 h-2 bg-white rounded-full animate-bounce" })] })] }));
}
