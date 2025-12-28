import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@vayva/db";
import { OnboardingClientLayout } from './OnboardingClientLayout';
import { OnboardingProvider } from '@/context/OnboardingContext';

export const dynamic = 'force-dynamic';

export default async function OnboardingLayout({ children }: { children: React.ReactNode }) {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
        redirect("/signin");
    }

    const store = await prisma.store.findUnique({
        where: { id: (session.user as any).storeId },
        select: { onboardingCompleted: true }
    });

    if (store?.onboardingCompleted) {
        redirect("/admin/dashboard");
    }

    return (
        <OnboardingProvider>
            <OnboardingClientLayout>{children}</OnboardingClientLayout>
        </OnboardingProvider>
    );
}
