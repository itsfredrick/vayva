import { prisma, SubscriptionPlan } from "@vayva/db";

export type Feature = "order_creation" | "whatsapp_ai" | "advanced_analytics" | "custom_domain" | "vavya_cut_pro" | "template_usage";

export async function checkFeatureAccess(storeId: string, feature: Feature) {
    const store = await prisma.store.findUnique({
        where: { id: storeId },
        include: {
            merchantSubscription: true,
        },
    });

    if (!store) {
        throw new Error("Store not found");
    }

    const subscription = store.merchantSubscription as any;
    const plan = store.plan as string || "FREE";

    // 1. Check Trial Expiry
    if (plan === "FREE" && subscription?.trialEndsAt) {
        if (new Date() > subscription.trialEndsAt) {
            return {
                allowed: false,
                reason: "trial_expired",
                message: "Your 7-day free trial has expired. Please upgrade to continue.",
            };
        }
    }

    // 2. Usage Limits
    if (plan === "FREE") {
        if (feature === "whatsapp_ai") {
            const messagesSent = await getWhatsAppMessageCount(storeId);
            if (messagesSent >= 100) {
                return {
                    allowed: false,
                    reason: "limit_reached",
                    message: "You've reached your free limit of 100 AI messages. Upgrade to Starter for 500.",
                };
            }
        }
        if (feature === "template_usage") {
            const storeWithCount = await prisma.store.findUnique({
                where: { id: storeId },
                include: { _count: { select: { notificationTemplates: true } } }
            }) as any;
            if ((storeWithCount?._count?.notificationTemplates || 0) >= 2) {
                return {
                    allowed: false,
                    reason: "limit_reached",
                    message: "Free plan is limited to 2 templates. Upgrade to Starter for more.",
                };
            }
        }
    }

    if (plan === "STARTER") {
        if (feature === "order_creation") {
            const ordersThisMonth = await prisma.order.count({
                where: {
                    storeId,
                    createdAt: {
                        gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
                    },
                },
            });
            if (ordersThisMonth >= 100) {
                return {
                    allowed: false,
                    reason: "limit_reached",
                    message: "You've reached your limit of 100 orders this month. Upgrade to Pro for unlimited.",
                };
            }
        }

        if (feature === "whatsapp_ai") {
            const messagesSent = await getWhatsAppMessageCount(storeId);
            if (messagesSent >= 500) {
                return {
                    allowed: false,
                    reason: "limit_reached",
                    message: "You've reached your limit of 500 AI messages this month. Upgrade to Pro for unlimited.",
                };
            }
        }

        if (feature === "template_usage") {
            const storeWithCount = await prisma.store.findUnique({
                where: { id: storeId },
                include: { _count: { select: { notificationTemplates: true } } }
            }) as any;
            if ((storeWithCount?._count?.notificationTemplates || 0) >= 5) {
                return {
                    allowed: false,
                    reason: "limit_reached",
                    message: "Starter plan is limited to 5 templates. Upgrade to Pro for unlimited.",
                };
            }
        }
    }

    // 3. Feature Gating
    if (feature === "vavya_cut_pro" && plan !== "PRO") {
        return {
            allowed: false,
            reason: "feature_locked",
            message: "Vayva Cut Pro is only available on the Pro plan.",
        };
    }

    if (plan === "FREE" || plan === "STARTER") {
        if (feature === "custom_domain" || feature === "advanced_analytics") {
            if (plan === "FREE") {
                return {
                    allowed: false,
                    reason: "feature_locked",
                    message: "This feature is only available on paid plans.",
                };
            }
            if (feature === "custom_domain" && plan === "STARTER") {
                return {
                    allowed: false,
                    reason: "feature_locked",
                    message: "Custom domains are only available on the Pro plan.",
                };
            }
        }
    }

    return { allowed: true };
}

async function getWhatsAppMessageCount(storeId: string) {
    return prisma.notification.count({
        where: {
            storeId,
            type: "WHATSAPP",
            createdAt: {
                gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
            }
        }
    });
}
