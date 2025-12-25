
import { prisma } from '@vayva/db';
import { EmailService } from '@/lib/email/emailService';

export interface CreateTicketDTO {
    storeId: string;
    userId: string;
    type: string;
    subject: string;
    description: string;
    correlationId?: string;
    priority?: string;
}

export class SupportService {

    static async createTicket(data: CreateTicketDTO) {
        return prisma.supportTicket.create({
            data: {
                store: { connect: { id: data.storeId } },
                type: data.type,
                subject: data.subject,
                description: data.description,
                priority: data.priority || 'normal',
                ticketMessages: {
                    create: {
                        sender: 'merchant',
                        senderId: data.userId,
                        message: data.description
                    }
                }
            },
            include: { ticketMessages: true }
        });
    }

    static async addMessage(ticketId: string, sender: string, senderId: string, message: string) {
        const msg = await prisma.ticketMessage.create({
            data: {
                supportTicket: { connect: { id: ticketId } },
                sender,
                senderId,
                message
            }
        });

        // Update ticket updated_at
        await prisma.supportTicket.update({
            where: { id: ticketId },
            data: {
                updatedAt: new Date(),
                status: sender === 'merchant' ? 'open' : undefined
            }
        });

        return msg;
    }

    static async getMerchantTickets(storeId: string) {
        return prisma.supportTicket.findMany({
            where: { storeId },
            orderBy: { updatedAt: 'desc' },
            include: {
                _count: { select: { ticketMessages: true } }
            }
        });
    }

    static async getTicketDetails(ticketId: string, storeId: string) {
        const ticket = await prisma.supportTicket.findUnique({
            where: { id: ticketId },
            include: { ticketMessages: { orderBy: { createdAt: 'asc' } } }
        });

        if (!ticket || ticket.storeId !== storeId) {
            throw new Error('Not found or access denied');
        }

        return ticket;
    }
}
