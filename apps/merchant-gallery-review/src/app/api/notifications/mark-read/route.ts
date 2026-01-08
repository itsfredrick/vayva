import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const body = await request.json();
  const { notificationId, markAll } = body;

  // In a real app, update DB
  // For test, we just return success

  if (markAll) {
    return NextResponse.json({
      success: true,
      message: "All notifications marked as read",
    });
  }

  return NextResponse.json({
    success: true,
    message: `Notification ${notificationId} marked as read`,
    id: notificationId,
  });
}
