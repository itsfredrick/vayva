
"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from 'next/navigation';
import { Button } from "@vayva/ui";
import {
  LayoutDashboard,
  Users,
  ShieldAlert,
  Scale,
  Receipt,
  AlertTriangle,
  MessageSquare,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Terminal,
  DollarSign,
  BadgeCheck,
} from 'lucide-react';

const MENU_ITEMS = [
  {
    header: "Overview", items: [
      { label: "Dashboard", href: "/ops", icon: LayoutDashboard },
      { label: "System Health", href: "/ops/health", icon: ShieldAlert },
    ]
  },
  {
    header: "Operations", items: [
      { label: "Orders & Payments", href: "/ops/orders", icon: Receipt },
      { label: "Deliveries", href: "/ops/deliveries", icon: AlertTriangle },
      { label: "Webhooks", href: "/ops/webhooks", icon: Scale },
    ]
  },
  {
    header: "Merchants", items: [
      { label: "Merchants", href: "/ops/merchants", icon: Users },
      { label: "KYC Queue", href: "/ops/kyc", icon: BadgeCheck },
    ]
  },
  {
    header: "Support", items: [
      { label: "Inbox", href: "/ops/inbox", icon: MessageSquare },
    ]
  },
  {
    header: "Governance", items: [
      { label: "Audit Log", href: "/ops/audit", icon: ShieldAlert },
      { label: "Disputes", href: "/ops/disputes", icon: DollarSign },
      { label: "Security", href: "/ops/security", icon: ShieldAlert },
    ]
  },
  {
    header: "Rescue", items: [
      { label: "Rescue Console", href: "/ops/rescue", icon: AlertTriangle },
    ]
  },
  {
    header: "Admin", items: [
      { label: "Team", href: "/ops/users", icon: Users },
      { label: "System Tools", href: "/ops/tools", icon: Terminal },
    ]
  },
];

interface OpsSidebarProps {
  isCollapsed: boolean;
  onToggle: () => void;
}

export function OpsSidebar({ isCollapsed, onToggle }: OpsSidebarProps): React.JSX.Element {
  const pathname = usePathname();

  return (
    <div className={`${isCollapsed ? "w-20" : "w-64"} bg-white border-r border-gray-200 h-screen flex flex-col fixed left-0 top-0 z-50 transition-all duration-300`}>
      <div className="h-16 flex items-center justify-between px-6 border-b border-gray-100">

        {!isCollapsed && (
          <div className="flex items-center gap-3 px-2">
            <Image
              src="/vayva-logo.png"
              alt="Vayva Ops"
              width={28}
              height={28}
              className="rounded-md object-contain"
            />
            <div className="flex flex-col leading-none">
              <span className="font-bold text-sm tracking-tight text-gray-900">Vayva Ops</span>
              <span className="text-[10px] font-bold text-white bg-black px-1.5 py-0.5 rounded w-fit mt-0.5">ADMIN</span>
            </div>
          </div>
        )}
        <Button
          onClick={onToggle}
          variant="ghost"
          size="icon"
          className={`rounded-lg border border-gray-100 hover:bg-gray-50 text-gray-400 hover:text-gray-600 transition-colors ${isCollapsed ? "mx-auto" : ""}`}
          aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {isCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
        </Button>
      </div>

      <nav className="flex-1 overflow-y-auto p-4 space-y-6">
        {MENU_ITEMS.map((section, idx) => (
          <div key={idx}>
            {!isCollapsed && (
              <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 px-3 whitespace-nowrap">
                {section.header}
              </div>
            )}
            <div className="space-y-1">
              {section.items.map((item: any) => {
                const isActive =
                  pathname === (item as any).href ||
                  ((item as any).href !== "/ops" && pathname.startsWith((item as any).href));
                const Icon = (item as any).icon;
                return (
                  <Link
                    key={(item as any).href}
                    href={(item as any).href}
                    title={isCollapsed ? (item as any).label : ""}
                    className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${isActive
                      ? "bg-black text-white"
                      : "text-gray-600 hover:bg-gray-50 hover:text-black"
                      } ${isCollapsed ? "justify-center px-0" : ""}`}
                  >
                    <Icon size={18} className="shrink-0" />
                    {!isCollapsed && <span className="whitespace-nowrap">{(item as any).label}</span>}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      <div className="p-4 border-t border-gray-100">
        <Link
          href="/api/ops/auth/signout"
          title={isCollapsed ? "Sign Out" : ""}
          className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 transition-colors ${isCollapsed ? "justify-center px-0" : ""}`}
        >
          <LogOut size={18} className="shrink-0" />
          {!isCollapsed && <span>Sign Out</span>}
        </Link>
      </div>
    </div>
  );
}
