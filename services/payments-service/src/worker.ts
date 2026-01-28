import { Worker } from "bullmq";
import { processPaystackEvent } from "./jobs/paystack-processor";
import { env } from "./env";

const QUEUE_NAME = "payments.webhooks";

const redisConfig = (() => {
    if (env.REDIS_HOST && env.REDIS_PORT) {
        return {
            host: env.REDIS_HOST,
            port: env.REDIS_PORT,
            password: env.REDIS_PASSWORD,
        };
    }

    const url = new URL(env.REDIS_URL);
    const password = url.password || undefined;
    const port = url.port ? parseInt(url.port, 10) : 6379;
    return {
        host: url.hostname,
        port,
        password,
    };
})();

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
