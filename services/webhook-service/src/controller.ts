
import { prisma } from '@vayva/db';
import * as crypto from 'crypto';
import axios from 'axios';

export const WebhookController = {
    // --- API Keys ---
    createApiKey: async (storeId: string, name: string, scopes: string[]) => {
        const rawKey = `vayva_${crypto.randomBytes(32).toString('hex')}`;
        const keyHash = crypto.createHash('sha256').update(rawKey).digest('hex');

        const apiKey = await prisma.apiKey.create({
            data: {
                storeId,
                name,
                keyHash,
                // prefix: rawKey.substring(0, 8), // Not in schema
                scopes,
                status: 'ACTIVE'
            }
        });

        return { ...apiKey, rawKey }; // Return raw key ONCE
    },

    listApiKeys: async (storeId: string) => {
        return await prisma.apiKey.findMany({
            where: { storeId },
            orderBy: { createdAt: 'desc' }
        });
    },

    revokeApiKey: async (keyId: string) => {
        return await prisma.apiKey.update({
            where: { id: keyId },
            data: { status: 'REVOKED', revokedAt: new Date() }
        });
    },

    // --- Webhook Endpoints ---
    createWebhookEndpoint: async (storeId: string, url: string, events: string[]) => {
        const secret = crypto.randomBytes(32).toString('hex');
        const secretEnc = Buffer.from(secret).toString('base64'); // Simple encoding

        const endpoint = await prisma.webhookEndpoint.create({
            data: {
                storeId,
                url,
                secretEnc,
                subscribedEvents: events,
                status: 'ACTIVE'
            }
        });

        return { ...endpoint, secret }; // Return secret ONCE
    },

    listWebhookEndpoints: async (storeId: string) => {
        return await prisma.webhookEndpoint.findMany({
            where: { storeId },
            orderBy: { createdAt: 'desc' }
        });
    },

    // --- Event Publishing ---
    publishEvent: async (storeId: string, type: string, payload: any) => {
        const event = await prisma.webhookEventV2.create({
            data: { storeId, type, payload }
        });

        // Find matching endpoints manually since filtered relation queries are complex or unsupported here
        const endpoints = await prisma.webhookEndpoint.findMany({
            where: {
                storeId,
                status: 'ACTIVE',
                subscribedEvents: { has: type }
            }
        });

        // Create deliveries
        for (const endpoint of endpoints) {
            await prisma.webhookDelivery.create({
                data: {
                    storeId,
                    endpointId: endpoint.id,
                    eventId: event.id,
                    eventType: type,
                    status: 'PENDING',
                    nextRetryAt: new Date()
                }
            });
        }

        return event;
    },

    // --- Delivery Worker ---
    deliverWebhook: async (deliveryId: string) => {
        const delivery = await prisma.webhookDelivery.findUnique({
            where: { id: deliveryId }
            // include: { endpoint: true, event: true } // Relations NOT defined in schema
        });

        if (!delivery) return;

        // Manual fetch of relations
        const endpoint = await prisma.webhookEndpoint.findUnique({ where: { id: delivery.endpointId } });
        const event = await prisma.webhookEventV2.findUnique({ where: { id: delivery.eventId } });

        if (!endpoint || !event) {
            await prisma.webhookDelivery.update({
                where: { id: deliveryId },
                data: { status: 'FAILED', responseBodySnippet: 'Endpoint or Event not found' }
            });
            return;
        }

        const secret = Buffer.from(endpoint.secretEnc, 'base64').toString();

        // Sign payload
        const timestamp = Date.now();
        const payloadStr = JSON.stringify(event.payload);
        const signature = crypto
            .createHmac('sha256', secret)
            .update(`${timestamp}.${payloadStr}`)
            .digest('hex');

        try {
            const response = await axios.post(endpoint.url, event.payload, {
                headers: {
                    'Content-Type': 'application/json',
                    'X-Vayva-Signature': signature,
                    'X-Vayva-Timestamp': timestamp.toString(),
                    'X-Vayva-Event-Type': event.type
                },
                timeout: 10000
            });

            await prisma.webhookDelivery.update({
                where: { id: deliveryId },
                data: {
                    status: 'DELIVERED',
                    responseCode: response.status,
                    deliveredAt: new Date()
                }
            });
        } catch (error: any) {
            const maxAttempts = 10;
            const nextAttempt = delivery.attempt + 1;
            const isDeadLetter = nextAttempt > maxAttempts;

            // Exponential backoff
            const backoffMinutes = Math.min(Math.pow(2, nextAttempt), 60);
            const nextRetryAt = new Date(Date.now() + backoffMinutes * 60 * 1000);

            await prisma.webhookDelivery.update({
                where: { id: deliveryId },
                data: {
                    status: isDeadLetter ? 'DEAD' : 'FAILED',
                    attempt: nextAttempt,
                    responseCode: error.response?.status,
                    responseBodySnippet: error.message?.substring(0, 500),
                    nextRetryAt: isDeadLetter ? null : nextRetryAt
                }
            });
        }
    },

    // --- Logs & Replay ---
    listDeliveries: async (storeId: string, endpointId?: string) => {
        return await prisma.webhookDelivery.findMany({
            where: {
                storeId,
                ...(endpointId && { endpointId })
            },
            // include: { event: true }, // Removed due to missing relation
            orderBy: { createdAt: 'desc' },
            take: 100
        });
    },

    replayDelivery: async (deliveryId: string) => {
        const delivery = await prisma.webhookDelivery.findUnique({
            where: { id: deliveryId }
        });

        if (!delivery) throw new Error('Delivery not found');

        // Reset delivery for retry
        await prisma.webhookDelivery.update({
            where: { id: deliveryId },
            data: {
                status: 'PENDING',
                attempt: 1,
                nextRetryAt: new Date()
            }
        });

        // Trigger delivery
        await WebhookController.deliverWebhook(deliveryId);
    }
};
