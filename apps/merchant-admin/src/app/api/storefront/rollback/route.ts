import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(req: any) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }
        const storeId = session.user.storeId;
        if (!storeId) {
            return NextResponse.json({ error: "No store context" }, { status: 400 });
        }

        const body = await req.json();
        const { versionId } = body;

        if (!versionId) {
            return NextResponse.json({ error: "Version ID required" }, { status: 400 });
        }

        // Fetch the historical version
        const historyEntry = await prisma.merchantThemeHistory.findFirst({
            where: { id: versionId, storeId },
        });

        if (!historyEntry) {
            return NextResponse.json({ error: "Version not found" }, { status: 404 });
        }

        // configSnapshot contains the full theme config from history
        const configSnapshot = historyEntry.configSnapshot as any || {};

        // Update the draft with the historical config
        const draft = await prisma.storefrontDraft.upsert({
            where: { storeId },
            create: {
                storeId,
                activeTemplateId: historyEntry.templateId,
                themeConfig: configSnapshot.themeConfig ?? {},
                sectionConfig: configSnapshot.sectionConfig ?? {},
                sectionOrder: configSnapshot.sectionOrder ?? [],
                assets: configSnapshot.assets ?? {},
            },
            update: {
                activeTemplateId: historyEntry.templateId,
                themeConfig: configSnapshot.themeConfig ?? {},
                sectionConfig: configSnapshot.sectionConfig ?? {},
            },
        });

        return NextResponse.json({ success: true, draft });
    } catch (error: any) {
        console.error("POST /api/storefront/rollback error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
