import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth/session";
import { prisma } from "@vayva/db";

export async function GET() {
  try {
    const session = await requireAuth();
    const storeId = session.user.storeId;

    const store = await prisma.store.findUnique({
      where: { id: storeId },
      include: {
        whatsAppChannel: true,
      },
    });

    if (!store) {
      return NextResponse.json({ error: "Store not found" }, { status: 404 });
    }

    const settings = (store.settings as any) || {};

    return NextResponse.json({
      integrations: [
        {
          id: "paystack",
          name: "Paystack",
          status: settings.paystack?.connected ? "CONNECTED" : "DISCONNECTED",
          account: settings.paystack?.accountId || null,
          lastSync: settings.paystack?.lastSync || null,
        },
        {
          id: "whatsapp",
          name: "WhatsApp Business",
          status: store.whatsAppChannel ? "CONNECTED" : "DISCONNECTED",
          account: store.whatsAppChannel?.displayPhoneNumber || null,
          lastSync: store.whatsAppChannel?.updatedAt || null,
        },
        {
          id: "email",
          name: "Email Provider (Resend)",
          status: settings.email?.connected ? "CONNECTED" : "DISCONNECTED",
          account: settings.email?.domain || null,
          lastSync: settings.email?.lastSync || null,
        },
      ],
    });
  } catch (error: any) {
    console.error("Integrations fetch error:", error);

    if (error.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    return NextResponse.json(
      { error: "Failed to fetch integrations" },
      { status: 500 },
    );
  }
}
