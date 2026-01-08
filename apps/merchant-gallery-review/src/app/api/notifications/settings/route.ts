import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth/session";
import { prisma } from "@vayva/db";

export async function GET() {
  try {
    const session = await requireAuth();
    const storeId = session.user.storeId;

    const store = await prisma.store.findUnique({
      where: { id: storeId },
      select: {
        settings: true,
      },
    });

    const settings = (store?.settings as any) || {};
    const notificationSettings = settings.notifications || {};

    return NextResponse.json({
      email: {
        orderPaid: notificationSettings.email?.orderPaid ?? true,
        payoutProcessed: notificationSettings.email?.payoutProcessed ?? true,
        kycUpdates: notificationSettings.email?.kycUpdates ?? true,
        disputes: notificationSettings.email?.disputes ?? true,
        marketing: notificationSettings.email?.marketing ?? false,
      },
      whatsapp: {
        orderUpdates: notificationSettings.whatsapp?.orderUpdates ?? true,
        customerMessages:
          notificationSettings.whatsapp?.customerMessages ?? true,
        dailySummaries: notificationSettings.whatsapp?.dailySummaries ?? false,
      },
      system: {
        security: notificationSettings.system?.security ?? true,
        subscription: notificationSettings.system?.subscription ?? true,
        errors: notificationSettings.system?.errors ?? true,
      },
    });
  } catch (error: any) {
    console.error("Notification settings fetch error:", error);

    if (error.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    return NextResponse.json(
      { error: "Failed to fetch notification settings" },
      { status: 500 },
    );
  }
}

export async function PUT(request: Request) {
  try {
    const session = await requireAuth();
    const storeId = session.user.storeId;

    const body = await request.json();
    const { email, whatsapp, system } = body;

    const store = await prisma.store.findUnique({
      where: { id: storeId },
      select: { settings: true },
    });

    const currentSettings = (store?.settings as any) || {};

    await prisma.store.update({
      where: { id: storeId },
      data: {
        settings: {
          ...currentSettings,
          notifications: {
            email,
            whatsapp,
            system,
          },
        },
      },
    });

    return NextResponse.json({
      success: true,
      message: "Notification settings updated",
    });
  } catch (error: any) {
    console.error("Notification settings update error:", error);

    if (error.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    return NextResponse.json(
      { error: "Failed to update notification settings" },
      { status: 500 },
    );
  }
}
