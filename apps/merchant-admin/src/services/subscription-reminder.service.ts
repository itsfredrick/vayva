import { prisma } from '@vayva/db';
import { ResendEmailService } from '@/lib/email/resend';
import { format, addDays, startOfDay, endOfDay } from 'date-fns';

/**
 * Service to handle subscription-related background tasks.
 */
export class SubscriptionRemainderService {
    /**
     * Finds and notifies merchants whose subscriptions expire in exactly 3 days.
     * Designed to be run daily at a fixed Lagos time (e.g., 09:00 AM).
     */
    static async notifyExpiringSubscriptions() {
        // 1. Calculate the target date (Now + 3 days)
        // Lagos is UTC+1. In the morning (09:00 Lagos), UTC is 08:00.
        const targetDate = addDays(new Date(), 3);

        const targetDayStart = startOfDay(targetDate);
        const targetDayEnd = endOfDay(targetDate);

        // 2. Query subscriptions expiring in that window
        const expiringSubs = await prisma.merchantSubscription.findMany({
            where: {
                status: 'ACTIVE',
                currentPeriodEnd: {
                    gte: targetDayStart,
                    lte: targetDayEnd,
                },
                // Avoid resending if already sent recently for this period
                OR: [
                    { lastReminderSentAt: null },
                    { lastReminderSentAt: { lt: addDays(new Date(), -20) } } // Safe buffer
                ]
            },
            include: {
                store: {
                    include: {
                        memberships: {
                            where: { role: 'OWNER' },
                            include: { User: true }
                        }
                    }
                }
            }
        });

        console.log(`[SubscriptionReminder] Found ${expiringSubs.length} subscriptions expiring in 3 days.`);

        for (const sub of expiringSubs) {
            const ownerEmail = sub.store.memberships[0]?.User?.email;
            if (!ownerEmail) continue;

            try {
                // 3. Send Email
                await ResendEmailService.sendSubscriptionExpiryReminder(
                    ownerEmail,
                    sub.store.name,
                    sub.planSlug,
                    format(sub.currentPeriodEnd!, 'MMM do, yyyy')
                );

                // 4. Update reminder timestamp to prevent duplicates
                await prisma.merchantSubscription.update({
                    where: { id: sub.id },
                    data: { lastReminderSentAt: new Date() }
                });

            } catch (error) {
                console.error(`[SubscriptionReminder] Failed to notify ${ownerEmail}:`, error);
            }
        }
    }
}
