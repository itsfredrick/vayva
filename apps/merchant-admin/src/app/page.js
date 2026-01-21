"use client";
import { jsx as _jsx } from "react/jsx-runtime";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { getAuthRedirect } from "@/lib/auth/redirects";
// import { LoadingSpinner } from "@vayva/ui";
export default function RootPage() {
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
    return (_jsx("div", { className: "flex items-center justify-center min-h-screen bg-gray-50", children: _jsx("div", { className: "animate-spin rounded-full h-8 w-8 border-b-2 border-primary" }) }));
}
