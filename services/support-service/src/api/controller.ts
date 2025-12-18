
import { FastifyRequest, FastifyReply } from 'fastify';
import { prisma } from '@vayva/db';

interface CreateTicketBody {
    storeId: string;
    customerId?: string;
    subject: string;
    description?: string;
    priority?: string;
    category?: string;
    orderId?: string;
    conversationId?: string;
}

interface UpdateTicketBody {
    status?: string;
    priority?: string;
    assignedTo?: string;
}

interface AddMessageBody {
    body: string;
    channel?: string; // INTERNAL, OUTBOUND
    direction?: string;
    attachments?: any;
    userId?: string;
}

export const SupportController = {
    createTicket: async (req: FastifyRequest<{ Body: CreateTicketBody }>, reply: FastifyReply) => {
        const { storeId, customerId, subject, description, priority, category, orderId, conversationId } = req.body;

        const ticket = await prisma.supportTicket.create({
            data: {
                storeId,
                customerId,
                subject,
                description,
                priority: (priority || 'MEDIUM') as any,
                category,
                orderId,
                conversationId,
                status: 'OPEN',
                messages: {
                    create: description ? [{
                        storeId,
                        body: description,
                        direction: 'INBOUND', // Assuming created from inquiry
                        channel: 'INTERNAL'
                    } as any] : []
                }
            }
        });

        return reply.status(201).send(ticket);
    },

    getTickets: async (req: FastifyRequest<{ Querystring: { storeId: string, status?: string, assignedTo?: string } }>, reply: FastifyReply) => {
        const { storeId, status, assignedTo } = req.query;
        const tickets = await prisma.supportTicket.findMany({
            where: {
                storeId,
                status: (status as any) || undefined,
                assignedTo: assignedTo || undefined
            },
            include: {
                customer: true,
                order: true
            },
            orderBy: { updatedAt: 'desc' }
        });
        return tickets;
    },

    getTicket: async (req: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) => {
        const { id } = req.params;
        const ticket = await prisma.supportTicket.findUnique({
            where: { id },
            include: {
                messages: { orderBy: { createdAt: 'asc' } },
                customer: true,
                order: { include: { items: true } },
                conversation: true
            }
        });
        if (!ticket) return reply.status(404).send({ error: "Ticket not found" });
        return ticket;
    },

    updateTicket: async (req: FastifyRequest<{ Params: { id: string }, Body: UpdateTicketBody }>, reply: FastifyReply) => {
        const { id } = req.params;
        const ticket = await prisma.supportTicket.update({
            where: { id },
            data: req.body as any
        });
        return ticket;
    },

    addMessage: async (req: FastifyRequest<{ Params: { id: string }, Body: AddMessageBody }>, reply: FastifyReply) => {
        const { id } = req.params;
        const { body, channel, direction, attachments, userId } = req.body;

        const ticket = await prisma.supportTicket.findUnique({ where: { id } });
        if (!ticket) return reply.status(404).send({ error: "Ticket not found" });

        const message = await prisma.ticketMessage.create({
            data: {
                storeId: ticket.storeId,
                ticketId: id,
                body,
                channel: (channel || 'INTERNAL') as any,
                direction: (direction || 'INTERNAL') as any,
                attachments,
                createdBy: userId
            }
        });

        // Auto-update ticket timestamp
        await prisma.supportTicket.update({
            where: { id },
            data: { updatedAt: new Date() }
        });

        return reply.status(201).send(message);
    }
};
