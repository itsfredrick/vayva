import { prisma } from "@vayva/db";
import { SecurityUtils } from "../security/tokens";
import { RecoveryService } from "./recoveryService";

export class CheckoutService {
  static async createSession(data: {
    storeId: string;
    merchantId: string;
    cart: any;
    amount: number;
    customerEmail?: string;
    customerPhone?: string;
    idempotencyKey?: string; // Client provided or auto-generated
  }) {
    const idempotencyKey = data.idempotencyKey || SecurityUtils.generateToken(); // Simplified for V1

    // 1. Check Idempotency (if key provided reused)
    const existing = await prisma.checkout_session.findUnique({
      where: { idempotencyKey },
    });
    if (existing) return { session: existing, resumeToken: null }; // Don't return resume token again if already exists

    // 2. Draft Order ID (Test)
    const orderDraftId = `draft_${Date.now()}_${Math.random().toString(36).slice(2)}`;

    // 3. Resume Token
    const resumeToken = SecurityUtils.generateToken();
    const resumeTokenHash = SecurityUtils.hashToken(resumeToken);

    const session = await prisma.checkout_session.create({
      data: {
        storeId: data.storeId,
        merchantId: data.merchantId,
        orderDraftId,
        cart: data.cart,
        amount: data.amount,
        customerEmail: data.customerEmail,
        customerPhone: data.customerPhone,
        idempotencyKey,
        resumeTokenHash,
        resumeExpiresAt: new Date(Date.now() + 48 * 60 * 60 * 1000), // 48h
      },
    });

    // 4. Schedule Recovery (Fire & Forget)
    if (data.customerEmail || data.customerPhone) {
      await RecoveryService.scheduleRecovery(session.id, data.merchantId);
    }

    return { session, resumeToken };
  }

  static async initiatePayment(sessionId: string) {
    const session = await prisma.checkout_session.findUnique({
      where: { id: sessionId },
    });
    if (!session) throw new Error("Session not found");
    if (session.status === "paid") return { status: "paid" };

    // Test Payment Provider Call
    // In real world: check if we already have a payment_intent for this session, reuse it.

    return {
      status: "pending",
      providerUrl: `https://paystack.com/pay/test_${session.id}`,
    };
  }
}
