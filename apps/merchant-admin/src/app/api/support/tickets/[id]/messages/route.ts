import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

interface MessageRequestBody {
  message: string;
  sender?: string;
  senderId: string;
  attachments?: string[];
}

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  try {
    const body: MessageRequestBody = await req.json();
    const { message, sender, senderId, attachments } = body;

    const newMessage = await prisma.ticketMessage.create({
      data: {
        ticketId: id,
        message,
        sender: sender || "merchant",
        authorType: "MERCHANT", // Explicitly set for Merchant Admin context
        senderId,
        attachments: attachments || [],
      },
    });

    // Update ticket timestamp
    await prisma.supportTicket.update({
      where: { id: id },
      data: { updatedAt: new Date() },
    });

    return NextResponse.json(newMessage);
  } catch (error) {
    console.error("Send Message Error:", error);
    return NextResponse.json(
      { error: "Failed to send message" },
      { status: 500 },
    );
  }
}
