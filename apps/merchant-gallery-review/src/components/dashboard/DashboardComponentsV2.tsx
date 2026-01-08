"use client";

import React from "react";
import Link from "next/link";
import { Icon, cn } from "@vayva/ui";
import { motion } from "framer-motion";

// Generic Hover Wrapper for "Physics"
const MotionCard = ({
  children,
  className,
  onClick,
}: {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}) => (
  <motion.div
    className={cn(
      "bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden cursor-pointer",
      className,
    )}
    whileHover={{
      y: -3,
      scale: 1.01,
      boxShadow: "0 10px 30px -10px rgba(0,0,0,0.05)",
    }}
    whileTap={{ scale: 0.98 }}
    onClick={onClick}
  >
    {children}
  </motion.div>
);

// B2) KPI Card V2
export const KPICardV2 = ({
  title,
  value,
  delta,
  isPositive,
  isPrimary,
}: any) => (
  <motion.div
    className={cn(
      "bg-white rounded-xl border p-5 flex flex-col gap-2 relative overflow-hidden group hover:shadow-md transition-shadow",
      isPrimary ? "border-gray-200" : "border-gray-100",
    )}
    whileHover={{ y: -2 }}
  >
    <div className="flex items-center justify-between">
      <span className="text-xs font-semibold uppercase tracking-wide text-gray-400">
        {title}
      </span>
      {isPrimary && (
        <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
      )}
    </div>
    <div className="flex items-baseline gap-3">
      <span className="text-3xl font-bold text-[#0B0B0B] tracking-tight">
        {value}
      </span>
      {delta && (
        <span
          className={cn(
            "text-xs font-bold px-1.5 py-0.5 rounded flex items-center gap-0.5",
            isPositive
              ? "text-green-600 bg-green-50"
              : "text-gray-400 bg-gray-50",
          )}
        >
          {isPositive ? "↑" : ""} {delta}
        </span>
      )}
    </div>
  </motion.div>
);

// B3) Action Tile V2
export const ActionTileV2 = ({ icon, label, href, available = true }: any) => {
  const Content = (
    <MotionCard
      className={cn(
        "p-5 flex flex-col items-center justify-center gap-3 h-full text-center group",
        !available &&
        "opacity-60 grayscale cursor-not-allowed hover:y-0 hover:scale-100",
      )}
    >
      <div
        className={cn(
          "w-10 h-10 rounded-full flex items-center justify-center transition-colors",
          available
            ? "bg-gray-50 text-[#0B0B0B] group-hover:bg-[#0B0B0B] group-hover:text-white"
            : "bg-gray-100 text-gray-400",
        )}
      >
        {/* @ts-ignore */}
        <Icon name={icon} size={20} />
      </div>
      <span className="text-sm font-semibold text-[#525252] group-hover:text-[#0B0B0B] transition-colors">
        {label}
      </span>
      {!available && (
        <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">
          Soon
        </span>
      )}
    </MotionCard>
  );

  if (available && href) {
    return (
      <Link href={href} className="flex-1">
        {Content}
      </Link>
    );
  }
  return <div className="flex-1">{Content}</div>;
};

// B4) Storefront Snapshot V2
export const StorefrontSnapshotV2 = ({ store }: any) => {
  if (!store) return null;

  const isPublished = store.status === "published";
  const APP_DOMAIN = process.env.NEXT_PUBLIC_APP_DOMAIN || "vayva.ng";
  const storefrontBase = process.env.NEXT_PUBLIC_STOREFRONT_URL || "http://localhost:3001";
  const storeUrl = isPublished
    ? `https://${store.slug}.${APP_DOMAIN}`
    : `${storefrontBase}?store=${store.slug}`;


  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 flex flex-col h-full gap-6">
      <div className="flex items-center gap-4">
        <div
          className="w-16 h-16 rounded-lg border border-gray-100 flex items-center justify-center overflow-hidden bg-gray-50 text-2xl font-bold text-[#0B0B0B]"
          style={{
            backgroundColor: store.brandColor
              ? `${store.brandColor}10`
              : undefined,
          }}
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
        <div>
          <h3 className="text-lg font-bold text-[#0B0B0B]">
            {store.storeName}
          </h3>
          <a
            href={storeUrl}
            target="_blank"
            className="text-sm text-gray-500 hover:text-[#0B0B0B] hover:underline flex items-center gap-1"
          >
            {store.slug}.{APP_DOMAIN}

            <Icon name="ExternalLink" size={12} />
          </a>
        </div>
      </div>

      <div className="flex gap-2">
        <div
          className={cn(
            "px-2.5 py-1 rounded-full text-xs font-bold border",
            isPublished
              ? "bg-green-50 text-green-700 border-green-200"
              : "bg-yellow-50 text-yellow-700 border-yellow-200",
          )}
        >
          {isPublished ? "Live" : "Draft"}
        </div>
        <div className="px-2.5 py-1 rounded-full text-xs font-bold border border-gray-200 text-gray-600 bg-gray-50 capitalize">
          {store.selectedTemplateId || "Default"} Theme
        </div>
      </div>

      <div className="flex flex-col gap-2 mt-auto">
        <a href={storeUrl} target="_blank" className="w-full">
          <button className="w-full h-10 rounded-lg border border-gray-200 text-[#0B0B0B] font-semibold text-sm hover:bg-gray-50 transition-colors">
            Preview Storefront
          </button>
        </a>
        <Link href="/dashboard/control-center">
          <button className="w-full h-10 rounded-lg bg-[#0B0B0B] text-white font-semibold text-sm hover:bg-black/90 transition-colors flex items-center justify-center gap-2">
            <Icon name="Palette" size={16} />
            Customize Design
          </button>
        </Link>
      </div>
    </div>
  );
};

// B5) Recent Activity Feed
export const RecentActivityList = () => {
  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden flex flex-col h-full">
      <div className="p-5 border-b border-gray-50 flex items-center justify-between">
        <h3 className="font-bold text-[#0B0B0B]">Recent Activity</h3>
        <button className="text-xs font-semibold text-gray-500 hover:text-[#0B0B0B]">
          View All
        </button>
      </div>

      {/* Empty State */}
      <div className="flex-1 flex flex-col items-center justify-center py-12 text-center">
        <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center mb-3">
          <Icon name="Activity" className="text-gray-300" size={24} />
        </div>
        <p className="text-sm font-medium text-[#0B0B0B]">No recent activity</p>
        <p className="text-xs text-gray-400 max-w-[200px]">
          Orders and payouts will appear here once you start selling.
        </p>
      </div>
    </div>
  );
};
