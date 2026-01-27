import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@vayva/db";
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
        const { action } = await req.json();

        if (!["approve", "reject"].includes(action)) {
            return NextResponse.json({ error: "Invalid action" }, { status: 400 });
        }

        const newStatus = action === "approve" ? "APPROVED" : "REJECTED";

        await prisma.returnRequest.update({
            where: { id },
            data: { status: newStatus as any },
        });

        await OpsAuthService.logEvent(session.user?.id || "unknown", `REFUND_${action.toUpperCase()}`, {
            returnRequestId: id,
        });

        return NextResponse.json({ success: true });
    } catch (error: any) {
        console.error("Refund action error:", error);
        return NextResponse.json({ error: "Failed to process refund" }, { status: 500 });
    }
}
