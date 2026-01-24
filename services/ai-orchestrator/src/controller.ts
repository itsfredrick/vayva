import { FastifyRequest, FastifyReply } from "fastify";
import { prisma } from "@vayva/db";
import axios from "axios";

export const processHandler = async (
  req: FastifyRequest,
  reply: FastifyReply,
): Promise<unknown> => {
  const { messageId } = req.body as { messageId: string };

  const message = await prisma.message.findUnique({
    where: { id: messageId },
    include: { conversation: { include: { contact: true } } },
  });

  if (!message || !message.conversation)
    return reply.status(404).send({ error: "Message not found" });

  const text = (message.textBody || "").toLowerCase();
  let responseText = "";

  // Simple V1 Heuristics
  if (text.includes("order") || text.includes("track") || text.includes("where is my")) {
    responseText = "I'm checking your latest order status...";
    try {
      const ordersUrl = process.env.SERVICE_URL_ORDERS || "http://localhost:3003";
      const { data: orders } = await axios.get(`${ordersUrl}/v1/orders`, {
        params: {
          phone: message.conversation.contact.phoneE164,
          storeId: message.conversation.storeId,
          limit: 1
        }
      });

      if (orders && orders.data && orders.data.length > 0) {
        const latest = orders.data[0];
        responseText = `Your latest order #${latest.orderNumber} is currently ${latest.status}. Total: ${latest.currency} ${latest.total / 100}.`;
      } else {
        responseText = "I couldn't find any recent orders for this phone number.";
      }
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : "Unknown error";
      console.error("AI Order Lookup Failed:", errorMessage);
      responseText = "I'm having trouble accessing order details right now. Please allow me to connect you to an agent.";
    }
  } else if (text.includes("discount") || text.includes("promo") || text.includes("coupon")) {
    // Create Approval with structured payload
    const approval = await prisma.approval.create({
      data: {
        merchantId: message.conversation.storeId || "SYSTEM",
        storeId: message.conversation.storeId,
        type: "DISCOUNT_APPLICATION",
        summary: `10% Discount request from ${message.conversation.contact.phoneE164}`,
        payload: {
          requestedDiscount: "10%",
          sourceId: messageId,
          contactId: message.conversation.contact.id,
        },
        status: "PENDING",
      },
    });
    responseText = `I've requested a 10% discount for you. A manager is reviewing it now. (Ref: ${approval.id.slice(0, 8)})`;
  } else if (text.includes("find") || text.includes("source") || text.includes("bulk") || text.includes("import")) {
    // Sourcing / Product Matching
    // TODO: Implement ChinaSyncService in @vayva/shared
    /*
    const { ChinaSyncService } = require("@vayva/shared");
    const suggestion = await ChinaSyncService.suggestSupplier(text);

    if (suggestion) {
      responseText = `I can help you source that! We have a specialist partner, ${suggestion.name}, who covers ${suggestion.category || 'this category'}. Would you like me to start a sourcing request for you?`;
    } else {
      responseText = "I've logged your interest in sourcing this product. Our agents will look for the best deals in China and get back to you.";
    }
    */
    responseText = "I've logged your interest in sourcing this product. Our agents will look for the best deals in China and get back to you.";
  } else if (text.includes("help") || text.includes("support") || text.includes("problem")) {
    responseText = "I've notified our support team! A human agent will jump in to assist you shortly. In the meantime, feel free to share any more details about the issue.";
  } else {
    responseText = `I've received your message: "${message.textBody}". I'm escalating this to a human agent who will reply shortly.`;
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
