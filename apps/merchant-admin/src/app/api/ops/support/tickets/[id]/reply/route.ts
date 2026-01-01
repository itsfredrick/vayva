import { NextResponse } from "next/server";
import { prisma } from "@vayva/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function POST(
  req: Request,
  props: { params: Promise<{ id: string }> },
) {
  const params = await props.params;
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await req.json();
    const { message } = body;

    if (!message)
      return NextResponse.json({ error: "Message required" }, { status: 400 });

    // 1. Create Reply
    const reply = await (prisma as any).ticketMessage.create({
      data: {
        ticketId: params.id,
        message,
        sender: "OPS",
        authorType: "OPS",
        authorId: session.user.id,
        authorName: `${session.user.name || "Admin"} (Support)`,
      },
    });

    // 2. Update Ticket Timestamp
    // 2. Update Ticket Metadata
    const ticket = await (prisma as any).supportTicket.findUnique({
      where: { id: params.id },
    });

    const updateData: any = { lastMessageAt: new Date() };
    if (!ticket.firstOpsReplyAt) {
      updateData.firstOpsReplyAt = new Date();
    }

    await (prisma as any).supportTicket.update({
      where: { id: params.id },
      data: updateData,
    });

    // 3. (Optional) Trigger Notification to Merchant via Email/Dashboard

    return NextResponse.json(reply);
  } catch (error) {
    return NextResponse.json({ error: "Internal Error" }, { status: 500 });
  }
}
