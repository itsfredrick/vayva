import { NextResponse } from "next/server";
import { OpsAuthService } from "@/lib/ops-auth";
export async function POST(req: unknown) {
    await OpsAuthService.logout();
    return NextResponse.json({ success: true });
}
