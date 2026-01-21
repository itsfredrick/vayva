import { NextRequest, NextResponse } from "next/server";
import { withVayvaAPI, HandlerContext } from "@/lib/api-handler";
import { PERMISSIONS } from "@/lib/team/permissions";
import { prisma } from "@/lib/prisma";
import { PLANS } from "@/lib/billing/plans";

export const POST = withVayvaAPI(
  PERMISSIONS.BILLING_MANAGE,
  async (request: NextRequest, { storeId, user }: HandlerContext) => {
    // Session is already validated and user exists via withRBAC -> requireAuth logic
    // storeId is present in session


    const body = await request.json();
    const { plan_slug } = body;

    if (!PLANS[plan_slug]) {
      return new NextResponse("Invalid Plan", { status: 400 });
    }

    try {
      const { PaystackService } = await import("@/lib/payment/paystack");

      const payment = await PaystackService.createPaymentForPlanChange(
        user.email!,
        plan_slug,
        storeId
      );

      // Upsert pending subscription
      await prisma.merchantAiSubscription.upsert({
        where: { storeId },
        update: {
          planKey: plan_slug,
          // lastPaymentStatus: "pending", // Removing generic fields if unsure
        },
        create: {
          storeId,
          planKey: plan_slug,
          planId: "paystack_" + plan_slug,
          status: "pending",
          periodStart: new Date(),
          periodEnd: new Date(),
          trialExpiresAt: new Date(),
          // lastPaymentStatus: "pending",
        },
      });

      return NextResponse.json({ ok: true, checkout_url: payment.authorization_url });
    } catch (e: any) {
      return new NextResponse(e.message, { status: 500 });
    }
  }
);
