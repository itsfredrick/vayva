import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { deliveryConsolidationService } from "@/services/DeliveryConsolidationService";
import { prisma } from "@vayva/db";

export async function POST(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }

        const body = await request.json();
        const { parentOrderId } = body;

        if (!parentOrderId) {
            return NextResponse.json(
                { error: "parentOrderId is required" },
                { status: 400 }
            );
        }

        // Check if consolidation should be applied
        const shouldConsolidate = await deliveryConsolidationService.shouldConsolidate(
            parentOrderId
        );

        if (!shouldConsolidate) {
            return NextResponse.json({
                success: false,
                message: "Order does not qualify for delivery consolidation",
            });
        }

        // Verify Ownership
        const parentOrder = await prisma.order.findUnique({
            where: { id: parentOrderId },
            select: { customerId: true }
        });

        if (!parentOrder || parentOrder.customerId !== session.user?.id) {
            return NextResponse.json({ error: "Forbidden - You do not own this order" }, { status: 403 });
        }

        // Calculate consolidated fee
        // Note: Parent-child order relationships need to be implemented in schema
        // For now, we'll return early since the feature is not fully implemented
        const childOrders = await prisma.order.findMany({
            where: { id: parentOrderId }, // Temporary: just get the parent order itself
            select: { id: true },
        });

        const consolidatedFee = await deliveryConsolidationService.calculateConsolidatedFee(
            childOrders.map((o) => o.id)
        );

        // Distribute fee across child orders
        await deliveryConsolidationService.distributeFee(
            parentOrderId,
            consolidatedFee
        );

        // Get breakdown for response
        const breakdown = await deliveryConsolidationService.getFeeBreakdown(
            parentOrderId
        );

        return NextResponse.json({
            success: true,
            consolidatedFee,
            breakdown,
            message: "Delivery fee consolidated successfully",
        });
    } catch (error: unknown) {
        console.error("Delivery consolidation error:", error);
        return NextResponse.json(
            { error: error.message || "Failed to consolidate delivery fee" },
            { status: 500 }
        );
    }
}

export async function GET(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }

        const { searchParams } = new URL(request.url);
        const parentOrderId = searchParams.get("parentOrderId");

        if (!parentOrderId) {
            return NextResponse.json(
                { error: "parentOrderId is required" },
                { status: 400 }
            );
        }

        const breakdown = await deliveryConsolidationService.getFeeBreakdown(
            parentOrderId
        );

        return NextResponse.json({ success: true, breakdown });
    } catch (error: unknown) {
        console.error("Get delivery breakdown error:", error);
        return NextResponse.json(
            { error: error.message || "Failed to get delivery breakdown" },
            { status: 500 }
        );
    }
}
