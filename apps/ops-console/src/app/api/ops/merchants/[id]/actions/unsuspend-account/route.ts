import { NextRequest, NextResponse } from 'next/server';
import { OpsAuthService } from "@/lib/ops-auth";
import { prisma } from "@vayva/db";

export const dynamic = "force-dynamic";

export async function POST(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { user } = await OpsAuthService.requireSession();
        
        // Only OPS_OWNER and OPS_ADMIN can unsuspend accounts
        if (!["OPS_OWNER", "OPS_ADMIN"].includes(user.role)) {
            return NextResponse.json(
                { error: "Insufficient permissions. Admin role required." },
                { status: 403 }
            );
        }

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
            select: { id: true, name: true, isActive: true },
        });

        if (!store) {
            return NextResponse.json(
                { error: "Store not found" },
                { status: 404 }
            );
        }

        // Check if already active
        if (store.isActive) {
            return NextResponse.json(
                { error: "Store is already active" },
                { status: 400 }
            );
        }

        // Reactivate the store
        await prisma.store.update({
            where: { id: storeId },
            data: { 
                isActive: true,
            },
        });

        // Create audit log
        await OpsAuthService.logEvent(user.id, "UNSUSPEND_STORE", {
            targetType: "Store",
            targetId: storeId,
            reason: reason.trim(),
            storeName: store.name,
            previousState: { isActive: false },
            newState: { isActive: true },
        });

        return NextResponse.json({
            success: true,
            message: "Store reactivated successfully",
        });
    } catch (error: any) {
        if (error.message === "Unauthorized") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }
        console.error("Unsuspend store error:", error);
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
}
