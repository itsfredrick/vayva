
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { PropsWithChildren } from "react";

const TABS = [
    { label: "Delivery", href: "/settings/store/delivery" },
    { label: "Pickup Locations", href: "/settings/store/pickup" },
];

export default function StoreSettingsLayout({ children }: PropsWithChildren) {
    const pathname = usePathname();

    return (
        <div className="flex flex-col gap-6">
            <div className="flex items-center gap-4 border-b">
                {TABS.map((tab) => {
                    const isActive = pathname === tab.href;
                    return (
                        <Link
                            key={tab.href}
                            href={tab.href}
                            className={cn(
                                "pb-2 border-b-2 text-sm font-medium transition-colors hover:text-primary",
                                isActive ? "border-primary text-primary" : "border-transparent text-muted-foreground"
                            )}
                        >
                            {tab.label}
                        </Link>
                    )
                })}
            </div>
            {children}
        </div>
    );
}
