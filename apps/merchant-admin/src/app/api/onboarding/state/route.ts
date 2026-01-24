import { NextResponse } from "next/server";
import { withVayvaAPI } from "@/lib/api-handler";
import { PERMISSIONS } from "@/lib/team/permissions";
import { OnboardingService } from "@/services/onboarding.service";
export const GET = withVayvaAPI(PERMISSIONS.SETTINGS_VIEW, async (request, { storeId }) => {
    try {
        const state = await OnboardingService.getState(storeId);
        return NextResponse.json(state);
    }
    catch (error: any) {
        console.error("Failed to fetch onboarding state:", error);
        return NextResponse.json({ error: "Failed to fetch onboarding state" }, { status: 500 });
    }
});
export const PUT = withVayvaAPI(PERMISSIONS.SETTINGS_VIEW, async (request, { storeId }) => {
    try {
        const body = await request.json();
        const { step, data, status, isComplete } = body;
        const updated = await OnboardingService.updateState(storeId, {
            step,
            data,
            status,
            isComplete
        });
        // Sync status to Store model if provided (Release Blocker Fix)
        if (status) {
            const prisma = (await import("@/lib/prisma")).prisma;
            await prisma.store.update({
                where: { id: storeId },
                data: { onboardingStatus: status }
            });
        }
        return NextResponse.json(updated);
    }
    catch (error: any) {
        console.error("Failed to update onboarding state:", error);
        return NextResponse.json({ error: "Failed to update onboarding state" }, { status: 500 });
    }
});
