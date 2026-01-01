import { Queue } from "bullmq";
import IORedis from "ioredis";

const REDIS_URL = process.env.REDIS_URL || "redis://localhost:6379";

const connection = new IORedis(REDIS_URL, {
    maxRetriesPerRequest: null,
});

export const paymentsQueue = new Queue("payments.webhooks", { connection });
export const deliveryQueue = new Queue("delivery.scheduler", { connection });
export const inboundWhatsappQueue = new Queue("whatsapp.inbound", { connection });
