import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { NextRequest, NextResponse } from "next/server";
import { DisputeProvider, DisputeStatus } from "@vayva/db";
import { rateLimitService } from "@/lib/security/rate-limit";
import { z } from "zod";
import { ApiResponse, ApiErrorCode, DisputeResponseData } from "@vayva/shared";

const DisputeSchema = z.object({
    orderId: z.string().min(1, "Order ID is required"),
    reason: z.string().min(10, "Reason must be at least 10 characters").max(500),
    amount: z.number().positive("Amount must be positive").max(10000000), // Max 10M
    evidenceText: z.string().max(2000).optional(),
});

/**
 * handleCreateDispute
 * 
 * Boundary-based handler for creating disputes.
 * Fully typed logic separated from the framework entrypoint.
 */
export async function handleCreateDispute(
    request: NextRequest
): Promise<NextResponse<ApiResponse<DisputeResponseData>>> {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
        return NextResponse.json(
            {
                success: false,
                error: { code: ApiErrorCode.UNAUTHORIZED, message: "Unauthorized" }
            },
            { status: 401 }
        );
    }

    // Rate Limit strict: 5 disputes per 15 minutes
    const rateLimit = await rateLimitService.middlewareCheck(request, "disputes", { windowMs: 15 * 60 * 1000, max: 5 });
    if (rateLimit) return rateLimit as unknown as NextResponse<ApiResponse<DisputeResponseData>>;

    try {
        const body = await request.json();
        const validation = DisputeSchema.safeParse(body);

        if (!validation.success) {
            return NextResponse.json(
                {
                    success: false,
                    error: {
                        code: ApiErrorCode.VALIDATION_ERROR,
                        message: "Invalid input",
                        details: validation.error.flatten()
                    }
                },
                { status: 400 }
            );
        }

        const { orderId, reason, amount } = validation.data;

        // 1. Verify Order Ownership & Status
        const order = await prisma.order.findUnique({
            where: { id: orderId },
            include: { store: true }
        });

        if (!order) {
            return NextResponse.json(
                {
                    success: false,
                    error: { code: ApiErrorCode.NOT_FOUND, message: "Order not found" }
                },
                { status: 404 }
            );
        }

        if (order.customerId !== session.user?.id) {
            return NextResponse.json(
                {
                    success: false,
                    error: { code: ApiErrorCode.FORBIDDEN, message: "Forbidden" }
                },
                { status: 403 }
            );
        }

        // 2. Check if a dispute already exists for this order
        const existingDispute = await prisma.dispute.findFirst({
            where: { orderId }
        });

        if (existingDispute) {
            return NextResponse.json(
                {
                    success: false,
                    error: {
                        code: ApiErrorCode.VALIDATION_ERROR,
                        message: "Dispute already exists for this order"
                    }
                },
                { status: 400 }
            );
        }

        // 3. Create Dispute
        const dispute = await prisma.dispute.create({
            data: {
                storeId: order.storeId || "SYSTEM",
                orderId: orderId,
                customerId: session.user?.id,
                merchantId: order.storeId || "SYSTEM",
                amount: amount,
                currency: order.currency,
                reasonCode: reason,
                status: DisputeStatus.OPENED,
                provider: DisputeProvider.OTHER,
                providerDisputeId: `MKT-${Date.now()}-${orderId.slice(0, 8)}`, // Generate unique ID
            },
        });

        // 4. Create Timeline Event
        await prisma.orderTimelineEvent.create({
            data: {
                orderId: orderId,
                title: "Dispute Opened",
                body: `Buyer has opened a dispute for ₦${amount.toLocaleString()}. Reason: ${reason}`,
            },
        });

        return NextResponse.json({
            success: true,
            data: { disputeId: dispute.id }
        });
    } catch (error) {
        console.error("[DISPUTE_POST]", error);
        const errorMessage = error instanceof Error ? error.message : "Internal Server Error";
        return NextResponse.json(
            {
                success: false,
                error: { code: ApiErrorCode.INTERNAL_SERVER_ERROR, message: errorMessage }
            },
            { status: 500 }
        );
    }
}
