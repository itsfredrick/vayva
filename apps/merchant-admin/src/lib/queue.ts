import { Queue, QueueOptions } from "bullmq";
import { getRedis, isBuildTime } from "@vayva/redis";

/**
 * LAZY QUEUE FACTORY
 * Prevents BullMQ from connecting during Next.js build.
 */
function createQueue(name: string, options: Partial<QueueOptions> = {}) {
    // If we are in build time, return a minimal stub/proxy to prevent BullMQ internal connection logic
    // This is intentional to separate build/runtime environments and prevent hangs.
    // Build-time Stub: Prevents redis connection hangs
    if (isBuildTime()) {
        console.warn(`[Queue:Stub] Returning build-time proxy for ${name}`);
        return new Proxy({}, {
            get: (_target, prop) => {
                if (prop === "add") return async () => { return null; };
                if (prop === "close" || prop === "on" || prop === "obliterate") return async () => { };
                return undefined;
            }
        }) as unknown as Queue;
    }

    const connection = getRedis();
    return new Queue(name, {
        ...options,
        connection: connection as unknown,
        defaultJobOptions: {
            removeOnComplete: true,
            removeOnFail: 1000,
            attempts: 3, // Retry failed jobs up to 3 times
            backoff: {
                type: "exponential",
                delay: 1000, // Wait 1s, 2s, 4s...
            },
            ...options.defaultJobOptions,
        }
    });
}

import { QUEUES } from "@vayva/shared/queues";

// Lazy instances
let _paymentsQueue: Queue | null = null;
let _deliveryQueue: Queue | null = null;
let _inboundWhatsappQueue: Queue | null = null;
let _manifestSyncQueue: Queue | null = null;

export const getPaymentsQueue = () => {
    if (!_paymentsQueue) _paymentsQueue = createQueue(QUEUES.PAYMENTS_WEBHOOKS);
    return _paymentsQueue;
};

export const getManifestSyncQueue = () => {
    if (!_manifestSyncQueue) _manifestSyncQueue = createQueue(QUEUES.MANIFEST_SYNC);
    return _manifestSyncQueue;
};

export const getDeliveryQueue = () => {
    if (!_deliveryQueue) _deliveryQueue = createQueue(QUEUES.DELIVERY_SCHEDULER);
    return _deliveryQueue;
};

export const getInboundWhatsappQueue = () => {
    if (!_inboundWhatsappQueue) _inboundWhatsappQueue = createQueue(QUEUES.WHATSAPP_INBOUND);
    return _inboundWhatsappQueue;
};

let _exportsQueue: Queue | null = null;
export const getExportsQueue = () => {
    if (!_exportsQueue) _exportsQueue = createQueue((QUEUES as unknown).EXPORTS_JOBS || "exports.jobs");
    return _exportsQueue;
};

// Note: Do not export constants that execute the getters here, 
// as they would be evaluated at module load time.
// Consuming code should use getPaymentsQueue(), etc.


