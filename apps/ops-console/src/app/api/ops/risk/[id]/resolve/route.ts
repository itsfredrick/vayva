import { NextRequest, NextResponse } from "next/server";
import { OpsAuthService } from "@/lib/ops-auth";

export async function POST(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const session = await OpsAuthService.getSession();
    if (!session) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const { id } = await params;

        // Log the resolution
        await OpsAuthService.logEvent(session.user?.id || "unknown", "RISK_FLAG_RESOLVED", {
            flagId: id,
        });

        return NextResponse.json({ success: true });
    } catch (error: any) {
        console.error("Risk resolve error:", error);
        return NextResponse.json({ error: "Failed to resolve flag" }, { status: 500 });
    }
}
