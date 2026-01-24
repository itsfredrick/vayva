import { prisma } from "@vayva/db";

export class OutboxWorker {
  static async processOutbox() {
    // Fetch pending events
    const events = await prisma.outboxEvent.findMany({
      where: {
        status: "PENDING",
        OR: [{ nextRetryAt: null }, { nextRetryAt: { lte: new Date() } }],
      },
      take: 100,
      orderBy: { createdAt: "asc" },
    });

    for (const event of events) {
      await OutboxWorker.processEvent(event);
    }
  }

  static async processEvent(event: unknown) {
    // Mark as processing
    await prisma.outboxEvent.update({
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      where: { id: (event as any).id },
      data: { status: "PROCESSING" },
    });

    try {
      // Route to appropriate handler based on type
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      switch ((event as any).type) {
        case "whatsapp.send":
          // await WhatsAppService.send(event.payload);
          break;
        case "webhook.deliver":
          // await WebhookService.deliver(event.payload);
          break;
        case "notification.send":
          // await NotificationService.send(event.payload);
          break;
        default:
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          console.warn(`Unknown outbox event type: ${(event as any).type}`);
      }

      // Mark as processed
      await prisma.outboxEvent.update({
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        where: { id: (event as any).id },
        data: { status: "PROCESSED" },
      });
    } catch {
      // Mark as failed and schedule retry
      const nextRetryAt = new Date(Date.now() + 60000); // 1 minute
      await prisma.outboxEvent.update({
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        where: { id: (event as any).id },
        data: {
          status: "FAILED",
          nextRetryAt,
        },
      });
    }
  }
}
