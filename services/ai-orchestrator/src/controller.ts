import { FastifyRequest, FastifyReply } from "fastify";
import { prisma } from "@vayva/db";
import axios from "axios";

export const processHandler = async (
  req: FastifyRequest,
  reply: FastifyReply,
) => {
  const { messageId } = req.body as { messageId: string };

  const message = await prisma.message.findUnique({
    where: { id: messageId },
    include: { Conversation: { include: { contact: true } } },
  });

  if (!message || !message.Conversation)
    return reply.status(404).send({ error: "Message not found" });

  const text = (message.textBody || "").toLowerCase();
  let responseText = "";

  // Simple V1 Heuristics
  if (text.includes("order")) {
    responseText =
      "I see you're asking about an order. Let me check the status... (Simulated: Processing)";
    // TODO: Call orders-service to list latest order
  } else if (text.includes("discount")) {
    // Create Approval
    const approval = await prisma.approval.create({
      data: {
        storeId: message.Conversation.storeId,
        merchantId: message.Conversation.storeId, // Required field in schema
        type: "DISCOUNT_APPLICATION",
        data: {
          discount: "10%",
          requesterId: message.Conversation.contact.phoneE164,
        },
        status: "PENDING",
      },
    });
    responseText = `I've requested a 10% discount for you. Waiting for manager approval. (Approval ID: ${approval.id})`;
  } else {
    responseText = `Echo: ${message.textBody} - (AI Logic Placeholder)`;
  }

  // Send Reply
  const whatsappUrl = process.env.SERVICE_URL_WHATSAPP || "http://localhost:3005";
  await axios
    .post(`${whatsappUrl}/v1/whatsapp/send`, {
      conversationId: message.conversationId,
      content: responseText,
    })
    .catch((err) => console.error("Failed to send reply", err.message));


  return reply.send({ status: "processed", action: responseText });
};
