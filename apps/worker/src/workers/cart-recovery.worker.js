import { Worker } from "bullmq";
import { prisma } from "@vayva/db";
import { QUEUES } from "@vayva/shared";
// import { sendWhatsAppTemplate } from "@vayva/shared/src/notifications/whatsapp";
import { logger } from "../lib/logger";
const ABANDONED_THRESHOLD_HOURS = 1;
const NOTIFICATION_WINDOW_HOURS = 24;
export const cartRecoveryWorker = new Worker(QUEUES.CART_RECOVERY_SCHEDULER, async (job) => {
    logger.info("Running Cart Recovery Job", { jobId: job.id });
    try {
        const thresholdTime = new Date();
        thresholdTime.setHours(thresholdTime.getHours() - ABANDONED_THRESHOLD_HOURS);
        const staleCarts = await prisma.cart.findMany({
            where: {
                updatedAt: { lt: thresholdTime },
                createdAt: { gt: new Date(Date.now() - NOTIFICATION_WINDOW_HOURS * 3600 * 1000) }, // Don't spam really old carts
                recoveryStatus: "NONE",
                OR: [
                    { email: { not: null } },
                    { phone: { not: null } }
                ],
                items: { some: {} } // Only carts with items
            },
            include: {
                items: true
            },
            take: 50 // Process in batches
        });
        if (staleCarts.length === 0) {
            logger.info("No abandoned carts found");
            return;
        }
        logger.info(`Found ${staleCarts.length} stale carts`);
        for (const cart of staleCarts) {
            // Check for automation rule (Optional: could enforce global rule here)
            const storeId = "GLOBAL"; // Or resolve from cart if we had store context. Assuming single-tenant or store-aware later.
            // For now, Vayva Platform logic:
            if (cart.phone) {
                /*
                await sendWhatsAppTemplate({
                    to: cart.phone,
                    template: "cart_recovery_generic",
                    vars: {
                        checkout_link: cart.checkoutUrl || `https://vayva.shop/checkout/${cart.id}`
                    }
                });
                */
                logger.info(`Recovery WhatsApp simulated for ${cart.phone}`);
                await prisma.cart.update({
                    where: { id: cart.id },
                    data: { recoveryStatus: "SENT" }
                });
                logger.info(`Recovery sent to ${cart.phone}`);
            }
        }
    }
    catch (error) {
        logger.error("Cart Recovery Failed", error);
        throw error;
    }
}, {
    connection: {
        host: process.env.REDIS_HOST,
        port: Number(process.env.REDIS_PORT),
        password: process.env.REDIS_PASSWORD
    }
});
