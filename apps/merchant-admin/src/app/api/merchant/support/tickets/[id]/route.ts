import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { SupportService } from "@/lib/support";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const session = await getServerSession(authOptions);
  if (!session?.user)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const ticket = await SupportService.getTicketDetails(
      id,
      (session!.user as any).storeId,
    );
    return NextResponse.json(ticket);
  } catch (e) {
    return new NextResponse("Not Found", { status: 404 });
  }
}
