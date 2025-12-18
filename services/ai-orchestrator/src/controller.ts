import { FastifyRequest, FastifyReply } from 'fastify';
import { prisma } from '@vayva/db';
import axios from 'axios';

export const processHandler = async (req: FastifyRequest, reply: FastifyReply) => {
    const { messageId } = req.body as { messageId: string };

    const message = await prisma.message.findUnique({
        where: { id: messageId },
        include: { conversation: { include: { contact: true } } }
    });

    if (!message || !message.conversation) return reply.status(404).send({ error: 'Message not found' });

    const text = (message.textBody || '').toLowerCase();
    let responseText = '';

    // Simple V1 Heuristics
    if (text.includes('order')) {
        responseText = "I see you're asking about an order. Let me check the status... (Simulated: Processing)";
        // TODO: Call orders-service to list latest order
    } else if (text.includes('discount')) {
        // Create Approval
        const approval = await prisma.approval.create({
            data: {
                merchantId: message.conversation.merchantId,
                // storeId is mapped in DB but let's use the field name
                // requesterId: message.conversation.customerPhone, // Store in data if needed
                type: 'DISCOUNT_APPLICATION',
                data: { discount: '10%', requesterId: message.conversation.contact.phoneE164 },
                status: 'PENDING'
            }
        });
        responseText = `I've requested a 10% discount for you. Waiting for manager approval. (Approval ID: ${approval.id})`;
    } else {
        responseText = `Echo: ${message.textBody} - (AI Logic Placeholder)`;
    }

    // Send Reply
    await axios.post('http://localhost:3005/v1/whatsapp/send', {
        conversationId: message.conversationId,
        content: responseText
    }).catch(err => console.error("Failed to send reply", err.message));

    return reply.send({ status: 'processed', action: responseText });
};
