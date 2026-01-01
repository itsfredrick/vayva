import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@vayva/db";
import { OpsAuthService } from "@/lib/ops-auth";

export async function GET(req: NextRequest) {
    try {
        await OpsAuthService.requireSession();

        const { searchParams } = new URL(req.url);
        const status = searchParams.get("status");
        const severity = searchParams.get("severity");
        const surface = searchParams.get("surface");

        const incidents = await prisma.rescueIncident.findMany({
            where: {
                ...(status && { status }),
                ...(severity && { severity }),
                ...(surface && { surface }),
            },
            orderBy: { createdAt: "desc" },
            take: 50,
        });

        return NextResponse.json(incidents);
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 401 });
    }
}
