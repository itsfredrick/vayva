import { NextRequest, NextResponse } from "next/server";
import { getSessionUser } from "@/lib/session";
import { TeamService } from "@/lib/team/teamService";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ token: string }> },
) {
  try {
    const { token } = await params;
    const user = await getSessionUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await TeamService.acceptInvite(token, user.id);

    return NextResponse.json({
      ok: true,
      message: "Invite accepted successfully",
    });
  } catch (error: any) {
    console.error("Accept invite error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to accept invite" },
      { status: 400 },
    );
  }
}
