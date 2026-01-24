"use client";

import { AdminShell } from "@/components/admin-shell";
import { useAuth } from "@/context/AuthContext";
import { usePathname } from "next/navigation";

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();

    // Determine if we should show the admin shell
    // We exclude paths that handle their own shell or are standalone
    const isExcluded = pathname.startsWith("/dashboard/kitchen"); // Example exclusion

    if (isExcluded) {
        return <>{children}</>;
    }

    return (
        <AdminShell>
            {children}
        </AdminShell>
    );
}
