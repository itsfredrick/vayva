"use client";

import React, { Suspense } from "react";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { cn } from "@vayva/ui";
import { RefreshCcw, Truck, FileText, Lock, Phone } from "lucide-react";

function ControlCenterNav() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const currentTab = searchParams.get("tab");

  const navItems = [
    {
      label: "Returns Policy",
      href: "/control-center/policies?tab=returns",
      tab: "returns",
      icon: RefreshCcw,
    },
    {
      label: "Shipping Policy",
      href: "/control-center/policies?tab=shipping",
      tab: "shipping",
      icon: Truck,
    },
    {
      label: "Privacy Policy",
      href: "/control-center/policies?tab=privacy",
      tab: "privacy",
      icon: Lock,
    },
    {
      label: "Terms of Service",
      href: "/control-center/policies?tab=terms",
      tab: "terms",
      icon: FileText,
    },
  ];

  return (
    <div className="sticky top-6">
      <h3 className="text-xs font-bold uppercase text-gray-400 mb-6 px-3">
        Store Policies
      </h3>
      <nav className="space-y-1">
        {navItems.map((item) => {
          const isActive =
            pathname.includes("policies") && currentTab === item.tab;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors",
                isActive
                  ? "bg-white text-black shadow-sm"
                  : "text-gray-600 hover:bg-white hover:text-black",
              )}
            >
              <item.icon size={16} />
              {item.label}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}

export default function ControlCenterLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen bg-gray-50/50">
      {/* Use existing AdminShell or similar if wrapped around this, assumed this is nested */}
      {/* For now, just a layout container */}
      <div className="max-w-7xl mx-auto w-full flex p-6 gap-8">
        {/* Sidebar */}
        <aside className="w-64 shrink-0">
          <Suspense fallback={<div className="p-4">Loading nav...</div>}>
            <ControlCenterNav />
          </Suspense>
        </aside>

        <main className="flex-1 bg-white rounded-2xl border border-gray-100 shadow-sm p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
