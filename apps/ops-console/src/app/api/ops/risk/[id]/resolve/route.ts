import { NextRequest, NextResponse } from "next/server";
import { OpsAuthService } from "@/lib/ops-auth";

export async function POST(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const { user } = await OpsAuthService.requireSession();

    try {
        const { id } = await params;

        // Log the resolution
        await OpsAuthService.logEvent(user.id, "RISK_FLAG_RESOLVED", {
            flagId: id,
        });

        return NextResponse.json({ success: true });
    } catch (error: any) {
        console.error("Risk resolve error:", error);
        return NextResponse.json({ error: "Failed to resolve flag" }, { status: 500 });
    }
}
