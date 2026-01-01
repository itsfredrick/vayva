import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { DeletionService } from "@/services/DeletionService";

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.storeId)
    return new NextResponse("Unauthorized", { status: 401 });

  const status = await DeletionService.getStatus(session.user.storeId);
  return NextResponse.json({ status });
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.storeId || !session.user.id)
    return new NextResponse("Unauthorized", { status: 401 });

  // Verify Owner Role
  const userRole = (session.user as any).role;
  if (userRole !== "OWNER") {
    return new NextResponse("Forbidden - Only Owner can request deletion", {
      status: 403,
    });
  }

  try {
    const body = await req.json();
    const { reason } = body;

    const result = await DeletionService.requestDeletion(
      session.user.storeId,
      session.user.id,
      reason,
    );

    if (!result.success) {
      return NextResponse.json(
        { error: result.error, blockers: result.blockers },
        { status: 400 },
      );
    }

    return NextResponse.json({
      success: true,
      scheduledFor: result.scheduledFor,
    });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.storeId || !session.user.id)
    return new NextResponse("Unauthorized", { status: 401 });

  try {
    const result = await DeletionService.cancelDeletion(
      session.user.storeId,
      session.user.id,
    );

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }

    return NextResponse.json({ success: true });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
