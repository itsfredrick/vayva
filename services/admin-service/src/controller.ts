
import { prisma } from '@vayva/db';

const logAdminAction = async (actorUserId: string, action: string, data: any) => {
    await prisma.adminAuditLog.create({
        data: {
            actorUserId,
            action,
            targetType: data.targetType,
            targetId: data.targetId,
            storeId: data.storeId,
            reason: data.reason,
            before: data.before,
            after: data.after,
            ipAddress: data.ipAddress,
            userAgent: data.userAgent
        }
    });
};

export const AdminController = {
    // --- Merchant Management ---
    searchMerchants: async (query: string) => {
        return await prisma.store.findMany({
            where: {
                OR: [
                    { name: { contains: query, mode: 'insensitive' } },
                    { slug: { contains: query, mode: 'insensitive' } },
                    { id: query }
                ]
            },
            take: 20,
            include: {
                merchantSubscription: true
                // merchantFlags: true // No relation
            }
        });
    },

    getMerchantDetail: async (storeId: string) => {
        const store = await prisma.store.findUnique({
            where: { id: storeId },
            include: {
                merchantSubscription: true
                // merchantFlags: true // No relation
                // featureOverrides: true // No relation
                // supportCases: true // No relation
            }
        });

        if (!store) return null;

        // Manual fetches for relation-like data
        const merchantFlags = await prisma.merchantFlag.findMany({ where: { storeId } });
        const supportCases = await prisma.supportCase.findMany({ where: { storeId, status: { in: ['OPEN', 'PENDING'] } } });

        return { ...store, merchantFlags, supportCases };
    },

    suspendMerchant: async (storeId: string, reason: string, actorUserId: string, ipAddress?: string) => {
        const before = await prisma.store.findUnique({ where: { id: storeId } });

        await prisma.merchantFlag.create({
            data: {
                storeId,
                key: 'suspended',
                severity: 'HIGH',
                notes: reason
            }
        });

        await logAdminAction(actorUserId, 'merchant.suspend', {
            targetType: 'store',
            targetId: storeId,
            storeId,
            reason,
            before,
            ipAddress
        });

        return { success: true };
    },

    // --- Kill Switches ---
    listKillSwitches: async () => {
        return await prisma.platformKillSwitch.findMany();
    },

    toggleKillSwitch: async (key: string, enabled: boolean, reason: string, actorUserId: string) => {
        const before = await prisma.platformKillSwitch.findUnique({ where: { key } });

        const killSwitch = await prisma.platformKillSwitch.upsert({
            where: { key },
            create: { key, enabled, reason },
            update: { enabled, reason }
        });

        await logAdminAction(actorUserId, 'killswitch.toggle', {
            targetType: 'killswitch',
            targetId: key,
            reason,
            before,
            after: killSwitch
        });

        return killSwitch;
    },

    // --- Moderation ---
    listPendingReviews: async () => {
        return await prisma.review.findMany({
            where: { status: 'PENDING' },
            // include: { store: true, product: true }, // No relations
            orderBy: { createdAt: 'desc' },
            take: 50
        });
    },

    moderateReview: async (reviewId: string, action: 'PUBLISHED' | 'REJECTED' | 'HIDDEN', reason: string, actorUserId: string) => {
        const before = await prisma.review.findUnique({ where: { id: reviewId } });
        if (!before) throw new Error('Review not found');

        const review = await prisma.review.update({
            where: { id: reviewId },
            data: { status: action }
        });

        await logAdminAction(actorUserId, 'review.moderate', {
            targetType: 'review',
            targetId: reviewId,
            storeId: review.storeId,
            reason,
            before,
            after: review
        });

        return review;
    },

    // --- Support Cases ---
    createSupportCase: async (data: any, actorUserId: string) => {
        return await prisma.supportCase.create({
            data: {
                storeId: data.storeId,
                createdByAdminId: actorUserId,
                category: data.category,
                summary: data.summary,
                links: data.links,
                status: 'OPEN'
            }
        });
    },

    listSupportCases: async (status?: string) => {
        return await prisma.supportCase.findMany({
            where: status ? { status: status as any } : undefined,
            // include: { store: true }, // No relation
            orderBy: { createdAt: 'desc' },
            take: 100
        });
    },

    // --- System Health ---
    getSystemHealth: async () => {
        const webhooksPending = await prisma.webhookDelivery.count({
            where: { status: 'PENDING' }
        });

        const webhooksFailed = await prisma.webhookDelivery.count({
            where: { status: 'FAILED' }
        });

        return {
            webhooks: {
                pending: webhooksPending,
                failed: webhooksFailed
            },
            timestamp: new Date()
        };
    }
};
