import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/session";
import { prisma } from "@vayva/db";
import { authorizeAction, AppRole } from "@/lib/permissions";
import { logAuditEvent, AuditEventType } from "@/lib/audit";
import { checkRateLimit } from "@/lib/rate-limit";
import { requireSudoMode } from "@/lib/security";

export async function POST(request: Request) {
  try {
    const user = await getSessionUser();
    if (!user)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await request.json();
    const { type, filters } = body;

    if (!["withdrawals", "orders"].includes(type)) {
      return NextResponse.json(
        { error: "Invalid export type" },
        { status: 400 },
      );
    }

    // 1. Permissions & Security
    if (type === "withdrawals") {
      await authorizeAction(user || undefined, AppRole.ADMIN);
      await requireSudoMode(user.id, user.storeId);
    } else {
      await authorizeAction(user || undefined, AppRole.STAFF);
    }

    // 2. Rate Limit (10 per hour)
    await checkRateLimit(user.id, "export_create", 10, 3600, user.storeId);

    // 3. Create Job
    const expiresAt = new Date();
    expiresAt.setMinutes(expiresAt.getMinutes() + 10); // 10 min expiry

    const job = await prisma.exportJob.create({
      data: {
        merchantId: user.storeId,
        userId: user.id,
        type,
        filters: filters || {},
        status: "READY",
        expiresAt,
      },
    });

    // 4. Audit
    await logAuditEvent(
      user.storeId,
      user.id,
      AuditEventType.EXPORT_CREATED, // Make sure this enum exists
      { type, jobId: job.id },
    );

    return NextResponse.json({ exportId: job.id, expiresAt });
  } catch (error: any) {
    console.error("Export Create Error:", error);
    if (error.message === "Sudo mode required") {
      return NextResponse.json(
        { error: "Sudo mode required", code: "SUDO_REQUIRED" },
        { status: 403 },
      );
    }
    if (error.name === "RateLimitError") {
      return NextResponse.json({ error: error.message }, { status: 429 });
    }
    return NextResponse.json(
      { error: "Failed to create export" },
      { status: 500 },
    );
  }
}
