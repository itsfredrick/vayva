import { NextRequest, NextResponse } from "next/server";
import { OpsAuthService } from "@/lib/ops-auth";
import { prisma } from "@vayva/db";

export const dynamic = "force-dynamic";

export async function POST(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        // Require authentication and OWNER role (most destructive action)
        const { user } = await OpsAuthService.requireSession();
        OpsAuthService.requireRole(user, "OPS_OWNER");

        const { id: storeId } = await params;
        const { reason } = await req.json();

        // Validate reason (stricter for suspension)
        if (!reason || reason.trim().length < 20) {
            return NextResponse.json(
                { error: "Reason must be at least 20 characters for account suspension" },
                { status: 400 }
            );
        }

        // Check if store exists and get tenant/owner info
        const store = await prisma.store.findUnique({
            where: { id: storeId },
            select: {
                id: true,
                name: true,
                isLive: true,
                payoutsEnabled: true,
                tenantId: true,
                tenant: {
                    select: {
                        id: true,
                        TenantMembership: {
                            where: { role: "OWNER" },
                            select: {
                                User: {
                                    select: { id: true, email: true },
                                },
                            },
                            take: 1,
                        },
                    },
                },
            },
        });

        if (!store) {
            return NextResponse.json(
                { error: "Store not found" },
                { status: 404 }
            );
        }

        // Check if already suspended
        if (!store.isLive) {
            return NextResponse.json(
                { error: "Store is already suspended" },
                { status: 400 }
            );
        }

        // Get owner user
        const owner = store.tenant?.TenantMembership[0]?.User;

        // Suspend store account
        await prisma.store.update({
            where: { id: storeId },
            data: {
                isLive: false,
                payoutsEnabled: false,
            },
        });

        // Optionally disable store memberships (prevents login)
        await prisma.membership.updateMany({
            where: { storeId },
            data: { status: "suspended" },
        });

        // Create audit log
        // Create audit log
        await OpsAuthService.logEvent(user.id, "SUSPEND_ACCOUNT", {
            targetType: "Store",
            targetId: storeId,
            reason: reason.trim(),
            storeName: store.name,
            userEmail: owner?.email,
            previousState: { isLive: true, payoutsEnabled: store.payoutsEnabled },
            newState: { isLive: false, payoutsEnabled: false },
            severity: "CRITICAL",
        });

        return NextResponse.json({
            success: true,
            message: "Account suspended successfully",
        });
    } catch (error: any) {
        if (error.message === "Unauthorized") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }
        if (error.message?.includes("Insufficient permissions")) {
            return NextResponse.json(
                { error: "Insufficient permissions. OPS_OWNER role required." },
                { status: 403 }
            );
        }
        console.error("Suspend account error:", error);
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
}
