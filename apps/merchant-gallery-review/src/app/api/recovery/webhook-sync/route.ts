import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { checkRateLimit } from "@/lib/rate-limit";
import { logAudit, AuditAction } from "@/lib/audit";

export async function POST() {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;
    const storeId = (session.user as any).storeId;

    // Safety: Rate limit - 1 per hour
    await checkRateLimit(userId, "recovery_webhook_sync", 1, 3600, storeId);

    // Logic: Trigger background job to re-sync
    // (Simulated for MVP)
    await new Promise((resolve) => setTimeout(resolve, 1500));

    await logAudit({
      storeId,
      actor: {
        type: "USER",
        id: userId,
        label: session.user.email || "Merchant",
      },
      action: "RECOVERY_WEBHOOK_SYNC_TRIGGERED",
      correlationId: `recovery-${Date.now()}`,
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Recovery sync error:", error);
    return NextResponse.json(
      { error: error.message || "Internal Server Error" },
      {
        status: error.name === "RateLimitError" ? 429 : 500,
      },
    );
  }
}
