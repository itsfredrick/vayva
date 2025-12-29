import { getSessionUser } from "@/lib/session";
import { redirect } from "next/navigation";
import { prisma } from "@vayva/db";
import { AdminLayoutClient } from "./AdminLayoutClient";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
    const user = await getSessionUser();

    if (!user) {
        redirect("/signin");
    }

    // Check Onboarding status
    const store = await prisma.store.findUnique({
        where: { id: user.storeId },
        select: { onboardingCompleted: true }
    });

    if (store && !store.onboardingCompleted) {
        // Allow access to select-store or logout, but block main dashboard
        // If we redirect loop here, we need to be careful.
        // Assuming /onboarding is outside /admin
        redirect("/onboarding");
    }

    return (
        <AdminLayoutClient>
            {children}
        </AdminLayoutClient>
    );
}
