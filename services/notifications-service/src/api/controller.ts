
import { FastifyRequest, FastifyReply } from 'fastify';
import { prisma } from '@vayva/db';
import { NotificationService } from '../services/notification-engine';

interface SendNotificationBody {
    storeId: string;
    channel?: string;
    to: string;
    templateKey: string;
    variables: Record<string, any>;
    customerId?: string;
    orderId?: string;
}

export const NotificationController = {
    send: async (req: FastifyRequest<{ Body: SendNotificationBody }>, reply: FastifyReply) => {
        const result = await NotificationService.send(req.body);
        return reply.send(result);
    },

    getTemplates: async (req: FastifyRequest<{ Querystring: { storeId: string } }>, reply: FastifyReply) => {
        const { storeId } = req.query;
        const templates = await prisma.notificationTemplate.findMany({
            where: { storeId }
        });
        return templates;
    },

    updateTemplate: async (req: FastifyRequest<{ Params: { id: string }, Body: any }>, reply: FastifyReply) => {
        const { id } = req.params;
        const template = await prisma.notificationTemplate.update({
            where: { id },
            data: req.body as any
        });
        return template;
    }
};
