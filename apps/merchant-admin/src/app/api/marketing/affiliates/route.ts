import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@vayva/db";
import { withVayvaAPI, HandlerContext } from "@/lib/api-handler";
import { PERMISSIONS } from "@/lib/team/permissions";
import { ReferralService } from "@/services/referral.service";

export const GET = withVayvaAPI(
    PERMISSIONS.METRICS_VIEW,
    async (req: NextRequest, { storeId }: HandlerContext) => {
        try {
            // Ensure code exists and fetch stats
            await ReferralService.getOrCreateCode(storeId);
            const stats = await ReferralService.getStats(storeId);

            return NextResponse.json({
                success: true,
                data: stats
            });
        } catch (error) {
            console.error("[AFFILIATES_GET]", error);
            return NextResponse.json(
                { error: "Failed to fetch affiliate data" },
                { status: 500 }
            );
        }
    }
);
