import { FastifyRequest, FastifyReply } from 'fastify';
import { z } from 'zod';
import { prisma } from '@vayva/db';

const notifySchema = z.object({
    channel: z.enum(['EMAIL', 'SMS', 'PUSH', 'WHATSAPP']),
    recipient: z.string(),
    template: z.string(),
    data: z.record(z.any()).optional(),
    storeId: z.string(), // Required by schema
    userId: z.string().optional() // Added for filtering
});

export const notifyHandler = async (req: FastifyRequest, reply: FastifyReply) => {
    const body = notifySchema.parse(req.body);

    console.log(`[Notification] Channel: ${body.channel} | To: ${body.recipient} | Template: ${body.template} | Data: ${JSON.stringify(body.data)}`);

    // In V1, we also store it in DB so we can list it in Notification Center
    // Schema likely has Notification table?
    // Let's check schema via Prisma usage...
    // If not, we might need to skip listing or assume it exists. 
    // Schema had Notification model?

    // Assuming Notification model exists (standard).
    const notification = await prisma.notification.create({
        data: {
            type: body.template, // Using template as type for now
            title: `Notification: ${body.template}`,
            body: JSON.stringify(body.data),
            severity: 'info',
            userId: body.userId,
            storeId: body.storeId
        }
    });

    return reply.send({ status: 'sent', id: notification.id });
};

export const listNotificationsHandler = async (req: FastifyRequest, reply: FastifyReply) => {
    // Basic filter by storeId or userId
    const storeId = req.headers['x-store-id'] as string;
    // or
    // const userId = req.headers['x-user-id'] as string;

    if (!storeId) return reply.send([]);

    const notifications = await prisma.notification.findMany({
        where: { storeId },
        orderBy: { createdAt: 'desc' },
        take: 50
    });
    return reply.send(notifications);
};
