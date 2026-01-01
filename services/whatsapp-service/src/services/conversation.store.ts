import { prisma, Direction, MessageStatus, MessageType } from "@vayva/db";
import { MetaProvider } from "../providers/meta.provider";

const provider = new MetaProvider();

export class ConversationStore {
  static async listThreads(storeId: string) {
    return prisma.conversation.findMany({
      where: { storeId },
      include: {
        contact: true,
        messages: {
          orderBy: { createdAt: "desc" },
          take: 1,
        },
      },
      orderBy: { lastMessageAt: "desc" },
    });
  }

  static async getThread(storeId: string, conversationId: string) {
    return prisma.conversation.findFirst({
      where: { id: conversationId, storeId },
      include: {
        contact: true,
        messages: {
          orderBy: { createdAt: "asc" },
        },
      },
    });
  }

  static async sendMessage(
    storeId: string,
    conversationId: string,
    options: { body?: string; templateName?: string },
  ) {
    const conversation = await prisma.conversation.findFirst({
      where: { id: conversationId, storeId },
      include: { contact: true },
    });

    if (!conversation) throw new Error("Conversation not found");

    // 1. Create local message record
    const message = await prisma.message.create({
      data: {
        storeId,
        conversationId,
        direction: Direction.OUTBOUND,
        type: options.templateName ? MessageType.TEMPLATE : MessageType.TEXT,
        textBody: options.body || "",
        status: MessageStatus.QUEUED,
      },
    });

    // 2. Call provider (async)
    // In full prod, we'd enqueue a background job. Here we call it and update status.
    try {
      const { providerMessageId } = await provider.sendMessage({
        recipient: conversation.contact.externalId,
        type: options.templateName ? "template" : "text",
        body: options.body,
        templateName: options.templateName,
      });

      await prisma.message.update({
        where: { id: message.id },
        data: {
          providerMessageId,
          status: MessageStatus.SENT,
          sentAt: new Date(),
        },
      });

      return { ...message, providerMessageId, status: MessageStatus.SENT };
    } catch (e: any) {
      await prisma.message.update({
        where: { id: message.id },
        data: {
          status: MessageStatus.FAILED,
          errorCode: "PROVIDER_ERROR",
          errorMessage: e.message,
        },
      });
      throw e;
    }
  }

  static async markAsRead(storeId: string, conversationId: string) {
    return prisma.conversation.update({
      where: { id: conversationId, storeId },
      data: { unreadCount: 0 },
    });
  }
}
