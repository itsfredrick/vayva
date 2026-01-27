import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@vayva/db";
import { OpsAuthService } from "@/lib/ops-auth";

export async function PATCH(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const session = await OpsAuthService.getSession();
    if (!session) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const { id } = await params;
        const body = await req.json();
        const { action, note } = body;

        const statusMap: Record<string, string> = {
            approve: "APPROVED",
            reject: "REJECTED",
            suspend: "SUSPENDED",
        };

        const newStatus = statusMap[action];
        if (!newStatus) {
            return NextResponse.json({ error: "Invalid action" }, { status: 400 });
        }

        const listing = await prisma.marketplaceListing.update({
            where: { id },
            data: {
                status: newStatus as any,
                moderationNote: note || null,
                moderatedBy: session.user?.id || "ops_admin",
            },
        });

        return NextResponse.json({ success: true, listing });
    } catch (error: any) {
        console.error("Listing action error:", error);
        return NextResponse.json({ error: "Failed to update listing" }, { status: 500 });
    }
}
