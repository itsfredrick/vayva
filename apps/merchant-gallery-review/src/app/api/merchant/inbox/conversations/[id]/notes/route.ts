import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@vayva/db";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await getServerSession(authOptions);
  if (!session?.user)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const { note } = await req.json();

  if (!note) return new NextResponse("Note empty", { status: 400 });

  const conv = await prisma.conversation.findUnique({ where: { id } });
  if (!conv || conv.storeId !== (session!.user as any).storeId)
    return new NextResponse("Forbidden", { status: 403 });

  const created = await prisma.internalNote.create({
    data: {
      merchantId: conv.storeId,
      conversationId: id,
      authorId: (session!.user as any).id, // Or name if simple string
      note,
    },
  });

  // Audit Log (simplified)
  /* await prisma.auditLog.create({ ... }) */

  return NextResponse.json(created);
}
