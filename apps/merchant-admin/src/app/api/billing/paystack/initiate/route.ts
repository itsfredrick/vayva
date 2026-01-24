import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth/session";
import { PaystackService } from "@/lib/payment/paystack";

export async function POST(request: Request) {
    try {
        const session = await requireAuth();
        const storeId = session.user.storeId;
        const userEmail = session.user.email;

        const body = await request.json();
        const { planKey } = body;

        if (!planKey) {
            return NextResponse.json({ error: "Plan key required" }, { status: 400 });
        }

        // 1. Initialize Paystack Transaction
        const { authorization_url, reference } = await PaystackService.createPaymentForPlanChange(
            userEmail,
            planKey,
            storeId
        );

        return NextResponse.json({
            authorization_url,
            reference
        });
    }
    catch (error: any) {
        console.error("Billing init error:", error);
        return NextResponse.json({ error: error.message || "Payment initiation failed" }, { status: 500 });
    }
}
