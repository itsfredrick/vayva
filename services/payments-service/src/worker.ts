import { Worker } from "bullmq";
import { processPaystackEvent } from "./jobs/paystack-processor";

const QUEUE_NAME = "payments.webhooks";

const redisConfig = {
    host: process.env.REDIS_HOST || "localhost",
    port: parseInt(process.env.REDIS_PORT || "6379"),
    password: process.env.REDIS_PASSWORD,
};

export const startWorker = () => {
    const worker = new Worker(
        QUEUE_NAME,
        async (job) => {
            try {
                if (job.data.provider === "PAYSTACK") {
                    await processPaystackEvent(job);
                } else if (job.name === "paystack.event") {
                    // Fallback if data structure varies
                    await processPaystackEvent(job);
                } else {
                    console.warn(`[WORKER] Unknown job type: ${job.name} / provider: ${job.data.provider}`);
                }
            } catch (err) {
                console.error(`[WORKER] Job failed ${job.id}:`, err);
                throw err;
            }
        },
        {
            connection: redisConfig,
            concurrency: 5,
        }
    );

    worker.on("completed", (_job) => {
    });

    worker.on("failed", (job, err) => {
        console.error(`[WORKER] Job ${job?.id} failed: ${err.message}`);
    });

    return worker;
};
