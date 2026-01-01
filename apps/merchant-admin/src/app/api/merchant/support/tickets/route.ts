import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { SupportService } from "@/lib/support";

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const tickets = await SupportService.getMerchantTickets(
    (session!.user as any).storeId,
  );
  return NextResponse.json(tickets);
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();

  const { storeId, id: userId } = session!.user as any;
  const ticket = await SupportService.createTicket({
    storeId: storeId,
    userId: userId,
    type: body.type,
    subject: body.subject,
    description: body.description,
    priority: body.priority,
  });

  return NextResponse.json(ticket);
}
