import { Worker } from 'bullmq';
import * as dotenv from 'dotenv';
import { prisma } from '@vayva/db';
import IORedis from 'ioredis';

dotenv.config();

const connection = new IORedis(process.env.REDIS_URL || 'redis://localhost:6379', {
    maxRetriesPerRequest: null
});

// Queue names
const QUEUES = {
    PAYMENTS_WEBHOOKS: 'payments.webhooks',
    WHATSAPP_INBOUND: 'whatsapp.inbound',
    WHATSAPP_OUTBOUND: 'whatsapp.outbound',
    AGENT_ACTIONS: 'agent.actions',
    DELIVERY_SCHEDULER: 'delivery.scheduler'
};

async function start() {
    console.log('Starting workers...');

    new Worker(QUEUES.PAYMENTS_WEBHOOKS, async (job) => {
        const { provider, eventId, type, data } = job.data;
        console.log(`Processing ${QUEUES.PAYMENTS_WEBHOOKS} job ${job.id}: ${type}`);

        // 1. Spike Detection (integration health)
        // Rule: If > 5 failures in last 15 mins for this provider/store, trigger spike notification.
        const fifteenMinsAgo = new Date(Date.now() - 15 * 60 * 1000);
        const failureCount = await prisma.paymentWebhookEvent.count({
            where: {
                status: 'FAILED',
                receivedAt: { gte: fifteenMinsAgo }
            }
        });

        if (failureCount > 5) {
            // Trigger Spike Notification
            try {
                const { NotificationManager } = require('@vayva/shared');
                // For spike, we might use a system store or global alert, but here we assume we can attribute it
                // Since storeId might be null in WebhookEvent, we use a placeholder or find the latest store
                await NotificationManager.trigger('GLOBAL_SYSTEM', 'WEBHOOK_FAILURE_SPIKE', {
                    provider,
                    count: failureCount
                });
            } catch (err) {
                console.error('[Worker] Failed to trigger spike notification:', err);
            }
        }
    }, { connection });

    new Worker(QUEUES.WHATSAPP_INBOUND, async (job) => {
        console.log(`Processing ${QUEUES.WHATSAPP_INBOUND} job ${job.id}`);
        // TODO: Process inbound whatsapp message
    }, { connection });

    new Worker(QUEUES.WHATSAPP_OUTBOUND, async (job) => {
        const { to, body } = job.data;
        console.log(`[WHATSAPP_OUTBOUND] [STUB] Sending to ${to}: ${body}`);

        // Simulate success and log
        await (prisma as any).notificationLog.create({
            data: {
                storeId: job.data.storeId || 'SYSTEM',
                type: job.data.type || 'RAW_MESSAGE',
                channel: 'WHATSAPP',
                status: 'SENT',
                metadata: { providerRef: `stub_${Date.now()}` }
            }
        });
    }, { connection });

    new Worker(QUEUES.AGENT_ACTIONS, async (job) => {
        console.log(`Processing ${QUEUES.AGENT_ACTIONS} job ${job.id}`);
        // TODO: Execute agent action
    }, { connection });

    new Worker(QUEUES.DELIVERY_SCHEDULER, async (job) => {
        console.log(`Processing ${QUEUES.DELIVERY_SCHEDULER} job ${job.id}`);
        // TODO: Schedule delivery task
    }, { connection });

    console.log('Workers started');
}

start().catch(console.error);
