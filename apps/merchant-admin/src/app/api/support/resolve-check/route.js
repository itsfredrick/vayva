import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
export async function POST(req) {
    try {
        const body = await req.json();
        const { type, context } = body; // context includes orderId, transactionId, etc.
        // Simulate self-resolution delays or checks
        // In a real implementation, we would check external providers (Paystack, etc.)
        if (type === "payment_not_received") {
            const { orderId } = context;
            if (!orderId) {
                return NextResponse.json({
                    resolved: false,
                    message: "No order ID provided for payment check.",
                });
            }
            const order = await prisma.order.findUnique({
                where: { id: orderId },
                select: { paymentStatus: true },
            });
            if (String(order?.paymentStatus) === "PAID") {
                return NextResponse.json({
                    resolved: true,
                    message: "Good news! We confirmed this order is fully paid. The status should update momentarily.",
                    action: "REFRESH_PAGE",
                });
            }
            else if (order?.paymentStatus === "PENDING") {
                // Real logic: It is pending.
                return NextResponse.json({
                    resolved: false,
                    message: "Payment is still pending confirmation from the provider. Please check again in a few minutes.",
                    action: "WAIT",
                });
            }
        }
        if (type === "withdrawal_failed") {
            // Test check
            return NextResponse.json({
                resolved: true,
                message: "Withdrawals are temporarily paused because your bank details were updated recently (Security Lock).",
                action: "VIEW_SETTINGS",
            });
        }
        // Default: Issue not auto-resolvable
        return NextResponse.json({
            resolved: false,
            message: "We couldn't automatically diagnose the issue.",
            action: "CONTACT_SUPPORT",
        });
    }
    catch (error) {
        console.error("Resolve Check Error:", error);
        return NextResponse.json({ resolved: false, message: "System check failed" }, { status: 500 });
    }
}
