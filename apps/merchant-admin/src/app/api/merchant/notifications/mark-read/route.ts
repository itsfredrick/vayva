import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { withVayvaAPI, HandlerContext } from "@/lib/api-handler";
import { PERMISSIONS } from "@/lib/team/permissions";

export const POST = withVayvaAPI(
  PERMISSIONS.SETTINGS_VIEW,
  async (req: NextRequest, { storeId }: HandlerContext) => {
    try {
      const body = await req.json();
      const { notificationId, markAll } = body;

      if (markAll) {
        await prisma.notification.updateMany({
          where: {
            storeId,
            isRead: false,
          },
          data: {
            isRead: true,
            readAt: new Date(),
          },
        });
        return NextResponse.json({
          success: true,
          message: "All notifications marked as read",
        });
      }

      if (notificationId) {
        const notification = await prisma.notification.findUnique({
          where: { id: notificationId },
        });

        if (!notification || notification.storeId !== storeId) {
          return NextResponse.json({ error: "Notification not found" }, { status: 404 });
        }

        const updated = await prisma.notification.update({
          where: { id: notificationId },
          data: {
            isRead: true,
            readAt: new Date(),
          },
        });
        return NextResponse.json({ success: true, notification: updated });
      }

      return NextResponse.json({ error: "Invalid request" }, { status: 400 });
    } catch (error) {
      console.error("Error marking notification read:", error);
      return NextResponse.json({ error: "Internal Error" }, { status: 500 });
    }
  }
);
