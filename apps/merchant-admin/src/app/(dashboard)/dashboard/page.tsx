"use client";

import useSWR from "swr";
import Link from "next/link";
import { redirect } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useStore } from "@/context/StoreContext";
import { INDUSTRY_CONFIG } from "@/config/industry";
import { IndustrySlug } from "@/lib/templates/types";
import { formatCurrency } from "@/lib/i18n";
import { Button, Card, Icon } from "@vayva/ui";
import { DashboardSetupChecklist } from "@/components/dashboard/DashboardSetupChecklist";
import { extensionRegistry } from "@/lib/extensions/registry";

const fetcher = (url: string) => fetch(url).then((r) => r.json());

import { motion } from "framer-motion";

const StatWidget = ({
  title,
  value,
  loading,
  icon,
}: {
  title: string;
  value: string | number | null;
  loading?: boolean;
  icon?: string;
}) => (
  <motion.div
    whileHover={{ y: -4, transition: { duration: 0.2, ease: "easeOut" } }}
    className="p-5 bg-white border border-studio-border shadow-xl shadow-black/5 hover:shadow-2xl transition-shadow duration-300 group rounded-lg"
  >
    <div className="flex justify-between items-start mb-3">
      <div className="text-xs font-bold text-gray-400 uppercase tracking-wider">{title}</div>
      <div className="p-2 bg-studio-gray rounded-lg group-hover:bg-vayva-green transition-colors">
        <Icon name={(icon as any) || "Activity"} size={16} className="text-gray-400 group-hover:text-white" />
      </div>
    </div>
    <div className="text-3xl font-black text-black">
      {loading ? (
        <div className="h-8 w-24 bg-gray-100 rounded-lg animate-pulse" />
      ) : (
        value ?? "—"
      )}
    </div>
  </motion.div>
);

export default function DashboardPage() {
  const { merchant } = useAuth();
  const { store } = useStore();
  const { data: metricsData, isLoading: metricsLoading } = useSWR(
    "/api/dashboard/metrics",
    fetcher,
  );

  if (!merchant) return (
    <div className="p-8 max-w-7xl mx-auto space-y-6">
      <div className="h-8 w-48 bg-gray-100 rounded-lg animate-pulse mb-2" />
      <div className="h-4 w-64 bg-gray-50 rounded-lg animate-pulse mb-8" />
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-32 bg-gray-50 rounded-2xl animate-pulse" />
        ))}
      </div>
    </div>
  );

  // Redirect if no industry set — send to onboarding entry to resolve the correct step dynamically
  // Redirect if no industry set
  if (!(merchant as any).industrySlug) {
    // Fallback or send to settings
    return <div className="p-8">Please complete your store profile in Settings.</div>;
  }

  const industrySlug = (store?.industrySlug as IndustrySlug) || (merchant as any).industrySlug;
  const config = INDUSTRY_CONFIG[industrySlug];

  if (!config) {
    return <div className="p-8">Configuration Error: Unknown Industry</div>;
  }

  // Determine Main CTA
  let ctaLabel = `Create ${config.primaryObject.replace(/_/g, " ")}`;
  let ctaLink = `/dashboard/products/new`; // Safe default

  // Smart Lookup for Create Route
  // Find the module that handles the primary object (usually catalog, or explicitly defined create route)
  for (const mod of config.modules) {
    const route = config.moduleRoutes?.[mod]?.create;
    if (route) {
      ctaLink = route;
      break; // Found a specific create route, use it
    }
  }

  // Fallback Mapping if no explicit route found in config
  if (ctaLink === '/dashboard/products/new') {
    const map: Record<string, string> = {
      service: "/dashboard/services/new",
      event: "/dashboard/events/new",
      course: "/dashboard/courses/new",
      listing: "/dashboard/listings/new",
      post: "/dashboard/posts/new",
      project: "/dashboard/projects/new",
      campaign: "/dashboard/campaigns/new",
      menu_item: "/dashboard/menu-items/new",
      digital_asset: "/dashboard/digital-assets/new"
    };
    if (map[config.primaryObject]) {
      ctaLink = map[config.primaryObject];
    }
  }

  const metrics = metricsData?.metrics || {};

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-gray-500">
            Overview for {store?.name || "Your Store"} • <span className="capitalize">{config.displayName}</span>
          </p>
        </div>
        <Link href={ctaLink}>
          <Button size="lg" className="bg-vayva-green text-white hover:bg-vayva-green/90 shadow-xl shadow-green-500/20 font-bold">
            <Icon name="Plus" className="mr-2 h-4 w-4" />
            {ctaLabel}
          </Button>
        </Link>
      </div>

      {/* Widgets Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {config.dashboardWidgets.map((widget) => {
          if (widget.id === "setup_checklist") return null;
          if (widget.type === "stat") {
            let icon = "Activity";
            let title = widget.title;
            let value: string | number = "—";

            if (widget.id === "sales_today") {
              const amount = metrics.revenue?.value || 0;
              value = formatCurrency(amount, store?.currency || "NGN");
              icon = "DollarSign";
            } else if (widget.id === "orders_pending") {
              value = metrics.orders?.value || 0;
              icon = "ShoppingBag";
            } else if (widget.id === "customers_count") {
              value = metrics.customers?.value || 0;
              icon = "Users";
            }

            return (
              <div key={widget.id} className={`md:col-span-${widget.w || 1}`}>
                <StatWidget
                  title={title}
                  value={value}
                  loading={metricsLoading}
                  icon={icon}
                />
              </div>
            );
          }
          return null;
        })}

        {/* Extension Widgets (P2) */}
        {extensionRegistry.getActiveForStore(industrySlug, (merchant as any).enabledExtensionIds || []).map(ext =>
          ext.dashboardWidgets?.map(widget => (
            <div key={widget.id} className={`md:col-span-${widget.gridCols || 1}`}>
              <StatWidget
                title={widget.label}
                value={metrics[widget.id]?.value || metrics.custom?.[widget.id] || "—"}
                loading={metricsLoading}
              />
            </div>
          ))
        )}
      </div>

      <div className="grid grid-cols-1 gap-6">
        <DashboardSetupChecklist />
      </div>
    </div>
  );
}
