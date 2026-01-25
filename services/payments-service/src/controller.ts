import { FastifyRequest, FastifyReply } from "fastify";
import { z } from "zod";
import { prisma, Prisma } from "@vayva/db";
import axios from "axios";
import * as crypto from "crypto";
// TODO: NotificationManager not yet exported from @vayva/shared

const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY;
const IS_TEST_MODE = process.env.PAYSTACK_MOCK === "true";

const verifySchema = z.object({
  reference: z.string(),
  storeId: z.string(),
});

const initializeSchema = z.object({
  orderId: z.string(),
  email: z.string().email(),
  amount: z.number(), // In Kobo
  currency: z.string().default("NGN"),
  callbackUrl: z.string().optional(),
  metadata: z.unknown().optional(),
});

export const initializeTransactionHandler = async (
  req: FastifyRequest,
  reply: FastifyReply,
): Promise<unknown> => {
  const body = initializeSchema.parse(req.body);

  const order = await prisma.order.findUnique({ where: { id: body.orderId } });
  if (!order) return reply.status(404).send({ error: "Order not found" });

  const reference = `vva_${crypto.randomBytes(8).toString("hex")}`;

  // Create Transaction Record in INITIATED state
  await prisma.paymentTransaction.create({
    data: {
      storeId: order.storeId,
      orderId: body.orderId,
      reference,
      amount: body.amount,
      currency: body.currency,
      status: "INITIATED",
      provider: "PAYSTACK",
      type: "CHARGE",
      metadata: body.metadata || {},
    },
  });

  // --- Trigger Payout Details Missing Notification ---
  // TODO: Implement NotificationManager in @vayva/shared
  /*
  try {
    const bankCount = await prisma.bankBeneficiary.count({
      where: { storeId: order.storeId },
    });
    if (bankCount === 0) {
      await NotificationManager.trigger(
        order.storeId,
        "PAYOUT_DETAILS_MISSING",
      );
    }
  } catch (err) {
    console.error("[PaymentsService] Notification trigger error:", err);
  }
  */

  // --- Paystack Logic (Existing) ---
  if (IS_TEST_MODE) {
    const storefrontUrl = process.env.STOREFRONT_URL || "http://localhost:3001";
    return reply.send({
      status: true,
      message: "Test Mode: Authorization URL created",
      data: {
        authorization_url: `${storefrontUrl}/paystack-checkout?reference=${reference}&amount=${body.amount}`,
        access_code: reference, // Use actual reference 
        reference,
      },
    });
  }

  if (!PAYSTACK_SECRET_KEY) {
    throw new Error("PAYSTACK_SECRET_KEY is not defined");
  }


  try {
    const response = await axios.post(
      "https://api.paystack.co/transaction/initialize",
      {
        email: body.email,
        amount: body.amount,
        reference,
        callback_url: body.callbackUrl,
        metadata: {
          ...((body.metadata as Record<string, unknown>) || {}),
          orderId: body.orderId,
          storeId: order.storeId,
        },
      },
      {
        headers: { Authorization: `Bearer ${PAYSTACK_SECRET_KEY}` },
      },
    );

    return reply.send(response.data);
  } catch (error) {
    const errorMessage = error instanceof Error ? (error instanceof Error ? error.message : String(error)) : "Unknown error";
    console.error(
      "Paystack Initialize Error:",
      axios.isAxiosError(error) ? (error.response?.data as unknown) : errorMessage,
    );
    return reply.status(500).send({ error: "Failed to initialize payment" });
  }
};

export const verifyPaymentHandler = async (
  req: FastifyRequest,
  reply: FastifyReply,
): Promise<unknown> => {
  const { reference } = verifySchema.parse(req.body);

  const tx = await prisma.paymentTransaction.findUnique({
    where: { reference },
  });

  if (!tx) return reply.status(404).send({ error: "Transaction not found" });
  if (tx.status === "VERIFIED" || tx.status === "SUCCESS") {
    return reply.send({ status: tx.status, transaction: tx });
  }

  let paystackData;
  if (IS_TEST_MODE) {
    paystackData = { status: "success", reference };
  } else {
    try {
      const response = await axios.get(
        `https://api.paystack.co/transaction/verify/${reference}`,
        {
          headers: { Authorization: `Bearer ${PAYSTACK_SECRET_KEY}` },
        },
      );
      paystackData = response.data.data;
    } catch (error) {
      const errorMessage = error instanceof Error ? (error instanceof Error ? error.message : String(error)) : "Unknown error";
      console.error(
        "Paystack Verify Error:",
        axios.isAxiosError(error) ? (error.response?.data as unknown) : errorMessage,
      );
      return reply.status(500).send({ error: "Failed to verify payment" });
    }
  }

  if (paystackData.status === "success") {
    if (!tx.orderId) {
      console.error("[PaymentsService] Transaction missing orderId:", tx.id);
      return reply.status(400).send({ error: "Transaction missing orderId" });
    }
    await processSuccessfulPayment({ ...tx, orderId: tx.orderId, amount: Number(tx.amount) }, paystackData);
    const updated = await prisma.paymentTransaction.findUnique({
      where: { id: tx.id },
    });
    return reply.send({ status: "SUCCESS", transaction: updated });
  }

  return reply.send({ status: "FAILED", transaction: tx });
};

export const webhookHandler = async (
  req: FastifyRequest,
  reply: FastifyReply,
): Promise<unknown> => {
  const signature = req.headers["x-paystack-signature"] as string;

  // In test mode without key, we might skip signature check for internal test endpoint
  if (!IS_TEST_MODE || signature) {
    if (!PAYSTACK_SECRET_KEY) {
      console.error("Missing PAYSTACK_SECRET_KEY for webhook verification");
      return reply.status(500).send({ error: "Configuration Error" });
    }
    const hash = crypto
      .createHmac("sha512", PAYSTACK_SECRET_KEY)
      .update(JSON.stringify(req.body))
      .digest("hex");

    if (hash !== signature) {
      return reply.status(401).send({ error: "Invalid signature" });
    }
  }

  const event = req.body as { event: string; data: { reference: string } };

  if (event.event === "charge.success") {
    const reference = event.data.reference;
    const tx = await prisma.paymentTransaction.findUnique({
      where: { reference },
    });

    if (tx && tx.status !== "SUCCESS" && tx.status !== "VERIFIED") {
      if (tx.orderId) {
        await processSuccessfulPayment({ ...tx, orderId: tx.orderId, amount: Number(tx.amount) }, event.data);
      }
    }
  }

  return reply.send({ status: "success" });
};

async function processSuccessfulPayment(tx: { id: string; orderId: string; currency: string; amount: number; reference: string; storeId: string }, paystackData: unknown) {
  // 1. Update Transaction
  await prisma.paymentTransaction.update({
    where: { id: tx.id },
    data: {
      status: "SUCCESS",
      metadata: paystackData as Prisma.InputJsonValue,
    },
  });

  // 2. Update Order via Internal Request (or direct Prisma if common DB)
  // For V1 we use direct Prisma since they share the DB
  await prisma.order.update({
    where: { id: tx.orderId },
    data: {
      paymentStatus: "SUCCESS",
      status: "PAID",
    },
  });

  // 3. Create Timeline Event
  await prisma.orderTimelineEvent.create({
    data: {
      orderId: tx.orderId,
      title: "PAYMENT_CONFIRMED",
      body: `Payment of ${tx.currency} ${tx.amount / 100} confirmed via Paystack. Ref: ${tx.reference}`,
    },
  });

  // 4. Create Receipt
  const receiptNumber = `RCP-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
  await prisma.receipt.create({
    data: {
      orderId: tx.orderId,
      url: `https://dash.vayva.app/receipts/${receiptNumber}`,
    },
  });

  // 5. Trigger Notifications
  try {
    const notificationServiceUrl = process.env.NOTIFICATIONS_SERVICE_URL || "http://notifications-service:3000";

    await fetch(`${notificationServiceUrl}/v1/internal/event`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        type: "PAYMENT_CONFIRMED",
        storeId: tx.storeId,
        payload: {
          amount: tx.amount,
          currency: tx.currency,
          reference: tx.reference,
          orderId: tx.orderId
        }
      })
    });
  } catch (error) {
    console.error("Failed to trigger payment notification:", error);
  }
}

export const listTransactionsHandler = async (
  req: FastifyRequest,
  reply: FastifyReply,
): Promise<unknown> => {
  const storeId = req.headers["x-store-id"] as string;
  if (!storeId) return reply.status(400).send({ error: "Store ID required" });

  const transactions = await prisma.paymentTransaction.findMany({
    where: { storeId },
    include: {
      order: {
        include: { customer: true },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return reply.send(transactions);
};
