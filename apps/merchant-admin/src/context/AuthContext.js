"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { createContext, useContext, useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { apiClient } from "@vayva/api-client";
import { getAuthRedirect } from "@/lib/auth/redirects";
import { InactivityListener } from "@/components/auth/InactivityListener";
const AuthContext = createContext(undefined);
export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [merchant, setMerchant] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();
    const pathname = usePathname();
    const fetchProfile = async () => {
        try {
            const data = await apiClient.auth.me();
            setUser(data.user);
            setMerchant(data.merchant || null);
        }
        catch (error) {
            // API not available in development or user not authenticated - this is expected
            // console.warn('Profile fetch skipped:', error instanceof Error ? error.message : 'API unavailable');
            setUser(null);
            setMerchant(null);
        }
    };
    useEffect(() => {
        // Since we use httpOnly cookies, we just try to fetch /me on mount
        fetchProfile().finally(() => setIsLoading(false));
    }, []);
    const login = (newToken, newUser, newMerchant) => {
        // Token is handled by gateway cookie, but we still update local state
        setUser(newUser);
        setMerchant(newMerchant || null);
        const destination = getAuthRedirect(newUser, newMerchant || null);
        router.push(destination);
    };
    const logout = async () => {
        try {
            await apiClient.auth.logout();
        }
        catch (e) {
            console.error("Logout error", e);
        }
        setUser(null);
        setMerchant(null);
        router.push("/signin");
    };
    // Route Guard & Redirection Logic
    useEffect(() => {
        if (isLoading)
            return;
        const publicRoutes = [
            "/signin",
            "/signup",
            "/forgot-password",
            "/reset-password",
            "/verify",
            "/",
            "/features",
            "/marketplace",
            "/pricing",
            "/templates",
            "/help",
            "/legal",
            "/contact",
            "/about",
            "/how-vayva-works",
            "/store-builder",
            "/careers",
            "/blog",
            "/community",
            "/trust",
            "/system-status",
        ];
        const isPublicRoute = publicRoutes.some((p) => pathname === p || (p !== "/" && pathname.startsWith(p + "/")));
        const isAuthRoute = ["/signin", "/signup", "/verify"].includes(pathname);
        // 1. Unauthenticated -> Redirect to Signin (protect private routes)
        if (!user && !isPublicRoute) {
            router.push("/signin");
            return;
        }
        // 2. Authenticated
        if (user) {
            const destination = getAuthRedirect(user, merchant);
            // If we are on an Auth Route, ALWAYs redirect to correct destination
            if (isAuthRoute) {
                // Special case: If we are on /verify and the destination IS /verify, stay.
                if (pathname.startsWith("/verify") && destination.startsWith("/verify")) {
                    return;
                }
                router.push(destination);
                return;
            }
            // If we are on a Private Route (e.g. Dashboard), ensure we are allowed to be here.
            // logic: If destination != /dashboard, and we are currently ON /dashboard (or anything that is not onboarding/verify), force redirect.
            const isDestinationDashboard = destination === "/dashboard";
            const isDestinationOnboarding = destination.startsWith("/onboarding");
            const isDestinationVerify = destination.startsWith("/verify");
            if (isDestinationVerify && !pathname.startsWith("/verify")) {
                router.push(destination);
                return;
            }
            if (isDestinationOnboarding) {
                // Allowed to be on /onboarding/*
                if (!pathname.startsWith("/onboarding")) {
                    router.push(destination);
                    return;
                }
            }
            if (isDestinationDashboard) {
                // If we are supposed to be on dashboard, but we are on /onboarding allow user to finish optional steps?
                // Or force dashboard?
                // Prompt: "Visiting /onboarding when onboarding complete -> redirected to /dashboard"
                if (pathname.startsWith("/onboarding")) {
                    router.push(destination);
                    return;
                }
            }
        }
    }, [user, merchant, isLoading, pathname]);
    const value = {
        user,
        merchant,
        isLoading,
        isAuthenticated: !!user,
        login,
        logout,
        refreshProfile: fetchProfile,
    };
    return (_jsxs(AuthContext.Provider, { value: value, children: [_jsx(InactivityListener, {}), children] }));
};
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context)
        throw new Error("useAuth must be used within AuthProvider");
    return context;
};
