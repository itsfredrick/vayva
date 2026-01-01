import { prisma, Direction, MessageStatus, MessageType } from "@vayva/db";

export class InboundProcessor {
  static async processMessage(storeId: string, payload: any) {
    const contactData = payload.contacts?.[0];
    const messageData = payload.messages?.[0];

    if (!contactData || !messageData) return;

    const waId = contactData.wa_id;
    const displayName = contactData.profile?.name;

    // 0. Idempotency Check
    const existingMessage = await prisma.message.findFirst({
      where: {
        providerMessageId: messageData.id,
        storeId: storeId,
      },
    });

    if (existingMessage) return existingMessage;

    // 1. Resolve Contact
    let contact = await prisma.contact.findUnique({
      where: {
        storeId_channel_externalId: {
          storeId: storeId,
          channel: "WHATSAPP",
          externalId: waId,
        },
      },
    });

    if (!contact) {
      contact = await prisma.contact.create({
        data: {
          storeId: storeId,
          channel: "WHATSAPP",
          externalId: waId,
          displayName,
          phoneE164: waId, // Usually wa_id is phone without +
        },
      });
    }

    // 2. Resolve Conversation
    let conversation = await prisma.conversation.findUnique({
      where: {
        storeId_contactId: {
          storeId: storeId,
          contactId: contact.id,
        },
      },
    });

    if (!conversation) {
      conversation = await prisma.conversation.create({
        data: {
          storeId: storeId,
          contactId: contact.id,
          status: "OPEN",
        },
      });
    }

    // 3. Append Message
    const message = await prisma.message.create({
      data: {
        storeId: storeId,
        conversationId: conversation.id,
        direction: Direction.INBOUND,
        type: (messageData.type?.toUpperCase() as any) || MessageType.TEXT,
        providerMessageId: messageData.id,
        textBody: messageData.text?.body || "",
        status: MessageStatus.DELIVERED,
        receivedAt: new Date(),
      },
    });

    // 4. Update Conversation lastMessageAt and unreadCount
    await prisma.conversation.update({
      where: { id: conversation.id },
      data: {
        lastMessageAt: new Date(),
        unreadCount: { increment: 1 },
      },
    });

    return message;
  }

  static async processStatus(storeId: string, status: any) {
    if (!status.id || !status.status) return;

    await prisma.message.updateMany({
      where: {
        storeId: storeId,
        providerMessageId: status.id,
      },
      data: {
        status: (status.status.toUpperCase() as any) || MessageStatus.SENT,
      },
    });
  }
}
