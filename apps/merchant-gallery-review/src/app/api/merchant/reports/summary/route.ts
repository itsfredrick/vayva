import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { ReportsService } from "@/lib/reports";

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const fromStr = searchParams.get("from");
  const toStr = searchParams.get("to");

  // Default: Last 7 days
  const to = toStr ? new Date(toStr) : new Date();
  const from = fromStr
    ? new Date(fromStr)
    : new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

  const data = await ReportsService.getSummary((session!.user as any).storeId, {
    from,
    to,
  });

  return NextResponse.json(data);
}
