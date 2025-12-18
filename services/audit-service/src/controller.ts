import { FastifyRequest, FastifyReply } from 'fastify';
import { z } from 'zod';
import { prisma } from '@vayva/db';

const auditSchema = z.object({
    action: z.string(),
    resource: z.string(),
    resourceId: z.string(),
    userId: z.string().optional(),
    storeId: z.string().optional(),
    opsUserId: z.string().optional(),
    metadata: z.record(z.any()).optional(),
});

export const emitAuditHandler = async (req: FastifyRequest, reply: FastifyReply) => {
    const body = auditSchema.parse(req.body);

    const event = await prisma.auditEvent.create({
        data: {
            event: body.action,
            actorId: body.userId || body.opsUserId || 'SYSTEM',
            actorType: body.userId ? 'USER' : (body.opsUserId ? 'OPS_USER' : 'SYSTEM'),
            meta: {
                ...body.metadata,
                resource: body.resource,
                resourceId: body.resourceId
            },
            storeId: body.storeId,
            ipAddress: (req.headers['x-forwarded-for'] as string) || req.ip
        }
    });

    return reply.send(event);
};

export const listAuditEventsHandler = async (req: FastifyRequest, reply: FastifyReply) => {
    const storeId = req.headers['x-store-id'] as string;
    if (!storeId) return reply.status(400).send({ error: 'Store ID required' });

    const events = await prisma.auditEvent.findMany({
        where: { storeId },
        orderBy: { createdAt: 'desc' },
        take: 100
    });
    return reply.send(events);
};
