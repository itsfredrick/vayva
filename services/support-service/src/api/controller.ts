import { FastifyRequest, FastifyReply } from "fastify";
import { prisma } from "@vayva/db";

interface CreateTicketBody {
  storeId: string;
  userId: string;
  subject: string;
  description: string;
  priority?: string;
  type?: string;
}

interface AddMessageBody {
  message: string;
  sender?: string;
  senderId?: string;
  attachments?: any;
}

export const SupportController = {
  createTicket: async (
    req: FastifyRequest<{ Body: CreateTicketBody }>,
    reply: FastifyReply,
  ) => {
    const { storeId, userId, subject, description, priority, type } = req.body;

    const ticket = await prisma.supportTicket.create({
      data: {
        storeId,
        subject,
        description,
        priority: (priority || "medium") as any,
        type: type || "general",
        status: "open",
        ticketMessages: {
          create: description
            ? [
                {
                  storeId, // Assuming ticketMessage has storeId
                  message: description,
                  sender: "merchant",
                  senderId: userId,
                } as any,
              ]
            : [],
        },
      },
      include: { ticketMessages: true },
    });

    return reply.status(201).send(ticket);
  },

  getTickets: async (
    req: FastifyRequest<{ Querystring: { storeId: string; status?: string } }>,
    reply: FastifyReply,
  ) => {
    const { storeId, status } = req.query;
    const tickets = await prisma.supportTicket.findMany({
      where: {
        storeId,
        status: (status as any) || undefined,
      },
      include: {
        Customer: true,
        Order: true,
      },
      orderBy: { updatedAt: "desc" },
    });
    return tickets;
  },

  getTicket: async (
    req: FastifyRequest<{ Params: { id: string } }>,
    reply: FastifyReply,
  ) => {
    const { id } = req.params;
    const ticket = await prisma.supportTicket.findUnique({
      where: { id },
      include: {
        ticketMessages: { orderBy: { createdAt: "asc" } },
        Customer: true,
        Order: true,
      },
    });
    if (!ticket) return reply.status(404).send({ error: "Ticket not found" });
    return ticket;
  },

  updateTicket: async (
    req: FastifyRequest<{ Params: { id: string }; Body: any }>,
    reply: FastifyReply,
  ) => {
    const { id } = req.params;
    const updates = req.body as any;
    const ticket = await prisma.supportTicket.update({
      where: { id },
      data: updates,
    });
    return ticket;
  },

  addMessage: async (
    req: FastifyRequest<{ Params: { id: string }; Body: AddMessageBody }>,
    reply: FastifyReply,
  ) => {
    const { id } = req.params;
    const { message, sender, senderId, attachments } = req.body;

    const ticket = await prisma.supportTicket.findUnique({ where: { id } });
    if (!ticket) return reply.status(404).send({ error: "Ticket not found" });

    const ticketMessage = await prisma.ticketMessage.create({
      data: {
        storeId: ticket.storeId,
        ticketId: id,
        message,
        sender: (sender || "merchant") as any,
        senderId,
        attachments: attachments || [],
      },
    });

    // Auto-update ticket timestamp
    await prisma.supportTicket.update({
      where: { id },
      data: { updatedAt: new Date() },
      include: { ticketMessages: true },
    });

    return reply.status(201).send(ticketMessage);
  },
};
