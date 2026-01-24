import { FastifyRequest, FastifyReply } from "fastify";
import { prisma, Prisma } from "@vayva/db";
import { NotificationService } from "../services/notification-engine";

interface SendNotificationBody {
  storeId: string;
  channel?: string;
  to: string;
  templateKey: string;
  variables: Record<string, unknown>;
  customerId?: string;
  orderId?: string;
}

export const NotificationController = {
  send: async (
    req: FastifyRequest<{ Body: SendNotificationBody }>,
    reply: FastifyReply,
  ) => {
    const result = await NotificationService.send(req.body);
    return reply.send(result);
  },

  getTemplates: async (
    req: FastifyRequest<{ Querystring: { storeId: string } }>,
    _reply: FastifyReply,
  ) => {
    const { storeId } = req.query;
    const templates = await prisma.notificationTemplate.findMany({
      where: { storeId },
    });
    return templates;
  },

  updateTemplate: async (
    req: FastifyRequest<{ Params: { id: string }; Body: Record<string, unknown> }>,
    _reply: FastifyReply,
  ) => {
    const { id } = req.params;
    const template = await prisma.notificationTemplate.update({
      where: { id },
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      data: req.body as any,
    });
    return template;
  },
};
