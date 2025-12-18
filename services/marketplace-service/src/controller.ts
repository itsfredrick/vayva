
import { prisma } from '@vayva/db';

export const MarketplaceController = {
    // --- Directory Search ---
    searchStores: async (filters: any) => {
        const { state, city, category, pickupAvailable, page = 1, limit = 20 } = filters;

        const where: any = { isDirectoryListed: true };
        if (state) where.state = state;
        if (city) where.city = city;
        if (category) where.categories = { has: category };
        if (pickupAvailable) where.pickupAvailable = true;

        const stores = await prisma.storeProfile.findMany({
            where,
            skip: (page - 1) * limit,
            take: limit,
            orderBy: { createdAt: 'desc' }
        });

        return stores;
    },

    getStoreProfile: async (slug: string) => {
        return await prisma.storeProfile.findUnique({
            where: { slug },
            include: {
                reviews: {
                    where: { status: 'PUBLISHED' },
                    orderBy: { createdAt: 'desc' },
                    take: 10
                }
            }
        });
    },

    // --- Reviews ---
    createReview: async (data: any) => {
        return await prisma.review.create({
            data: {
                storeId: data.storeId,
                storeProfileId: data.storeProfileId,
                productId: data.productId,
                orderId: data.orderId,
                customerId: data.customerId,
                rating: data.rating,
                title: data.title,
                body: data.body,
                isVerifiedPurchase: data.isVerifiedPurchase || false,
                status: data.autoPublish ? 'PUBLISHED' : 'PENDING'
            }
        });
    },

    listReviews: async (storeId: string, status?: string) => {
        return await prisma.review.findMany({
            where: {
                storeId,
                ...(status && { status: status as any })
            },
            orderBy: { createdAt: 'desc' }
        });
    },

    publishReview: async (reviewId: string) => {
        return await prisma.review.update({
            where: { id: reviewId },
            data: { status: 'PUBLISHED' }
        });
    },

    hideReview: async (reviewId: string) => {
        return await prisma.review.update({
            where: { id: reviewId },
            data: { status: 'HIDDEN' }
        });
    },

    // --- Trust Badges ---
    computeTrustBadges: async (storeId: string) => {
        // Fetch analytics from Integration 12
        const analytics = await prisma.analyticsDailyDelivery.aggregate({
            where: {
                storeId,
                date: { gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) }
            },
            _avg: { deliverySuccessRate: true }
        });

        const support = await prisma.analyticsDailySupport.aggregate({
            where: {
                storeId,
                date: { gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) }
            },
            _avg: { firstResponseAvgSeconds: true }
        });

        const badges: string[] = [];
        const metrics: any = {};

        // Verified Store
        const store = await prisma.store.findUnique({
            where: { id: storeId },
            include: { storefrontSettings: true }
        });
        if (store?.storefrontSettings) {
            badges.push('verified');
        }

        // Reliable Delivery
        if (((analytics._avg.deliverySuccessRate as any) || 0) >= 90) {
            badges.push('reliable_delivery');
            metrics.deliverySuccessRate = analytics._avg.deliverySuccessRate;
        }

        // Fast Response
        if (((support._avg.firstResponseAvgSeconds as any) || 0) <= 300) { // 5 minutes
            badges.push('fast_response');
            metrics.avgResponseTimeSeconds = support._avg.firstResponseAvgSeconds;
        }

        return { badges, metrics };
    },

    // --- Moderation ---
    createReport: async (data: any) => {
        return await prisma.report.create({
            data: {
                entityType: data.entityType,
                entityId: data.entityId,
                reporterIp: data.reporterIp,
                reporterCustomerId: data.reporterCustomerId,
                reason: data.reason,
                details: data.details,
                status: 'OPEN'
            }
        });
    },

    listReports: async (status?: string) => {
        return await prisma.report.findMany({
            where: status ? { status: status as any } : undefined,
            orderBy: { createdAt: 'desc' }
        });
    }
};
