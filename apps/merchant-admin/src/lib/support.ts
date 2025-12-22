
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
        return prisma.supportTicketV2.create({
            data: {
                store: { connect: { id: data.storeId } },
                createdByUserId: data.userId,
                type: data.type,
                subject: data.subject,
                description: data.description,
                priority: data.priority || 'normal',
                correlationId: data.correlationId || null,
                messages: {
                    create: {
                        senderType: 'merchant_user',
                        senderId: data.userId,
                        message: data.description
                    }
                }
            },
            include: { messages: true }
        });
    }

    static async addMessage(ticketId: string, senderType: 'merchant_user' | 'platform_admin' | 'system', senderId: string, message: string) {
        const msg = await prisma.supportMessage.create({
            data: {
                ticket: { connect: { id: ticketId } },
                senderType,
                senderId,
                message
            }
        });

        // Update ticket updated_at
        await prisma.supportTicketV2.update({
            where: { id: ticketId },
            data: {
                updatedAt: new Date(),
                status: senderType === 'merchant_user' ? 'open' : undefined
            }
        });

        return msg;
    }

    static async getMerchantTickets(storeId: string) {
        return prisma.supportTicketV2.findMany({
            where: { storeId },
            orderBy: { updatedAt: 'desc' },
            include: {
                _count: { select: { messages: true } }
            }
        });
    }

    static async getTicketDetails(ticketId: string, storeId: string) {
        const ticket = await prisma.supportTicketV2.findUnique({
            where: { id: ticketId },
            include: { messages: { orderBy: { createdAt: 'asc' } } }
        });

        if (!ticket || ticket.storeId !== storeId) {
            throw new Error('Not found or access denied');
        }

        return ticket;
    }
}
