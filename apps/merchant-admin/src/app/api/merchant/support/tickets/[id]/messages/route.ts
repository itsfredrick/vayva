import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { SupportService } from "@/lib/support";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const session = await getServerSession(authOptions);
  if (!(session!.user as any)?.storeId)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();

  try {
    // Ensure ownership first
    await SupportService.getTicketDetails(id, (session!.user as any).storeId);

    const { storeId, id: userId } = session!.user as any;
    const msg = await SupportService.addMessage(
      id,
      "merchant_user",
      userId,
      body.message,
    );
    return NextResponse.json(msg);
  } catch (e) {
    return new NextResponse("Error", { status: 400 });
  }
}
