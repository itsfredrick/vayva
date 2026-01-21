import { NextResponse } from "next/server";
import { OpsAuthService } from "@/lib/ops-auth";
export async function POST(req) {
    await OpsAuthService.logout();
    return NextResponse.json({ success: true });
}
