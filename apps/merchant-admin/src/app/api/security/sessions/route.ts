import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth/session";
import { prisma } from "@vayva/db";

export async function GET() {
  try {
    const session = await requireAuth();
    const userId = session.user.id;

    // Get all sessions for this user
    // Note: This requires a Session model in your Prisma schema
    // For now, we'll return test data

    const sessions = [
      {
        id: "current",
        device: "Chrome on Mac",
        location: "Lagos, Nigeria",
        lastActive: new Date().toISOString(),
        current: true,
      },
    ];

    return NextResponse.json({ sessions });
  } catch (error: any) {
    console.error("Sessions fetch error:", error);

    if (error.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    return NextResponse.json(
      { error: "Failed to fetch sessions" },
      { status: 500 },
    );
  }
}
