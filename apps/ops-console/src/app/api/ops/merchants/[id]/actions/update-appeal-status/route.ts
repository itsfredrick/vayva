import { NextRequest, NextResponse } from "next/server";
import { OpsAuthService } from "@/lib/ops-auth";
import { prisma } from "@vayva/db";
import { NotificationManager } from "@vayva/shared/notifications/manager";

export const dynamic = "force-dynamic";

const ALLOWED_STATUSES = new Set([
  "OPEN",
  "UNDER_REVIEW",
  "NEED_MORE_INFO",
  "RESOLVED",
  "REJECTED",
]);

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { user } = await OpsAuthService.requireSession();
    OpsAuthService.requireRole(user, "OPS_SUPPORT");

    const { id: storeId } = await params;
    const body = await req.json();

    const appealId = typeof body?.appealId === "string" ? body.appealId.trim() : "";
    const nextStatus = typeof body?.status === "string" ? body.status.trim() : "";
    const notes = typeof body?.notes === "string" ? body.notes.trim() : "";
    const reason = typeof body?.reason === "string" ? body.reason.trim() : "";

    if (!appealId) {
      return NextResponse.json({ error: "appealId is required" }, { status: 400 });
    }

    if (!nextStatus || !ALLOWED_STATUSES.has(nextStatus)) {
      return NextResponse.json(
        { error: "Invalid status" },
        { status: 400 },
      );
    }

    if (!reason || reason.length < 10) {
      return NextResponse.json(
        { error: "Reason must be at least 10 characters" },
        { status: 400 },
      );
    }

    const store = await prisma.store.findUnique({
      where: { id: storeId },
      select: { id: true, name: true, settings: true },
    });

    if (!store) {
      return NextResponse.json({ error: "Store not found" }, { status: 404 });
    }

    const prevSettings = (store.settings as any) || {};
    const prevAppeals = Array.isArray(prevSettings.appeals) ? prevSettings.appeals : [];

    const idx = prevAppeals.findIndex((a: any) => a?.id === appealId);
    if (idx < 0) {
      return NextResponse.json({ error: "Appeal not found" }, { status: 404 });
    }

    const nowIso = new Date().toISOString();
    const current = prevAppeals[idx] || {};

    const updated = {
      ...current,
      status: nextStatus,
      updatedAt: nowIso,
      updatedBy: user.id,
      history: [
        ...(Array.isArray(current.history) ? current.history : []),
        {
          at: nowIso,
          by: user.id,
          type: "STATUS_UPDATE",
          status: nextStatus,
          reason,
          notes: notes || undefined,
        },
      ],
    };

    const nextAppeals = [...prevAppeals];
    nextAppeals[idx] = updated;

    const nextSettings = {
      ...prevSettings,
      appeals: nextAppeals,
    };

    await prisma.store.update({
      where: { id: storeId },
      data: { settings: nextSettings },
    });

    await OpsAuthService.logEvent(user.id, "UPDATE_APPEAL_STATUS", {
      targetType: "Store",
      targetId: storeId,
      storeName: store.name,
      appealId,
      status: nextStatus,
      reason,
    });

    // Trigger notification for appeal status update
    try {
      await NotificationManager.trigger(storeId, "APPEAL_STATUS_UPDATED", {
        status: nextStatus,
        notes: notes || "No additional notes.",
      });
    } catch (notifError) {
      console.error("Failed to send appeal update notification:", notifError);
    }

    return NextResponse.json({ success: true, appeal: updated });
  } catch (error: any) {
    if (error.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    if (error.message?.includes("Insufficient permissions")) {
      return NextResponse.json(
        { error: "Insufficient permissions." },
        { status: 403 },
      );
    }

    console.error("Update appeal status error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
