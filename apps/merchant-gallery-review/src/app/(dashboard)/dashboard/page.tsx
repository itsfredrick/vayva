"use client";

import React, { Suspense } from "react";
import dynamic from "next/dynamic";
import { ErrorBoundary } from "@vayva/ui";
import Link from "next/link";
import { Skeleton } from "@/components/LoadingSkeletons";

// Lazy Load Heavy Components
const GoLiveCard = dynamic(
  () =>
    import("@/components/dashboard/GoLiveCard").then((mod) => mod.GoLiveCard),
  {
    loading: () => <Skeleton className="h-48 w-full rounded-xl" />,
    ssr: false, // Client-side interaction mostly
  },
);

const WelcomeModal = dynamic(
  () => import("@/components/dashboard/WelcomeModal").then((mod) => mod.WelcomeModal),
  { ssr: false }
);

const DashboardSetupChecklist = dynamic(
  () =>
    import("@/components/dashboard/DashboardSetupChecklist").then(
      (mod) => mod.DashboardSetupChecklist,
    ),
  {
    loading: () => <Skeleton className="h-64 w-full rounded-xl" />,
  },
);

const ActivationWelcome = dynamic(
  () =>
    import("@/components/dashboard/ActivationWelcome").then(
      (mod) => mod.ActivationWelcome,
    ),
  {
    loading: () => <Skeleton className="h-32 w-full rounded-xl" />,
  },
);

// Import Widgets lazily as well
const BusinessHealthWidget = dynamic(
  () =>
    import("@/components/dashboard/BusinessHealthWidget").then(
      (mod) => mod.BusinessHealthWidget,
    ),
  {
    loading: () => <Skeleton className="h-64 w-full rounded-xl" />,
  },
);

const AiUsageWidget = dynamic(
  () =>
    import("@/components/dashboard/AiUsageWidget").then(
      (mod) => mod.AiUsageWidget,
    ),
  {
    loading: () => <Skeleton className="h-64 w-full rounded-xl" />,
  },
);

export default function DashboardPage() {
  const [healthData, setHealthData] = React.useState<any>(null);
  const [category, setCategory] = React.useState<string>("retail");
  const [merchantData, setMerchantData] = React.useState<any>(null);
  const [showWelcome, setShowWelcome] = React.useState(false);

  React.useEffect(() => {
    fetch("/api/dashboard/health")
      .then((res) => res.json())
      .then((res) => {
        if (res.success) setHealthData(res.data);
      })
      .catch(console.error);

    fetch("/api/auth/merchant/me")
      .then((res) => res.json())
      .then((data) => {
        setMerchantData(data);
        if (data.store?.category) setCategory(data.store.category);

        // Show welcome if first time (using local storage for now, ideally DB)
        const hasSeen = localStorage.getItem("vayva_welcome_seen");
        if (!hasSeen && data.store?.slug) {
          setShowWelcome(true);
          localStorage.setItem("vayva_welcome_seen", "true");
        }
      })
      .catch(console.error);
  }, []);

  return (
    <div className="p-4 md:p-6 max-w-7xl mx-auto space-y-6">
      {/* Welcome Modal */}
      {merchantData && (
        <React.Suspense fallback={null}>
          {/* @ts-ignore */}
          <WelcomeModal
            isOpen={showWelcome}
            onClose={() => setShowWelcome(false)}
            merchantName={merchantData.user?.firstName || "Merchant"}
            storeSlug={merchantData.store?.slug || ""}
            category={category}
          />
        </React.Suspense>
      )}

      {/* ... Header and other components ... */}

      <header className="mb-4 md:mb-8">
        <h1 className="text-2xl md:text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600">
          Overview
        </h1>
        <p className="text-sm md:text-base text-gray-500 mt-1">
          Welcome back to Vayva.
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Go Live Checklist (First 24h) - Replaces ActivationWelcome for now */}
          <Suspense fallback={<Skeleton className="h-64 w-full" />}>
            <DashboardSetupChecklist />
          </Suspense>

          {/* Main Metrics Area */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <ErrorBoundary>
              <Suspense fallback={<Skeleton className="h-64 w-full" />}>
                {healthData ? (
                  <BusinessHealthWidget data={healthData} />
                ) : (
                  <Skeleton className="h-64 w-full rounded-xl" />
                )}
              </Suspense>
            </ErrorBoundary>
            <ErrorBoundary>
              <Suspense fallback={<Skeleton className="h-64 w-full" />}>
                <AiUsageWidget />
              </Suspense>
            </ErrorBoundary>
          </div>
        </div>

        {/* ... Right Column components ... */}
        <div className="space-y-6">
          {/* Operations Column */}
          <Suspense fallback={<Skeleton className="h-48 w-full" />}>
            <GoLiveCard />
          </Suspense>

          {/* Quick Actions */}
          <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
            <h3 className="font-bold mb-4 text-gray-900">Quick Actions</h3>
            <div className="space-y-2">
              {/* Dynamic Primary Action */}
              {category === "real-estate" ? (
                <Link href="/dashboard/products/new" className="w-full text-left px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 hover:text-black rounded-lg transition-colors flex items-center justify-between group">
                  <span>Add Property</span>
                  <span className="opacity-0 group-hover:opacity-100 transition-opacity">→</span>
                </Link>
              ) : category === "services" || category === "education" ? (
                <Link href="/dashboard/bookings/new" className="w-full text-left px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 hover:text-black rounded-lg transition-colors flex items-center justify-between group">
                  <span>Create Booking</span>
                  <span className="opacity-0 group-hover:opacity-100 transition-opacity">→</span>
                </Link>
              ) : (
                <Link href="/dashboard/products/new" className="w-full text-left px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 hover:text-black rounded-lg transition-colors flex items-center justify-between group">
                  <span>Add {category === "food" ? "Menu Item" : "Product"}</span>
                  <span className="opacity-0 group-hover:opacity-100 transition-opacity">→</span>
                </Link>
              )}

              <Link href="/dashboard/settings/branding" className="w-full text-left px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 hover:text-black rounded-lg transition-colors flex items-center justify-between group">
                <span>Customize Theme</span>
                <span className="opacity-0 group-hover:opacity-100 transition-opacity">→</span>
              </Link>

              {!["real-estate", "services", "education"].includes(category) && (
                <Link href="/dashboard/orders" className="w-full text-left px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 hover:text-black rounded-lg transition-colors flex items-center justify-between group">
                  <span>View Orders</span>
                  <span className="opacity-0 group-hover:opacity-100 transition-opacity">→</span>
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
