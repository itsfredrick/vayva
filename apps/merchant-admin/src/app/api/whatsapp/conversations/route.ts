import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/session";
import { prisma } from "@vayva/db";
import { FEATURES } from "@/lib/env-validation";

export async function GET() {
  try {
    // Require authentication
    const user = await getSessionUser();
    if (!user) {
      return NextResponse.json(
        { error: "Unauthorized - Please login" },
        { status: 401 },
      );
    }

    // Feature Gate
    if (!FEATURES.WHATSAPP_ENABLED) {
      return NextResponse.json(
        {
          code: "feature_not_configured",
          feature: "WHATSAPP_ENABLED",
          message: "WhatsApp integration is not enabled",
        },
        { status: 503 },
      );
    }

    // Real DB Query
    const conversations = await prisma.conversation.findMany({
      where: { storeId: user.storeId },
      include: {
        contact: true,
        messages: {
          take: 1,
          orderBy: { createdAt: "desc" },
        },
      },
      take: 50,
      orderBy: { lastMessageAt: "desc" },
    });

    return NextResponse.json(conversations);
  } catch (error) {
    console.error("Fetch WhatsApp Conversations Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch conversations" },
      { status: 500 },
    );
  }
}
