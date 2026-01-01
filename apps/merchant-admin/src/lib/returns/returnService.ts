import { prisma } from "@vayva/db";

export class ReturnService {
  static async createRequest(
    storeId: string,
    orderId: string,
    customerPhone: string,
    payload: {
      items: any[];
      reason: string;
      notes?: string;
      preferredMethod?: string;
    },
  ) {
    // Check if exists
    const existing = await prisma.returnRequest.findFirst({
      where: { orderId: orderId, status: { not: "CANCELLED" } },
    });

    if (existing) {
      throw new Error("Return already active for this order");
    }

    const request = await prisma.returnRequest.create({
      data: {
        merchantId: storeId,
        orderId: orderId,
        // customerPhone mapped to notes or ignored (schema doesn't have it)
        // reason mapped to reasonText (schema has reasonCode enum and optional reasonText)
        reasonCode: "OTHER", // Defaulting as mapping 'reason' string to enum is complex without more logic
        reasonText: payload.reason,
        resolutionType: "REFUND", // Defaulting
        status: "REQUESTED",
        // items and logistics removed as they do not exist in schema
        /*
                items: {
                    create: payload.items.map((i: any) => ({
                        qty: i.quantity || 1,
                    }))
                },
                logistics: payload.preferredMethod ? {
                    create: {
                        method: payload.preferredMethod === 'pickup' ? 'CARRIER' : 'DROPOFF',
                    }
                } : undefined
                */
      },
    });

    return request;
  }

  static async getRequests(storeId: string) {
    return prisma.returnRequest.findMany({
      where: { merchantId: storeId },
      orderBy: { createdAt: "desc" },
      // include: { items: true, logistics: true } // Removed
    });
  }

  static async updateStatus(
    requestId: string,
    status: string,
    actorId: string,
    data?: {
      decisionReason?: string;
      pickupAddress?: any;
      dropoffAddress?: any;
      inspectionOutcome?: string;
    },
  ) {
    // Logic for specific status transitions
    await prisma.$transaction(async (tx) => {
      await tx.returnRequest.update({
        where: { id: requestId },
        data: {
          status: status as any,
          approvedAt: status === "APPROVED" ? new Date() : undefined,
          completedAt: status === "COMPLETED" ? new Date() : undefined,
        },
      });
    });
  }
}
