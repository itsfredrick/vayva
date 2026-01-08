"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { apiClient } from "@vayva/api-client";
import {
  User,
  MerchantContext,
  UserRole,
  OnboardingStatus,
  BusinessType,
} from "@vayva/shared";

import { InactivityListener } from "@/components/auth/InactivityListener";

interface AuthContextType {
  user: User | null;
  merchant: MerchantContext | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (token: string, user: User, merchant?: MerchantContext) => void;
  logout: () => void;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [merchant, setMerchant] = useState<MerchantContext | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const router = useRouter();
  const pathname = usePathname();

  const fetchProfile = async () => {
    try {
      const data = await apiClient.auth.me();
      setUser(data.user);
      setMerchant(data.merchant || null);
    } catch (error) {
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

  const login = (
    newToken: string,
    newUser: User,
    newMerchant?: MerchantContext,
  ) => {
    // Token is handled by gateway cookie, but we still update local state
    setUser(newUser);
    setMerchant(newMerchant || null);

    if (newMerchant?.onboardingStatus === OnboardingStatus.COMPLETE) {
      router.push("/admin/dashboard");
    } else {
      router.push("/onboarding/resume");
    }
  };

  const logout = async () => {
    try {
      await apiClient.auth.logout();
    } catch (e) {
      console.error("Logout error", e);
    }
    setUser(null);
    setMerchant(null);
    router.push("/signin");
  };

  // Route Guard & Redirection Logic
  useEffect(() => {
    if (isLoading) return;

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

    const isPublicRoute = publicRoutes.some(
      (p) => pathname === p || (p !== "/" && pathname.startsWith(p + "/")),
    );
    const isAuthRoute = ["/signin", "/signup", "/verify"].includes(pathname);

    if (!user && !isPublicRoute) {
      router.push("/signin");
      return;
    }

    if (user) {
      if (isAuthRoute) {
        if (merchant?.onboardingStatus === OnboardingStatus.COMPLETE) {
          router.push("/admin/dashboard");
        } else {
          router.push("/onboarding/resume");
        }
        return;
      }

      // Enhanced Onboarding Gating
      if (merchant) {
        const isConfigured = [
          OnboardingStatus.COMPLETE,
          OnboardingStatus.REQUIRED_COMPLETE,
          OnboardingStatus.OPTIONAL_INCOMPLETE,
        ].includes(merchant.onboardingStatus);

        // Block dashboard access if onboarding incomplete/not configured
        if (pathname.startsWith("/admin") && !isConfigured) {
          router.push("/onboarding/resume");
          return;
        }

        // Block direct onboarding access if already fully configured (optional)
        // However, user might want to access optional steps via /onboarding URLs.
        // The prompt says: "send to /admin/dashboard with checklist" if REQUIRED_COMPLETE.
        if (
          pathname.startsWith("/onboarding") &&
          isConfigured &&
          pathname !== "/onboarding/resume"
        ) {
          // Allow specific onboarding sub-routes if they are part of the optional checklist
          const allowedOptionalRoutes = [
            "/onboarding/whatsapp",
            "/onboarding/order-flow",
            "/onboarding/payments",
            "/onboarding/delivery",
            "/onboarding/team",
            "/onboarding/kyc",
          ];

          const isOptionalStep = allowedOptionalRoutes.some((p) =>
            pathname.startsWith(p),
          );
          if (!isOptionalStep) {
            router.push("/admin/dashboard");
            return;
          }
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


  return (
    <AuthContext.Provider value={value}>
      <InactivityListener />
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};
