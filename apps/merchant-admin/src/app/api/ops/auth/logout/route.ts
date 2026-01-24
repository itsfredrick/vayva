import { NextResponse } from "next/server";
import { OpsAuthService } from "@/lib/ops-auth";
export async function POST(req: any) {
    await OpsAuthService.logout();
    return NextResponse.json({ success: true });
}
