import { NextResponse } from "next/server";
import { prisma } from "@vayva/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET(
  req: Request,
  props: { params: Promise<{ id: string }> },
) {
  const params = await props.params;
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const ticket = await (prisma as any).supportTicket.findUnique({
      where: { id: params.id },
      include: {
        store: {
          select: { name: true, category: true },
        },
        handoffEvents: true,
        // messages: true // Uncomment when TicketMessage model is fully unified
      },
    });

    if (!ticket)
      return NextResponse.json({ error: "Not Found" }, { status: 404 });

    return NextResponse.json(ticket);
  } catch (error) {
    return NextResponse.json({ error: "Internal Error" }, { status: 500 });
  }
}
