import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@vayva/db";

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!(session?.user as any)?.storeId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const storeId = (session!.user as any).storeId;
  const body = await req.json();

  const { type, category, title, message, actionUrl, channels } = body;

  // Map 'type' from payload (critical, info, etc) to 'severity' DB field
  // Map 'category' default to 'system'
  // Default 'type' DB field to 'event' or something generic since we use severity for the UI type
  const severity = [
    "critical",
    "action_required",
    "info",
    "success",
    "insight",
  ].includes(type)
    ? type
    : "info";

  const notification = await prisma.notification.create({
    data: {
      store: { connect: { id: storeId } }, // Connect to store relation
      userId: (session!.user as any).id,
      type: "manual_alert", // DB 'type' column
      severity: severity, // DB 'severity' column -> Maps to NotificationType
      category: category || "system",
      title: title || "Test Notification",
      body: message || "This is a test notification",
      actionUrl,
      channels: channels || ["in_app"],
      isRead: false,
    },
  });

  return NextResponse.json(notification);
}
