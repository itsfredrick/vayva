import { NextResponse } from "next/server";
import { prisma } from "@vayva/db";

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  try {
    const body = await req.json();
    const { message, sender, senderId, attachments } = body;

    // @ts-ignore
    const newMessage = await prisma.ticketMessage.create({
      data: {
        ticketId: id,
        message,
        sender: sender || "merchant",
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
