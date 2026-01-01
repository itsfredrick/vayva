import { NextRequest, NextResponse } from "next/server";
import { OpsAuthService } from "@/lib/ops-auth";
import { prisma } from "@vayva/db";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
    try {
        const { user } = await OpsAuthService.requireSession();
        OpsAuthService.requireRole(user, "SUPERVISOR");

        const { referenceCode, action } = await req.json();

        if (!referenceCode) {
            return NextResponse.json({ error: "Reference Code is required" }, { status: 400 });
        }

        const withdrawal = await prisma.withdrawal.findUnique({
            where: { referenceCode },
        });

        if (!withdrawal) {
            return NextResponse.json({ error: "Withdrawal not found" }, { status: 404 });
        }

        if (action === "RESET_STUCK") {
            // Only reset if currently PROCESSING or PENDING (maybe stuck pending?)
            // Actually strictly "PROCESSING" is usually the stuck state we want to clear.

            // We'll allow resetting from any non-final state
            const textStatus = String(withdrawal.status).toUpperCase();
            if (["COMPLETED", "FAILED", "SUCCESS"].includes(textStatus)) {
                return NextResponse.json({ error: "Cannot reset a finalized withdrawal" }, { status: 400 });
            }

            await prisma.withdrawal.update({
                where: { id: withdrawal.id },
                data: {
                    status: "PENDING",
                    lockedAt: null,
                    lockedBy: null, // Clear any worker lock
                },
            });

            // Audit
            // Audit
            await OpsAuthService.logEvent(user.id, "RESCUE_WITHDRAWAL", {
                targetType: "Withdrawal",
                targetId: withdrawal.id,
                action: "RESET_TO_PENDING",
                referenceCode,
                previousStatus: textStatus,
            });

            return NextResponse.json({
                success: true,
                message: "Withdrawal reset to PENDING and unlocked",
            });
        }

        return NextResponse.json({ error: "Invalid action" }, { status: 400 });
    } catch (error: any) {
        if (error.message === "Unauthorized") return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        if (error.message?.includes("permissions")) return NextResponse.json({ error: error.message }, { status: 403 });

        console.error("Rescue withdrawal error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
