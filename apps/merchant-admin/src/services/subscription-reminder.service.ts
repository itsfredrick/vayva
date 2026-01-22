import { prisma } from "@vayva/db";
import { ResendEmailService } from "@/lib/email/resend";
import { format, addDays, startOfDay, endOfDay } from "date-fns";

/**
 * Service to handle subscription-related background tasks.
 * 
 * NOTE: Uses MerchantAiSubscription model from the schema.
 */
export class SubscriptionRemainderService {
  /**
   * Finds and notifies merchants whose subscriptions expire in exactly 3 days.
   * Designed to be run daily at a fixed Lagos time (e.g., 09:00 AM).
   */
  static async notifyExpiringSubscriptions() {
    const threeDaysFromNow = startOfDay(addDays(new Date(), 3));
    const endOfThreeDays = endOfDay(threeDaysFromNow);

    const expiringSubscriptions = await (prisma as unknown).merchantAiSubscription.findMany({
      where: {
        periodEnd: {
          gte: threeDaysFromNow,
          lte: endOfThreeDays,
        },
        status: { in: ["TRIAL_ACTIVE", "UPGRADED_ACTIVE"] },
      },
      include: {
        store: {
          select: {
            name: true,
            id: true,
          },
        },
      },
    });

    for (const sub of expiringSubscriptions) {
      // Find a manager/owner email for this store
      const membership = await (prisma as unknown).membership.findFirst({
        where: {
          storeId: sub.storeId,
          role_enum: "OWNER"
        },
        include: {
          user: {
            select: { email: true }
          }
        },
      });

      if (membership?.user?.email) {
        await (ResendEmailService as unknown).send(
          membership.user.email,
          "subscription_reminder",
          {
            storeName: sub.store.name,
            expiryDate: format(sub.periodEnd, "MMM do, yyyy"),
            renewLink: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/billing`,
          }
        );
        console.log(`[SubscriptionReminder] Notified ${membership.user.email} for store ${sub.store.name}`);
      }
    }
  }
}
