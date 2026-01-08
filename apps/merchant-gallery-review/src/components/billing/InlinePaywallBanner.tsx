"use client";

import React from "react";
import Link from "next/link";
import { Icon } from "@vayva/ui";

interface InlinePaywallBannerProps {
  title: string;
  message: string;
  requiredPlan?: string;
}

export function InlinePaywallBanner({
  title,
  message,
  requiredPlan = "pro",
}: InlinePaywallBannerProps) {
  return (
    <div className="bg-gray-50 border border-gray-200 rounded-xl p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
      <div className="flex items-start gap-4">
        <div className="bg-white p-2 rounded-lg border shadow-sm">
          <Icon name="Lock" className="text-gray-400" size={20} />
        </div>
        <div>
          <h3 className="font-bold text-gray-900">{title}</h3>
          <p className="text-sm text-gray-500">{message}</p>
        </div>
      </div>
      <Link
        href={`/dashboard/billing?upgrade=${requiredPlan}`}
        className="bg-white border border-gray-300 px-4 py-2 rounded-lg text-sm font-bold text-gray-700 hover:bg-gray-50 whitespace-nowrap"
      >
        View Plans
      </Link>
    </div>
  );
}
