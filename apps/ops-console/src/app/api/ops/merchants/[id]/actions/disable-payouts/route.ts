import { NextRequest, NextResponse } from "next/server";
import { OpsAuthService } from "@/lib/ops-auth";
import { prisma } from "@vayva/db";

export const dynamic = "force-dynamic";

export async function POST(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        // Require authentication and SUPERVISOR role
        const { user } = await OpsAuthService.requireSession();
        OpsAuthService.requireRole(user, "SUPERVISOR");

        const { id: storeId } = await params;
        const { reason } = await req.json();

        // Validate reason
        if (!reason || reason.trim().length < 10) {
            return NextResponse.json(
                { error: "Reason must be at least 10 characters" },
                { status: 400 }
            );
        }

        // Check if store exists
        const store = await prisma.store.findUnique({
            where: { id: storeId },
            select: { id: true, name: true, payoutsEnabled: true },
        });

        if (!store) {
            return NextResponse.json(
                { error: "Store not found" },
                { status: 404 }
            );
        }

        // Check if already disabled
        if (!store.payoutsEnabled) {
            return NextResponse.json(
                { error: "Payouts are already disabled for this store" },
                { status: 400 }
            );
        }

        // Disable payouts
        await prisma.store.update({
            where: { id: storeId },
            data: { payoutsEnabled: false },
        });

        // Create audit log
        // Create audit log
        await OpsAuthService.logEvent(user.id, "DISABLE_PAYOUTS", {
            targetType: "Store",
            targetId: storeId,
            reason: reason.trim(),
            storeName: store.name,
            previousState: { payoutsEnabled: true },
            newState: { payoutsEnabled: false },
        });

        return NextResponse.json({
            success: true,
            message: "Payouts disabled successfully",
        });
    } catch (error: any) {
        if (error.message === "Unauthorized") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }
        if (error.message?.includes("Insufficient permissions")) {
            return NextResponse.json(
                { error: "Insufficient permissions. SUPERVISOR role required." },
                { status: 403 }
            );
        }
        console.error("Disable payouts error:", error);
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
}
