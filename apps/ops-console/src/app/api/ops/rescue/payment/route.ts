import { NextRequest, NextResponse } from "next/server";
import { OpsAuthService } from "@/lib/ops-auth";
import { prisma } from "@vayva/db";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
    try {
        const { user } = await OpsAuthService.requireSession();
        // Rescue actions are risky, require SUPERVISOR
        OpsAuthService.requireRole(user, "SUPERVISOR");

        const { reference, action } = await req.json();

        if (!reference) {
            return NextResponse.json({ error: "Reference is required" }, { status: 400 });
        }

        const transaction = await prisma.paymentTransaction.findUnique({
            where: { reference },
            include: {
                Order: true,
            },
        });

        if (!transaction) {
            return NextResponse.json({ error: "Transaction not found" }, { status: 404 });
        }

        // Prepare update data
        let updateData: any = {};
        let orderUpdateData: any = {};
        let auditAction = "";

        if (action === "MARK_PAID") {
            updateData = { status: "PAID" };
            orderUpdateData = { paymentStatus: "PAID", status: "PROCESSING" }; // Assuming PAID moves order to PROCESSING
            auditAction = "FORCE_MARK_PAID";
        } else if (action === "MARK_FAILED") {
            updateData = { status: "FAILED" };
            orderUpdateData = { paymentStatus: "FAILED" };
            auditAction = "FORCE_MARK_FAILED";
        } else {
            return NextResponse.json({ error: "Invalid rescue action" }, { status: 400 });
        }

        // Execute updates transactionally
        await prisma.$transaction(async (tx) => {
            // Update transaction
            await tx.paymentTransaction.update({
                where: { id: transaction.id },
                data: updateData,
            });

            // Update order if exists
            if (transaction.orderId) {
                await tx.order.update({
                    where: { id: transaction.orderId },
                    data: orderUpdateData,
                });
            }
        });

        // Audit Log (Post Transaction)
        await OpsAuthService.logEvent(user.id, "RESCUE_PAYMENT", {
            targetType: "PaymentTransaction",
            targetId: transaction.id,
            action: auditAction,
            reference: transaction.reference,
            previousStatus: transaction.status,
            newStatus: updateData.status,
            orderId: transaction.orderId,
        });

        return NextResponse.json({
            success: true,
            message: `Transaction force updated to ${updateData.status}`,
        });
    } catch (error: any) {
        if (error.message === "Unauthorized") return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        if (error.message?.includes("permissions")) return NextResponse.json({ error: error.message }, { status: 403 });

        console.error("Rescue payment error:", error);
        return NextResponse.json({ error: error.message || "Internal Server Error" }, { status: 500 });
    }
}
