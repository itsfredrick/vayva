import { format } from "date-fns";
import {
  ShoppingBag,
  Users,
  MessageSquare,
  TrendingUp,
  Clock,
  ChevronRight,
  ExternalLink,
  Package,
  AlertCircle
} from "lucide-react";
import Link from "next/link";
import React from "react";

// Types
export interface DashboardStats {
  orders: { count: number; growth: number };
  customers: { count: number; growth: number };
  revenue: { amount: string; growth: number };
  avgOrderValue: { amount: string; growth: number };
}

export interface RecentOrder {
  id: string;
  customer: string;
  amount: string;
  status: "PAID" | "PENDING" | "FAILED" | "CANCELLED";
  createdAt: Date;
}

export interface Activity {
  id: string;
  type: "ORDER" | "CUSTOMER" | "INVENTORY" | "SYSTEM";
  message: string;
  createdAt: Date;
}

export interface StoreContext {
  id: string;
  slug: string;
  storeName: string;
  logoUrl?: string;
  brandColor?: string;
  status: string;
}

// Components
export const StatCard = ({ title, value, growth, icon: Icon, color }: {
  title: string;
  value: string;
  growth: number;
  icon: React.ElementType;
  color: string;
}) => (
  <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm transition-all hover:shadow-md">
    <div className="flex justify-between items-start mb-4">
      <div className={`p-2.5 rounded-lg ${color} bg-opacity-10`}>
        <Icon className={`w-5 h-5 ${color.replace('bg-', 'text-')}`} />
      </div>
      <div className={`flex items-center text-sm font-medium ${growth >= 0 ? 'text-green-600' : 'text-red-500'}`}>
        {growth >= 0 ? '+' : ''}{growth}%
        <TrendingUp className={`w-4 h-4 ml-1 ${growth < 0 ? 'rotate-180' : ''}`} />
      </div>
    </div>
    <div className="text-sm text-gray-500 font-medium mb-1">{title}</div>
    <div className="text-2xl font-bold text-gray-900 tracking-tight">{value}</div>
  </div>
);

export const OrderStatusBadge = ({ status }: { status: RecentOrder["status"] }) => {
  const styles = {
    PAID: "bg-green-50 text-green-700 border-green-100",
    PENDING: "bg-amber-50 text-amber-700 border-amber-100",
    FAILED: "bg-red-50 text-red-700 border-red-100",
    CANCELLED: "bg-gray-50 text-gray-600 border-gray-100",
  };
  return (
    <span className={`px-2.5 py-1 rounded-full text-xs font-semibold border ${styles[status]}`}>
      {status}
    </span>
  );
};

export const ActivityIcon = ({ type }: { type: Activity["type"] }) => {
  switch (type) {
    case "ORDER": return <ShoppingBag className="w-4 h-4 text-blue-500" />;
    case "CUSTOMER": return <Users className="w-4 h-4 text-purple-500" />;
    case "INVENTORY": return <Package className="w-4 h-4 text-orange-500" />;
    default: return <Clock className="w-4 h-4 text-gray-400" />;
  }
};

/**
 * Modern Store Summary Card
 */
interface CustomCSSProperties extends React.CSSProperties {
  "--brand-opacity-10"?: string;
}

export const StoreSummaryCard = ({ store, isPublished }: { store: StoreContext; isPublished: boolean }) => {
  const APP_DOMAIN = process.env.NEXT_PUBLIC_APP_DOMAIN || "vayva.app";
  const storefrontBase = process.env.NEXT_PUBLIC_STOREFRONT_URL ||
    (process.env.NODE_ENV === "production" ? "https://vayva.store" : "http://localhost:3001");
  const storeUrl = isPublished
    ? `https://${store.slug}.${APP_DOMAIN}`
    : `${storefrontBase}?store=${store.slug}`;


  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 flex flex-col h-full gap-6">
      <div className="flex items-center gap-4">
        <div
          style={{ "--brand-opacity-10": store.brandColor ? `${store.brandColor}10` : "transparent" } as CustomCSSProperties}
          className="w-16 h-16 rounded-lg border border-gray-100 flex items-center justify-center overflow-hidden bg-gray-50 text-2xl font-bold text-black bg-[var(--brand-opacity-10)]"
        >
          {store.logoUrl ? (
            <img
              src={store.logoUrl}
              alt={store.storeName}
              className="w-full h-full object-cover"
            />
          ) : (
            store.storeName[0]
          )}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h2 className="text-xl font-bold text-gray-900 truncate">{store.storeName}</h2>
            {isPublished ? (
              <span className="px-2 py-0.5 bg-green-50 text-green-700 text-[10px] font-bold uppercase rounded border border-green-100 leading-tight">Live</span>
            ) : (
              <span className="px-2 py-0.5 bg-gray-50 text-gray-500 text-[10px] font-bold uppercase rounded border border-gray-100 leading-tight">Draft</span>
            )}
          </div>
          <a
            href={storeUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-gray-500 hover:text-gray-900 flex items-center gap-1 group transition-colors"
          >
            {store.slug}.{APP_DOMAIN}
            <ExternalLink className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
          </a>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="bg-gray-50 rounded-lg p-3 border border-gray-100">
          <div className="text-[10px] uppercase font-bold text-gray-400 mb-1">Status</div>
          <div className="text-sm font-semibold text-gray-700">{store.status}</div>
        </div>
        <div className="bg-gray-50 rounded-lg p-3 border border-gray-100">
          <div className="text-[10px] uppercase font-bold text-gray-400 mb-1">Last Update</div>
          <div className="text-sm font-semibold text-gray-700">Today</div>
        </div>
      </div>

      {!isPublished && (
        <div className="mt-auto bg-amber-50 border border-amber-100 rounded-lg p-4 flex gap-3 items-start">
          <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <div>
            <div className="text-sm font-bold text-amber-900 mb-1">Finish Publishing</div>
            <p className="text-xs text-amber-800 leading-relaxed opacity-80">
              Your store is currently in draft mode and not visible to customers. Complete your profile to go live.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
