'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
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
    Truck
} from 'lucide-react';

const navigation = [
    {
        title: 'Store & Business',
        items: [
            { name: 'Store Profile', href: '/admin/account/store-profile', icon: Store },
            { name: 'Business Details', href: '/admin/account/business', icon: Building2 },
            { name: 'Branding', href: '/admin/account/branding', icon: Palette },
            { name: 'Currency & Locale', href: '/admin/account/locale', icon: Globe },
        ],
    },
    {
        title: 'Billing & Usage',
        items: [
            { name: 'Subscription', href: '/admin/account/subscription', icon: CreditCard },
            { name: 'Billing', href: '/admin/account/billing', icon: Receipt },
            { name: 'Invoices', href: '/admin/account/invoices', icon: Receipt },
            { name: 'Usage & Limits', href: '/admin/account/usage', icon: BarChart3 },
        ],
    },
    {
        title: 'Team & Security',
        items: [
            { name: 'Staff & Roles', href: '/admin/account/team', icon: Users },
            { name: 'Security', href: '/admin/account/security', icon: Shield },
        ],
    },
    {
        title: 'Configuration',
        items: [
            { name: 'Connected Services', href: '/admin/account/integrations', icon: Plug },
            { name: 'Delivery Settings', href: '/admin/control-center/delivery', icon: Truck }, // NEW
            { name: 'Compliance & KYC', href: '/admin/account/kyc', icon: FileCheck },
            { name: 'Notifications', href: '/admin/account/notifications', icon: Bell },
        ],
    },
    {
        title: 'Support',
        items: [
            { name: 'Help & Support', href: '/admin/account/support', icon: HelpCircle },
        ],
    },
];

export function AccountSidebar() {
    const pathname = usePathname();

    return (
        <div className="w-64 bg-white border-r border-gray-200 h-screen sticky top-0 overflow-y-auto">
            <div className="p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-1">Account Settings</h2>
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
                                const Icon = item.icon;
                                const isActive = pathname === item.href;

                                return (
                                    <Link
                                        key={item.name}
                                        href={item.href}
                                        className={`
                      flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg transition-colors
                      ${isActive
                                                ? 'bg-green-50 text-green-700'
                                                : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
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
