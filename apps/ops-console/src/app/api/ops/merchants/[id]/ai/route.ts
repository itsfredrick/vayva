
import { NextResponse } from "next/server";
import { prisma } from "@vayva/db";
import { OpsAuthService } from "@/lib/ops-auth";

export const dynamic = "force-dynamic";

// GET: Fetch Merchant AI Profile
export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { user } = await OpsAuthService.requireSession();
        if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        const resolvedParams = await params;
        const { id } = resolvedParams;

        // Upsert profile to ensure it exists
        const profile = await prisma.merchantAiProfile.upsert({
            where: { storeId: id },
            create: { storeId: id },
            update: {}
        });

        return NextResponse.json({ success: true, data: profile });

    } catch (error) {
        console.error("Fetch Merchant AI Error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

// PATCH: Update Merchant AI Profile
export async function PATCH(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { user } = await OpsAuthService.requireSession();
        // Only Admins or Support can modify AI settings
        if (!["OPS_OWNER", "OPS_ADMIN", "OPS_SUPPORT"].includes(user.role)) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
        }

        const resolvedParams = await params;
        const { id } = resolvedParams;
        const body = await request.json();

        // Validate body fields (allow partial updates)
        const {
            agentName,
            tonePreset,
            greetingTemplate,
            botEnabled // Hypothetical, schema might not have this yet but useful to track
        } = body;

        const updated = await prisma.merchantAiProfile.update({
            where: { storeId: id },
            data: {
                agentName,
                tonePreset,
                greetingTemplate
            }
        });

        await OpsAuthService.logEvent(user.id, "UPDATE_MERCHANT_AI", {
            storeId: id,
            changes: body
        });

        return NextResponse.json({ success: true, data: updated });

    } catch (error) {
        console.error("Update Merchant AI Error:", error);
        return NextResponse.json({ error: "Update failed" }, { status: 500 });
    }
}
