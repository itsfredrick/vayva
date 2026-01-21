import { prisma } from "@vayva/db";
import { nanoid } from "nanoid";

/**
 * Service to handle seller-to-seller referrals and rewards.
 */
export class ReferralService {
  /**
   * Retrieves or generates a unique referral code for a store.
   */
  static async getOrCreateCode(storeId: string): Promise<string> {
    const store = await prisma.store.findUnique({
      where: { id: storeId },
      select: { settings: true }
    });

    const settings = (store?.settings as Record<string, any>) || {};
    if (settings.referralCode) return settings.referralCode as string;

    const code = nanoid(8).toUpperCase();
    await prisma.store.update({
      where: { id: storeId },
      data: {
        settings: {
          ...settings,
          referralCode: code
        },
      },
    });
    return code;
  }

  /**
   * Fetches affiliate stats for a store.
   */
  static async getStats(storeId: string) {
    const store = await prisma.store.findUnique({
      where: { id: storeId },
      select: { settings: true }
    });
    const referralCode = (store?.settings as Record<string, any>)?.referralCode as string | undefined;

    const [referrals, credits] = await Promise.all([
      prisma.referralAttribution.findMany({
        where: {
          metadata: {
            path: ["referrerStoreId"],
            equals: storeId
          }
        },
        select: { signupCompletedAt: true, firstPaymentAt: true }
      }),
      prisma.ledgerEntry.findMany({
        where: {
          storeId,
          referenceType: "REFERRAL_REWARD"
        },
        orderBy: { createdAt: "desc" }
      })
    ]);

    const totalEarned = credits.reduce((sum, c) => sum + Number(c.amount), 0);

    return {
      referralCode,
      stats: {
        totalEarned,
        totalReferrals: referrals.length,
        commissionRate: "₦1,000 credit"
      },
      history: credits.map(c => ({
        id: c.id,
        date: c.createdAt.toISOString(),
        amount: Number(c.amount),
        description: c.description || "Referral Reward"
      }))
    };
  }

  /**
   * Records a new referral during onboarding.
   */
  static async trackReferral(refereeStoreId: string, referralCode: string) {
    const referrer = await prisma.store.findFirst({
      where: {
        settings: {
          path: ["referralCode"],
          equals: referralCode,
        },
      } as any,
    });

    if (!referrer) return { success: false, error: "Invalid referral code" };
    if (referrer.id === refereeStoreId)
      return { success: false, error: "Self-referral not allowed" };

    await prisma.referralAttribution.create({
      data: {
        partnerId: "system",
        merchantId: refereeStoreId,
        referralCode: referralCode,
        metadata: { referrerStoreId: referrer.id },
      },
    });

    return { success: true };
  }

  /**
   * Triggers the reward logic when a referee makes their first payment.
   */
  static async processRefereePayment(refereeStoreId: string) {
    const attribution = await prisma.referralAttribution.findUnique({
      where: { merchantId: refereeStoreId },
    });

    if (!attribution || attribution.firstPaymentAt) return;

    await prisma.referralAttribution.update({
      where: { id: attribution.id },
      data: { firstPaymentAt: new Date() },
    });

    const referrerStoreId = (attribution.metadata as any)?.referrerStoreId;
    if (!referrerStoreId) return;

    await prisma.ledgerEntry.create({
      data: {
        storeId: referrerStoreId,
        amount: 1000,
        currency: "NGN",
        direction: "IN",
        account: "CREDITS",
        referenceType: "REFERRAL_REWARD",
        referenceId: refereeStoreId,
        description: `Referral reward for store ${refereeStoreId}`,
        metadata: { type: "REFERRAL_REWARD" },
      },
    });
  }
  static async generateCode(storeId: string) {
    return this.getOrCreateCode(storeId);
  }

  static async getMonthlyDiscount(storeId: string) {
    // Stub implementation
    return 0;
  }
}
