import crypto from "crypto";
import { prisma } from "@vayva/db";
import { FlagService } from "../flags/flagService";

export class WebhookService {
  static signPayload(
    secret: string,
    payload: any,
    eventId: string,
    timestamp: number,
  ): string {
    const signaturePayload = `${timestamp}.${eventId}.${JSON.stringify(payload)}`;
    return crypto
      .createHmac("sha256", secret)
      .update(signaturePayload)
      .digest("hex");
  }

  static async triggerEvent(
    merchantId: string,
    eventName: string,
    payload: any,
  ) {
    // KILL SWITCH CHECK
    const enabled = await FlagService.isEnabled("webhooks.outbound.enabled", {
      merchantId,
    });
    if (!enabled) {
      console.warn(
        `[Webhook] Blocked by Kill Switch for merchant ${merchantId}`,
      );
      return;
    }

    const subscriptions = await prisma.webhookSubscription.findMany({
      where: {
        merchantId,
        status: "active",
        events: { has: eventName },
      },
    });

    const eventId = crypto.randomUUID();

    // Queue Deliveries
    for (const sub of subscriptions) {
      const delivery = await prisma.webhookDelivery.create({
        data: {
          endpointId: sub.id,
          storeId: merchantId,
          eventType: eventName,
          eventId,
          status: "PENDING",
        },
      });

      // In V1, we simulate "Worker" processing immediately
      await this.processDelivery(sub, eventId, payload, delivery.id);
    }
  }

  // Testing the worker process
  private static async processDelivery(
    sub: any,
    eventId: string,
    payload: any,
    deliveryId: string,
  ) {
    const timestamp = Date.now();
    const signature = this.signPayload(
      sub.signingSecretHash,
      payload,
      eventId,
      timestamp,
    );

    console.log(`[Webhook] Sending to ${sub.url} `, {
      "X-Vayva-Event": payload.type,
      "X-Vayva-Signature": signature,
    });

    // Test update
    await prisma.webhookDelivery.update({
      where: { id: deliveryId },
      data: {
        status: "DELIVERED",
        responseCode: 200,
        deliveredAt: new Date(),
      },
    });
  }
}
