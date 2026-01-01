import { NextRequest, NextResponse } from "next/server";
import { OpsAuthService } from "@/lib/ops-auth";

export async function POST(req: NextRequest) {
  await OpsAuthService.logout();
  return NextResponse.json({ success: true });
}
