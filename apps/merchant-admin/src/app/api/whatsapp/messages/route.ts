import { NextResponse } from "next/server";
import {
  WhatsAppMessage,
  WhatsAppMessageSender,
  WhatsAppLinkedEntityType,
} from "@vayva/shared";
import { prisma, MessageType, Direction, MessageStatus } from "@vayva/db";
import { getSessionUser } from "@/lib/session";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const conversationId = searchParams.get("conversationId");

  if (!conversationId) {
    return NextResponse.json(
      { error: "Conversation ID required" },
      { status: 400 },
    );
  }

  // Auth check
  const user = await getSessionUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const messages = await prisma.message.findMany({
      where: {
        conversationId: conversationId,
        // Ensure store ownership
        Conversation: {
          storeId: user.storeId,
        },
      },
      orderBy: { createdAt: "asc" },
      take: 100,
    });

    const mappedMessages: WhatsAppMessage[] = messages.map((m: any) => ({
      id: m.id,
      conversationId: m.conversationId,
      sender:
        m.direction === Direction.OUTBOUND
          ? WhatsAppMessageSender.MERCHANT
          : WhatsAppMessageSender.CUSTOMER,
      linkedType: WhatsAppLinkedEntityType.NONE,
      content: m.textBody || "[Media message]",
      timestamp: m.createdAt.toISOString(),
      isAutomated: false,
    }));

    return NextResponse.json(mappedMessages);
  } catch (error) {
    console.error("Fetch Messages Error", error);
    return NextResponse.json(
      { error: "Failed to fetch messages" },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  const body = await request.json();

  // Validate body briefly
  if (!body.conversationId || !body.content) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  const user = await getSessionUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    // Verify conversation ownership
    const conversation = await prisma.conversation.findUnique({
      where: { id: body.conversationId },
    });

    if (!conversation || conversation.storeId !== user.storeId) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Create Message
    const created = await prisma.message.create({
      data: {
        storeId: user.storeId,
        conversationId: body.conversationId,
        direction: Direction.OUTBOUND,
        type: MessageType.TEXT,
        textBody: body.content,
        status: MessageStatus.QUEUED, // Worker will pick up
        receivedAt: new Date(),
      },
    });

    const newMessage: WhatsAppMessage = {
      id: created.id,
      conversationId: created.conversationId,
      sender: WhatsAppMessageSender.MERCHANT,
      content: created.textBody || "",
      linkedType: WhatsAppLinkedEntityType.NONE,
      linkedId: undefined,
      timestamp: created.createdAt.toISOString(),
      isAutomated: false,
    };

    return NextResponse.json(newMessage);
  } catch (error) {
    console.error("Create Message Error", error);
    return NextResponse.json(
      { error: "Failed to send message" },
      { status: 500 },
    );
  }
}
