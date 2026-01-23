import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
export const dynamic = "force-dynamic";
export async function GET(req: any) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || !session.user) {
            return NextResponse.json({});
        }
        const user = session.user;
        const storeId = user.storeId;
        if (!storeId) {
            return NextResponse.json({});
        }
        const store = await prisma.store.findUnique({
            where: { id: storeId },
        });
        if (!store) {
            return NextResponse.json({});
        }
        // Resolve Onboarding Data
        // Checking common locations for industry category
        const industryCategory = store.industryCategory ||
            store.category ||
            store.settings?.industryCategory ||
            null;
        // Check onboarding completion status
        // can be explicit flag or derived
        const onboardingCompleted = store.onboardingCompleted ||
            store.onboardingStatus === "COMPLETED" ||
            !!industryCategory;
        return NextResponse.json({
            industryCategory,
            onboardingCompleted,
        });
    }
    catch (error) {
        console.error("API /me/onboarding-summary error:", error);
        return NextResponse.json({}, { status: 500 });
    }
}
