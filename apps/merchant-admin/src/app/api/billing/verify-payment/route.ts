import { NextResponse } from "next/server";
import { PaystackService } from "@/lib/payment/paystack";
import { prisma } from "@vayva/db";
import { requireAuth } from "@/lib/auth/session";
import { checkPermission } from "@/lib/team/rbac";
import { PERMISSIONS } from "@/lib/team/permissions";
import { logAudit, AuditAction } from "@/lib/audit";

export async function POST(request: Request) {
  try {
    // 1. Require Session Auth & RBAC
    const session = await requireAuth();
    await checkPermission(PERMISSIONS.BILLING_MANAGE);

    const storeId = session.user.storeId;
    const userId = session.user.id;

    const body = await request.json();
    const { reference } = body;

    if (!reference) {
      return NextResponse.json(
        { error: "Payment reference is required" },
        { status: 400 },
      );
    }

    // 2. Idempotency Check
    const existingTx = await prisma.paymentTransaction.findUnique({
      where: { reference },
    });

    if (existingTx) {
      if (existingTx.status === "SUCCESS") {
        return NextResponse.json({
          success: true,
          message: "Payment already verified and applied",
        });
      }
      // If it exists but isn't marked SUCCESS, we proceed to verify with Paystack
    }

    // 3. Verify payment with Paystack
    const verification =
      await PaystackService.verifyPlanChangePayment(reference);

    if (!verification.success) {
      return NextResponse.json(
        { error: "Payment verification failed" },
        { status: 400 },
      );
    }

    // 4. Tenant Binding & Reference Validation
    if (verification.storeId !== storeId) {
      return NextResponse.json(
        { error: "Payment reference does not belong to this store" },
        { status: 403 },
      );
    }

    const { newPlan } = verification;

    // 5. Update Store & Subscription in a transaction
    await prisma.$transaction(async (tx) => {
      const store = await tx.store.findUnique({
        where: { id: storeId },
        select: { plan: true },
      });

      const oldPlan = store?.plan || "STARTER";

      // Update store plan
      await tx.store.update({
        where: { id: storeId },
        data: { plan: newPlan as any },
      });

      // Create or update subscription
      const now = new Date();
      const periodEnd = new Date(now);
      periodEnd.setMonth(periodEnd.getMonth() + 1);

      await tx.merchantSubscription.upsert({
        where: { storeId },
        create: {
          storeId,
          planSlug: newPlan,
          status: "ACTIVE",
          currentPeriodStart: now,
          currentPeriodEnd: periodEnd,
        },
        update: {
          planSlug: newPlan,
          status: "ACTIVE",
          currentPeriodStart: now,
          currentPeriodEnd: periodEnd,
        },
      });

      // Record transaction for idempotency
      await tx.paymentTransaction.upsert({
        where: { reference },
        create: {
          store: { connect: { id: storeId } },
          reference,
          provider: "PAYSTACK",
          amount: 0,
          currency: "NGN",
          status: "SUCCESS" as any,
          type: "SUBSCRIPTION",
          metadata: { newPlan, oldPlan } as any,
        },
        update: {
          status: "SUCCESS" as any,
          metadata: { newPlan, oldPlan } as any,
        },
      });

      // 6. Audit Event
      await logAudit({
        storeId,
        actor: {
          type: "USER",
          id: userId,
          label: session.user.email || "Merchant",
        },
        action: AuditAction.PLAN_CHANGED,
        before: { plan: oldPlan },
        after: { plan: newPlan, reference },
      });
    });

    return NextResponse.json({
      success: true,
      message: "Subscription updated successfully",
    });
  } catch (error: any) {
    console.error("Payment verification error:", error);

    if (error.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    if (error.message.includes("Forbidden")) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    return NextResponse.json(
      { error: error.message || "Failed to verify payment" },
      { status: 500 },
    );
  }
}
