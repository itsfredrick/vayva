"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import {
  Store,
  Building2,
  Palette,
  Globe,
  CreditCard,
  Receipt,
  BarChart3,
  Users,
  Shield,
  Plug,
  FileCheck,
  Bell,
  HelpCircle,
  Truck,
  Smartphone,
  MessageCircle,
} from "lucide-react";

const navigation = [
  {
    title: "Store & Business",
    items: [
      {
        name: "Store Profile",
        href: "/dashboard/settings/store-profile",
        icon: Store,
      },
      {
        name: "Business Details",
        href: "/dashboard/settings/business",
        icon: Building2,
      },
      { name: "Branding", href: "/dashboard/settings/branding", icon: Palette },
      { name: "Currency & Locale", href: "/dashboard/settings/locale", icon: Globe },
      {
        name: "Login & Sessions",
        href: "/dashboard/settings/sessions",
        icon: Smartphone,
      },
      {
        name: "Plans & Billing",
        href: "/dashboard/settings/subscription",
        icon: CreditCard,
      },
      { name: "Billing", href: "/dashboard/settings/billing", icon: Receipt },
      { name: "Invoices", href: "/dashboard/settings/invoices", icon: Receipt },
      { name: "Usage & Limits", href: "/dashboard/settings/usage", icon: BarChart3 },
      {
        section: "Team",
        items: [
          { name: "Staff & Roles", href: "/dashboard/settings/team", icon: Users },
          { name: "Security", href: "/dashboard/settings/security", icon: Shield },
        ],
      },
      {
        section: "Connected Services",
        items: [
          {
            name: "Integrations",
            href: "/dashboard/settings/integrations",
            icon: Plug,
          },
          {
            name: "WhatsApp Integration",
            href: "/dashboard/whatsapp",
            icon: MessageCircle,
          },
          {
            name: "Delivery Settings",
            href: "/dashboard/control-center/delivery",
            icon: Truck,
          },
        ],
      },
      { name: "Compliance & KYC", href: "/dashboard/settings/kyc", icon: FileCheck },
      {
        name: "Notifications",
        href: "/dashboard/settings/notifications",
        icon: Bell,
      },
      {
        section: "Support",
        items: [
          {
            name: "Help Center",
            href: "/dashboard/settings/support",
            icon: HelpCircle,
          },
        ],
      },
    ],
  },
];

export function AccountSidebar() {
  const pathname = usePathname();

  return (
    <div className="w-64 bg-white border-r border-gray-200 h-screen sticky top-0 overflow-y-auto">
      <div className="p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-1">
          Account Settings
        </h2>
        <p className="text-sm text-gray-500">Manage your business</p>
      </div>

      <nav className="px-3 pb-6">
        {navigation.map((section) => (
          <div key={section.title} className="mb-6">
            <h3 className="px-3 mb-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
              {section.title}
            </h3>
            <div className="space-y-1">
              {section.items.map((item) => {
                const Icon = item.icon as any;
                const isActive = pathname === item.href;

                return (
                  <Link
                    key={item.name}
                    href={item.href || "#"}
                    className={`
                      flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg transition-colors
                      ${isActive
                        ? "bg-green-50 text-green-700"
                        : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                      }
                    `}
                  >
                    <Icon className="w-5 h-5" />
                    {item.name}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>
    </div>
  );
}
