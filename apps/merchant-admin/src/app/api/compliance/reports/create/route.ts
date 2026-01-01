import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/session";
import { authorizeAction, AppRole } from "@/lib/permissions";
import { prisma } from "@vayva/db";
import { logAuditEvent, AuditEventType } from "@/lib/audit";

export async function POST(request: Request) {
  try {
    const user = await getSessionUser();

    // Admin/Owner only
    const authError = await authorizeAction(user || undefined, AppRole.ADMIN);
    if (authError) return authError;

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { type, dateFrom, dateTo } = body;

    if (!type || !["withdrawals", "activity"].includes(type)) {
      return NextResponse.json(
        { error: "Invalid report type" },
        { status: 400 },
      );
    }

    // Create export job
    const expiresAt = new Date();
    expiresAt.setMinutes(expiresAt.getMinutes() + 10); // 10-minute expiry

    const job = await prisma.exportJob.create({
      data: {
        merchantId: user.storeId,
        userId: user.id,
        type: `compliance_${type}`,
        filters: { dateFrom, dateTo },
        status: "READY",
        expiresAt,
      },
    });

    // Audit log
    await logAuditEvent(
      user.storeId,
      user.id,
      AuditEventType.COMPLIANCE_REPORT_CREATED,
      {
        reportType: type,
        dateRange: { start: dateFrom, end: dateTo },
        jobId: job.id,
      },
    );

    return NextResponse.json({
      success: true,
      exportId: job.id,
      expiresAt: job.expiresAt,
    });
  } catch (error) {
    console.error("Compliance Report Error:", error);
    return NextResponse.json(
      { error: "Failed to create report" },
      { status: 500 },
    );
  }
}
