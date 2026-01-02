import { Queue, QueueOptions } from "bullmq";
import { getRedis, isBuildTime } from "@vayva/shared/redis";

/**
 * LAZY QUEUE FACTORY
 * Prevents BullMQ from connecting during Next.js build.
 */
function createQueue(name: string, options: Partial<QueueOptions> = {}) {
    // If we are in build time, return a minimal stub/proxy to prevent BullMQ internal connection logic
    if (isBuildTime()) {
        return {
            name,
            add: async () => { console.warn(`Skipping adding to queue ${name} during build`); return null; },
            close: async () => { },
        } as unknown as Queue;
    }

    const connection = getRedis();
    return new Queue(name, {
        ...options,
        connection,
        defaultJobOptions: {
            removeOnComplete: true,
            removeOnFail: 1000,
            ...options.defaultJobOptions,
        }
    });
}

// Lazy instances
let _paymentsQueue: Queue | null = null;
let _deliveryQueue: Queue | null = null;
let _inboundWhatsappQueue: Queue | null = null;

export const getPaymentsQueue = () => {
    if (!_paymentsQueue) _paymentsQueue = createQueue("payments.webhooks");
    return _paymentsQueue;
};

export const getDeliveryQueue = () => {
    if (!_deliveryQueue) _deliveryQueue = createQueue("delivery.scheduler");
    return _deliveryQueue;
};

export const getInboundWhatsappQueue = () => {
    if (!_inboundWhatsappQueue) _inboundWhatsappQueue = createQueue("whatsapp.inbound");
    return _inboundWhatsappQueue;
};

// Note: Do not export constants that execute the getters here, 
// as they would be evaluated at module load time.
// Consuming code should use getPaymentsQueue(), etc.


