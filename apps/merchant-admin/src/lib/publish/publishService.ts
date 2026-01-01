// @ts-nocheck

// @ts-nocheck
import { prisma } from "@vayva/db";
import { computeMerchantReadiness } from "@/lib/ops/computeReadiness";
import { v4 as uuidv4 } from "uuid";

export class PublishService {
  static async getPublishStatus(storeId: string) {
    const store = await prisma.store.findUnique({
      where: { id: storeId },
      select: { isLive: true, liveAt: true, unpublishedAt: true },
    });

    if (!store) throw new Error("Store not found");

    const readiness = await computeMerchantReadiness(storeId);

    return {
      isLive: store.isLive,
      liveAt: store.liveAt,
      readiness,
    };
  }

  static async goLive(storeId: string, userId: string, userLabel: string) {
    // 1. Check Readiness
    const readiness = await computeMerchantReadiness(storeId);

    if (readiness.level !== "ready") {
      // Exceptions: Maybe 'warning' is okay. Contract says blocked if 'blocked'.
      // If level is blocked, we reject.
      if (readiness.level === "blocked") {
        throw new Error("Store is not ready to go live. Please fix blockers.");
      }
    }

    const correlationId = uuidv4();

    // 2. Update Store
    await prisma.store.update({
      where: { id: storeId },
      data: {
        isLive: true,
        liveAt: new Date(),
        unpublishedAt: null,
      },
    });

    // 3. Log History
    await prisma.publishHistory.create({
      data: {
        storeId,
        action: "publish",
        actorType: "merchant_user",
        actorId: userId,
        actorLabel: userLabel,
        correlationId,
      },
    });

    return { success: true, correlationId };
  }

  static async unpublish(
    storeId: string,
    userId: string,
    userLabel: string,
    reason: string,
  ) {
    const correlationId = uuidv4();

    await prisma.store.update({
      where: { id: storeId },
      data: {
        isLive: false,
        unpublishedAt: new Date(),
      },
    });

    await prisma.publishHistory.create({
      data: {
        storeId,
        action: "unpublish",
        actorType: "merchant_user",
        actorId: userId,
        actorLabel: userLabel,
        correlationId,
        metadata: { reason },
      },
    });

    return { success: true };
  }

  static async adminOverridePublish(
    storeId: string,
    adminId: string,
    adminLabel: string,
    reason: string,
  ) {
    const correlationId = uuidv4();

    await prisma.store.update({
      where: { id: storeId },
      data: {
        isLive: true,
        liveAt: new Date(),
      },
    });

    await prisma.publishHistory.create({
      data: {
        storeId,
        action: "admin_override_publish",
        actorType: "platform_admin",
        actorId: adminId,
        actorLabel: adminLabel,
        correlationId,
        metadata: { reason },
      },
    });

    return { success: true, correlationId };
  }
}
