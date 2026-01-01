import { NextResponse } from "next/server";
import {
  WhatsAppMessage,
  WhatsAppMessageSender,
  WhatsAppLinkedEntityType,
} from "@vayva/shared";

// Test Messages Store (In-memory for dev session)
let MESSAGES: WhatsAppMessage[] = [
  // Alice (conv_1)
  {
    id: "msg_1",
    conversationId: "conv_1",
    sender: WhatsAppMessageSender.CUSTOMER,
    content: "Hi, I placed an order yesterday.",
    linkedType: WhatsAppLinkedEntityType.NONE,
    timestamp: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
  },
  {
    id: "msg_2",
    conversationId: "conv_1",
    sender: WhatsAppMessageSender.SYSTEM,
    content: "Order #1024 confirmed. Status: Processing.",
    linkedType: WhatsAppLinkedEntityType.ORDER,
    linkedId: "ord_1024",
    timestamp: new Date(Date.now() - 1000 * 60 * 14).toISOString(),
    isAutomated: true,
  },
  {
    id: "msg_3",
    conversationId: "conv_1",
    sender: WhatsAppMessageSender.CUSTOMER,
    content: "Is my order ready for pickup?",
    linkedType: WhatsAppLinkedEntityType.NONE,
    timestamp: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
  },

  // Chioma (conv_2)
  {
    id: "msg_4",
    conversationId: "conv_2",
    sender: WhatsAppMessageSender.SYSTEM,
    content: "Booking #BK-502 confirmed for Tuesday, 2pm.",
    linkedType: WhatsAppLinkedEntityType.BOOKING,
    linkedId: "bk_502",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(),
    isAutomated: true,
  },
  {
    id: "msg_5",
    conversationId: "conv_2",
    sender: WhatsAppMessageSender.CUSTOMER,
    content: "I would like to reschedule my appointment.",
    linkedType: WhatsAppLinkedEntityType.NONE,
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
  },

  // Emeka (conv_3)
  {
    id: "msg_6",
    conversationId: "conv_3",
    sender: WhatsAppMessageSender.CUSTOMER,
    content: "Do you sell laptop chargers?",
    linkedType: WhatsAppLinkedEntityType.NONE,
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 25).toISOString(),
  },
  {
    id: "msg_7",
    conversationId: "conv_3",
    sender: WhatsAppMessageSender.MERCHANT,
    content: "Yes we do! For which model?",
    linkedType: WhatsAppLinkedEntityType.NONE,
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24.5).toISOString(),
  },
  {
    id: "msg_8",
    conversationId: "conv_3",
    sender: WhatsAppMessageSender.CUSTOMER,
    content: "Thanks for the quick response!",
    linkedType: WhatsAppLinkedEntityType.NONE,
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
  },
];

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const conversationId = searchParams.get("conversationId");

  if (!conversationId) {
    return NextResponse.json(
      { error: "Conversation ID required" },
      { status: 400 },
    );
  }

  const filtered = MESSAGES.filter((m) => m.conversationId === conversationId);
  return NextResponse.json(filtered);
}

export async function POST(request: Request) {
  const body = await request.json();

  // Validate body briefly
  if (!body.conversationId || !body.content) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  const newMessage: WhatsAppMessage = {
    id: `msg_${Date.now()}`,
    conversationId: body.conversationId,
    sender: body.sender || WhatsAppMessageSender.MERCHANT,
    content: body.content,
    linkedType: body.linkedType || WhatsAppLinkedEntityType.NONE,
    linkedId: body.linkedId,
    timestamp: new Date().toISOString(),
    isAutomated: body.isAutomated || false,
  };

  MESSAGES.push(newMessage);

  return NextResponse.json(newMessage);
}
