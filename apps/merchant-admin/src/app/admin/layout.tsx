import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@vayva/db";
import { AdminLayoutClient } from "./AdminLayoutClient";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
        redirect("/signin");
    }

    // Check Onboarding status
    const store = await prisma.store.findUnique({
        where: { id: (session.user as any).storeId },
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
