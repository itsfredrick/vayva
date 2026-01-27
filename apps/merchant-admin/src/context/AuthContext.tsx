"use client";
import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { useRouter, usePathname } from "next/navigation";
import { apiClient } from "@vayva/api-client";
import { User, MerchantContext } from "@vayva/shared";
import { ExtendedMerchant } from "@/lib/templates/types";
import { getAuthRedirect } from "@/lib/auth/redirects";
import { InactivityListener } from "@/components/auth/InactivityListener";

interface AuthContextType {
    user: User | null;
    merchant: ExtendedMerchant | null;
    isLoading: boolean;
    isAuthenticated: boolean;
    login: (newToken: string | undefined, newUser: User, newMerchant?: MerchantContext | null) => void;
    logout: () => Promise<void>;
    refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [merchant, setMerchant] = useState<ExtendedMerchant | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();
    const pathname = usePathname();

    const fetchProfile = async () => {
        try {
            const response = await apiClient.auth.me();
            if (response.success && response.data) {
                setUser(response.data.user);
                setMerchant((response.data.merchant || null) as any);
            } else {
                setUser(null);
                setMerchant(null);
            }
        }
        catch (_error: any) {
            setUser(null);
            setMerchant(null);
        }
    };

    useEffect(() => {
        fetchProfile().finally(() => setIsLoading(false));
    }, []);

    const login = (newToken: string | undefined, newUser: User, newMerchant?: MerchantContext | null) => {
        setUser(newUser);
        setMerchant((newMerchant || null) as any);
        const destination = getAuthRedirect(newUser, newMerchant || null);
        if (destination !== pathname) {
            router.replace(destination);
        }
    };

    const logout = async () => {
        try {
            await apiClient.auth.logout();
        }
        catch (e: any) {
            console.error("Logout error", e);
        }
        setUser(null);
        setMerchant(null);
        if (pathname !== "/signin") {
            router.replace("/signin");
        }
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
            "/status",
        ];

        const isPublicRoute = publicRoutes.some((p) => pathname === p || (p !== "/" && pathname.startsWith(p + "/")));
        const isAuthRoute = ["/signin", "/signup", "/verify"].includes(pathname);

        if (!user && !isPublicRoute) {
            if (pathname !== "/signin") {
                router.replace("/signin");
            }
            return;
        }

        if (user) {
            const destination = getAuthRedirect(user, merchant);

            if (isAuthRoute) {
                if (pathname.startsWith("/verify") && destination.startsWith("/verify")) {
                    return;
                }
                if (destination !== pathname) {
                    router.replace(destination);
                }
                return;
            }

            const isDestinationDashboard = destination === "/dashboard";
            const isDestinationOnboarding = destination.startsWith("/onboarding");
            const isDestinationVerify = destination.startsWith("/verify");

            if (isDestinationVerify && !pathname.startsWith("/verify")) {
                if (destination !== pathname) {
                    router.replace(destination);
                }
                return;
            }

            if (isDestinationOnboarding) {
                if (!pathname.startsWith("/onboarding")) {
                    if (destination !== pathname) {
                        router.replace(destination);
                    }
                    return;
                }
            }

            if (isDestinationDashboard) {
                if (pathname.startsWith("/onboarding")) {
                    if (destination !== pathname) {
                        router.replace(destination);
                    }
                    return;
                }
            }
        }
    }, [user, merchant, isLoading, pathname, router]);

    const value: AuthContextType = {
        user,
        merchant,
        isLoading,
        isAuthenticated: !!user,
        login,
        logout,
        refreshProfile: fetchProfile,
    };

    return (
        <AuthContext.Provider value={(value as any)} >
            <InactivityListener />
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context)
        throw new Error("useAuth must be used within AuthProvider");
    return context;
};
