import { FastifyRequest, FastifyReply } from 'fastify';
import { InboundProcessor } from './processor/inbound.processor';
import { ConversationStore } from './services/conversation.store';
import { prisma } from '@vayva/db';

/**
 * Meta Webhook verification handshake
 */
export const verifyWebhook = async (req: FastifyRequest, reply: FastifyReply) => {
    const query = req.query as any;
    const mode = query['hub.mode'];
    const token = query['hub.verify_token'];
    const challenge = query['hub.challenge'];

    // In prod, this token should be in env
    const VERIFY_TOKEN = process.env.WHATSAPP_VERIFY_TOKEN || 'vayva_v1_secret';

    if (mode === 'subscribe' && token === VERIFY_TOKEN) {
        return reply.send(challenge);
    }
    return reply.status(403).send('Forbidden');
};

/**
 * Handle Inbound Messages & Status Updates
 */
export const webhookHandler = async (req: FastifyRequest, reply: FastifyReply) => {
    // 1. Signature Verification (Simplified for V1 implementation)
    // In prod, check x-hub-signature-256

    const body = req.body as any;
    if (!body.entry) return reply.send({ status: 'ignored' });

    for (const entry of body.entry) {
        for (const change of entry.changes) {
            const value = change.value;
            const metadata = value.metadata;

            // Resolve storeId by phone_number_id
            const channel = await prisma.whatsappChannel.findFirst({
                where: { phoneNumberId: metadata?.phone_number_id }
            });

            // For V1 demo fallback to a known store if channel not found
            const storeId = channel?.storeId || 'store-123';

            if (value.messages) {
                await InboundProcessor.processMessage(storeId, value);
            }
            if (value.statuses) {
                for (const status of value.statuses) {
                    await InboundProcessor.processStatus(storeId, status);
                }
            }
        }
    }

    return reply.send({ status: 'success' });
};

/**
 * Send Message from Merchant Dashboard
 */
export const sendMessage = async (req: FastifyRequest, reply: FastifyReply) => {
    const storeId = req.headers['x-store-id'] as string || 'store-123';
    const { conversationId, body, templateName } = req.body as any;

    try {
        const message = await ConversationStore.sendMessage(storeId, conversationId, { body, templateName });
        return reply.send(message);
    } catch (e: any) {
        return reply.status(500).send({ error: e.message });
    }
};

/**
 * List Threads for Inbox
 */
export const listThreads = async (req: FastifyRequest, reply: FastifyReply) => {
    const storeId = req.headers['x-store-id'] as string || 'store-123';
    const threads = await ConversationStore.listThreads(storeId);
    return reply.send(threads);
};

/**
 * Get Full Thread History
 */
export const getThread = async (req: FastifyRequest, reply: FastifyReply) => {
    const storeId = req.headers['x-store-id'] as string || 'store-123';
    const { id } = req.params as { id: string };

    const thread = await ConversationStore.getThread(storeId, id);
    if (!thread) return reply.status(404).send({ error: 'Thread not found' });

    // Auto mark as read
    await ConversationStore.markAsRead(storeId, id);

    return reply.send(thread);
};
