import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { PublishService } from "@/lib/publish/publishService";

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!(session?.user as any)?.storeId)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const status = await PublishService.getPublishStatus(
      (session!.user as any).storeId,
    );
    return NextResponse.json(status);
  } catch (e: any) {
    return new NextResponse(e.message, { status: 500 });
  }
}
