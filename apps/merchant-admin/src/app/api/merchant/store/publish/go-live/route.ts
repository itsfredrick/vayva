import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { PublishService } from "@/lib/publish/publishService";
import { logAuditEvent, AuditEventType } from "@/lib/audit";

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!(session?.user as any)?.storeId)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const result = await PublishService.goLive(
      (session!.user as any).storeId,
      (session!.user as any).id,
      (session!.user as any).name || (session!.user as any).email || "Merchant",
    );

    // Log audit event
    await logAuditEvent(
      (session!.user as any).storeId,
      (session!.user as any).id,
      AuditEventType.SETTINGS_CHANGED,
      { action: "STORE_PUBLISHED", result },
    );

    return NextResponse.json(result);
  } catch (e: any) {
    if (e.message.includes("not ready")) {
      return new NextResponse(
        JSON.stringify({ error: e.message, type: "NOT_READY" }),
        { status: 409 },
      );
    }
    return new NextResponse(e.message, { status: 500 });
  }
}
