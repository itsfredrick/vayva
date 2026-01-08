import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth/session";
import { prisma } from "@vayva/db";
import { logAuditEvent, AuditEventType } from "@/lib/audit";

export async function GET() {
  try {
    const session = await requireAuth();
    const storeId = session.user.storeId;

    const securitySetting = await prisma.securitySetting.findUnique({
      where: { storeId },
    });

    const recentAuditLogs = await prisma.auditLog.findMany({
      where: { storeId },
      orderBy: { createdAt: "desc" },
      take: 10,
    });

    // Test sessions for now as we don't have a formal session table yet
    const sessions = [
      {
        id: "1",
        device: "MacBook Pro",
        location: "Lagos, NG",
        lastActive: new Date().toISOString(),
        isCurrent: true,
      },
      {
        id: "2",
        device: "iPhone 15",
        location: "Abuja, NG",
        lastActive: new Date(Date.now() - 86400000).toISOString(),
        isCurrent: false,
      },
    ];

    return NextResponse.json({
      mfaRequired: securitySetting?.mfaRequired || false,
      sessionTimeoutMinutes: securitySetting?.sessionTimeoutMinutes || 720,
      sessions,
      auditLogs: recentAuditLogs,
    });
  } catch (error: any) {
    console.error("Security settings fetch error:", error);
    return NextResponse.json(
      { error: "Failed to fetch security settings" },
      { status: 500 },
    );
  }
}

export async function PATCH(req: Request) {
  try {
    const session = await requireAuth();
    const storeId = session.user.storeId;
    const body = await req.json();

    const { mfaRequired, sessionTimeoutMinutes } = body;

    await prisma.securitySetting.upsert({
      where: { storeId },
      create: {
        storeId,
        mfaRequired,
        sessionTimeoutMinutes,
      },
      update: {
        mfaRequired,
        sessionTimeoutMinutes,
      },
    });

    // Log audit event
    await logAuditEvent(storeId, session.user.id, AuditEventType.ACCOUNT_SECURITY_ACTION, {
      action: "SECURITY_SETTINGS_UPDATED",
      mfaRequired,
      sessionTimeoutMinutes,
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Security settings update error:", error);
    return NextResponse.json(
      { error: "Failed to update security settings" },
      { status: 500 },
    );
  }
}
