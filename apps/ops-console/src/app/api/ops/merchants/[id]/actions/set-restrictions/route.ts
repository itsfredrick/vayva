import { NextRequest, NextResponse } from "next/server";
import { OpsAuthService } from "@/lib/ops-auth";
import { prisma } from "@vayva/db";

export const dynamic = "force-dynamic";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { user } = await OpsAuthService.requireSession();
    OpsAuthService.requireRole(user, "SUPERVISOR");

    const { id: storeId } = await params;
    const body = await req.json();

    const reason = typeof body?.reason === "string" ? body.reason.trim() : "";
    const restrictions = body?.restrictions;

    if (!reason || reason.length < 10) {
      return NextResponse.json(
        { error: "Reason must be at least 10 characters" },
        { status: 400 },
      );
    }

    if (!restrictions || typeof restrictions !== "object") {
      return NextResponse.json(
        { error: "restrictions must be an object" },
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
    const prevRestrictions = prevSettings.restrictions || {};

    const nextSettings = {
      ...prevSettings,
      restrictions: {
        ...prevRestrictions,
        ...restrictions,
      },
    };

    await prisma.store.update({
      where: { id: storeId },
      data: { settings: nextSettings },
    });

    await OpsAuthService.logEvent(user.id, "SET_STORE_RESTRICTIONS", {
      targetType: "Store",
      targetId: storeId,
      storeName: store.name,
      reason,
      previousState: { restrictions: prevRestrictions },
      newState: { restrictions: nextSettings.restrictions },
    });

    return NextResponse.json({
      success: true,
      message: "Store restrictions updated",
      restrictions: nextSettings.restrictions,
    });
  } catch (error: any) {
    if (error.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    if (error.message?.includes("Insufficient permissions")) {
      return NextResponse.json(
        { error: "Insufficient permissions. SUPERVISOR role required." },
        { status: 403 },
      );
    }

    console.error("Set store restrictions error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
