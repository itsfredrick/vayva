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
        console.log(`Processing ${QUEUES.PAYMENTS_WEBHOOKS} job ${job.id}`);
        // TODO: Process payment webhook
    }, { connection });

    new Worker(QUEUES.WHATSAPP_INBOUND, async (job) => {
        console.log(`Processing ${QUEUES.WHATSAPP_INBOUND} job ${job.id}`);
        // TODO: Process inbound whatsapp message
    }, { connection });

    new Worker(QUEUES.WHATSAPP_OUTBOUND, async (job) => {
        console.log(`Processing ${QUEUES.WHATSAPP_OUTBOUND} job ${job.id}`);
        // TODO: Send whatsapp message
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
