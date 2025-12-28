
import { prisma } from '@vayva/db';
import { nanoid } from 'nanoid';

/**
 * Service to handle seller-to-seller referrals and rewards.
 */
export class ReferralService {
    /**
     * Generates a unique referral code for a new seller.
     */
    static async generateCode(storeId: string): Promise<string> {
        const code = nanoid(8).toUpperCase();
        await prisma.store.update({
            where: { id: storeId },
            data: {
                settings: {
                    upsert: {
                        update: { referralCode: code },
                        set: { referralCode: code }
                    }
                }
            }
        });
        return code;
    }

    /**
     * Records a new referral during onboarding.
     */
    static async trackReferral(refereeStoreId: string, referralCode: string) {
        // Find the referrer (owner of the code)
        const allStores = await prisma.store.findMany({ select: { id: true, settings: true } });
        const referrer = allStores.find(s => (s.settings as any)?.referralCode === referralCode);

        if (!referrer) return { success: false, error: 'Invalid referral code' };
        if (referrer.id === refereeStoreId) return { success: false, error: 'Self-referral not allowed' };

        await prisma.referralAttribution.create({
            data: {
                partnerId: 'system', // Distinguish from partner referrals
                merchantId: refereeStoreId,
                referralCode: referralCode,
                metadata: { referrerStoreId: referrer.id }
            }
        });

        return { success: true };
    }

    /**
     * Triggers the reward logic when a referee makes their first payment.
     * Rewards referrer with 1,000 Naira credit for their next bill.
     */
    static async processRefereePayment(refereeStoreId: string) {
        const attribution = await prisma.referralAttribution.findUnique({
            where: { merchantId: refereeStoreId }
        });

        if (!attribution || attribution.firstPaymentAt) return;

        // Update attribution
        await prisma.referralAttribution.update({
            where: { id: attribution.id },
            data: { firstPaymentAt: new Date() }
        });

        const referrerStoreId = (attribution.metadata as any)?.referrerStoreId;
        if (!referrerStoreId) return;

        // Create a reward entry in LedgerEntry
        await prisma.ledgerEntry.create({
            data: {
                storeId: referrerStoreId,
                amount: 1000,
                currency: 'NGN',
                direction: 'IN', // Assuming credit
                account: 'CREDITS',
                referenceType: 'REFERRAL_REWARD',
                referenceId: refereeStoreId,
                description: `Referral reward for store ${refereeStoreId}`,
                metadata: { type: 'REFERRAL_REWARD' }
            }
        });
    }

    /**
     * Calculates the discount for the next billing cycle.
     * Capped at 6 rewards (6000 Naira) per month.
     */
    static async getMonthlyDiscount(storeId: string): Promise<number> {
        const now = new Date();
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

        const rewards = await prisma.ledgerEntry.findMany({
            where: {
                storeId,
                referenceType: 'REFERRAL_REWARD',
                createdAt: { gte: startOfMonth }
            },
            take: 6
        });

        return rewards.length * 1000;
    }
}
