import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { checkRateLimit } from "@/lib/rate-limit";
import { logAuditEvent as logAudit } from "@/lib/audit";
export async function POST() {
    try {
        const session = await getServerSession(authOptions);
        if (!session || !session.user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }
        const userId = session.user.id;
        const storeId = session.user.storeId;
        // Safety: Rate limit - 1 per hour
        await checkRateLimit(userId, "recovery_webhook_sync", 1, 3600, storeId);
        // Logic: Trigger background job to re-sync
        // (Simulated for MVP)
        await new Promise((resolve: any) => setTimeout(resolve, 1500));
        await logAudit(storeId, userId, "RECOVERY_WEBHOOK_SYNC_TRIGGERED", {
            meta: {
                correlationId: `recovery-${Date.now()}`,
                actor: { type: "USER", label: session.user.email || "Merchant" }
            }
        });
        return NextResponse.json({ success: true });
    }
    catch (error) {
        console.error("Recovery sync error:", error);
        return NextResponse.json({ error: error.message || "Internal Server Error" }, {
            status: error.name === "RateLimitError" ? 429 : 500,
        });
    }
}
