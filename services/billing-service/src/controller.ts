
import { prisma } from '@vayva/db';

export const BillingController = {
    // --- Plans ---
    listPlans: async () => {
        return await prisma.plan.findMany({
            where: { isActive: true },
            orderBy: { priceMonthly: 'asc' }
        });
    },

    // --- Subscriptions ---
    getSubscription: async (storeId: string) => {
        return await prisma.subscription.findUnique({
            where: { storeId }
            // include: { plan: true } // Removed: no relation in schema
        });
    },

    createSubscription: async (storeId: string, planKey: string, trial: boolean = true) => {
        const plan = await prisma.plan.findUnique({ where: { key: planKey } });
        if (!plan) throw new Error('Plan not found');

        const now = new Date();
        const trialDays = 14;
        const trialEnd = new Date(now.getTime() + trialDays * 24 * 60 * 60 * 1000);

        return await prisma.subscription.create({
            data: {
                storeId,
                planKey,
                status: trial ? 'TRIALING' : 'ACTIVE',
                provider: 'STRIPE',
                currentPeriodStart: now,
                currentPeriodEnd: new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000),
                trialEndsAt: trial ? trialEnd : null
            }
        });
    },

    upgradePlan: async (storeId: string, newPlanKey: string) => {
        const subscription = await prisma.subscription.findUnique({ where: { storeId } });
        if (!subscription) throw new Error('No subscription found');

        return await prisma.subscription.update({
            where: { storeId },
            data: { planKey: newPlanKey }
        });
    },

    cancelSubscription: async (storeId: string, immediate: boolean = false) => {
        return await prisma.subscription.update({
            where: { storeId },
            data: {
                cancelAtPeriodEnd: !immediate,
                ...(immediate && { status: 'CANCELED' })
            }
        });
    },

    // --- Entitlements ---
    checkEntitlement: async (storeId: string, feature: string): Promise<boolean> => {
        const subscription = await prisma.subscription.findUnique({
            where: { storeId }
        });

        if (!subscription || subscription.status === 'CANCELED') return false;

        // Fetch plan manually
        const plan = await prisma.plan.findUnique({ where: { key: subscription.planKey } });
        if (!plan) return false;

        const limits = plan.limits as any;

        // Example checks
        if (feature === 'custom_domain') return limits.custom_domain === true;
        if (feature === 'automation_campaigns') return limits.automation_campaigns === true;

        return true;
    },

    getUsageLimit: async (storeId: string, usageKey: string) => {
        const subscription = await prisma.subscription.findUnique({
            where: { storeId }
        });

        if (!subscription) return { used: 0, limit: 0, remaining: 0 };

        const plan = await prisma.plan.findUnique({ where: { key: subscription.planKey } });
        const limits = (plan?.limits as any) || {};
        const limit = limits[usageKey] || 0;

        const counter = await prisma.usageCounter.findFirst({
            where: {
                storeId,
                key: usageKey,
                periodStart: { lte: new Date() },
                periodEnd: { gte: new Date() }
            }
        });

        const used = counter?.used || 0;
        return { used, limit, remaining: Math.max(0, limit - used) };
    },

    incrementUsage: async (storeId: string, usageKey: string, amount: number = 1) => {
        const now = new Date();
        const periodStart = new Date(now.getFullYear(), now.getMonth(), 1);
        const periodEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0);

        const subscription = await prisma.subscription.findUnique({
            where: { storeId }
        });

        if (!subscription) return;

        const plan = await prisma.plan.findUnique({ where: { key: subscription.planKey } });
        const limits = (plan?.limits as any) || {};
        const limit = limits[usageKey] || 0;

        await prisma.usageCounter.upsert({
            where: { storeId_key_periodStart: { storeId, key: usageKey, periodStart } },
            create: {
                storeId,
                key: usageKey,
                periodStart,
                periodEnd,
                used: amount,
                limit
            },
            update: {
                used: { increment: amount }
            }
        });
    },

    // --- Invoices ---
    listInvoices: async (storeId: string) => {
        return await prisma.invoice.findMany({
            where: { storeId },
            orderBy: { createdAt: 'desc' }
        });
    }
};
