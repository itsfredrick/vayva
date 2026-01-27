import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { INDUSTRY_CONFIG } from "@/config/industry";
import { IndustrySlug } from "@/lib/templates/types";

/**
 * GET /api/settings/industry
 * Returns the current industry setting for the store
 */
export async function GET() {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const storeId = session.user.storeId;
        if (!storeId) {
            return NextResponse.json({ error: "No store context" }, { status: 400 });
        }

        const store = await prisma.store.findUnique({
            where: { id: storeId },
            select: { industrySlug: true },
        });

        if (!store) {
            return NextResponse.json({ error: "Store not found" }, { status: 404 });
        }

        const industrySlug = store.industrySlug as IndustrySlug | null;
        const config = industrySlug ? INDUSTRY_CONFIG[industrySlug] : null;

        return NextResponse.json({
            industrySlug,
            config: config ? {
                displayName: config.displayName,
                primaryObject: config.primaryObject,
                modules: config.modules,
                moduleLabels: config.moduleLabels,
            } : null,
        });
    } catch (error: any) {
        console.error("GET /api/settings/industry error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

/**
 * POST /api/settings/industry
 * Updates the industry setting for the store
 */
export async function POST(req: Request) {
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
        const { industrySlug } = body;

        // Validate industry slug
        if (!industrySlug || !INDUSTRY_CONFIG[industrySlug as IndustrySlug]) {
            return NextResponse.json({ error: "Invalid industry slug" }, { status: 400 });
        }

        // Update store
        const updatedStore = await prisma.store.update({
            where: { id: storeId },
            data: { industrySlug },
            select: { id: true, industrySlug: true },
        });

        const config = INDUSTRY_CONFIG[industrySlug as IndustrySlug];

        return NextResponse.json({
            success: true,
            industrySlug: updatedStore.industrySlug,
            config: {
                displayName: config.displayName,
                primaryObject: config.primaryObject,
                modules: config.modules,
            },
        });
    } catch (error: any) {
        console.error("POST /api/settings/industry error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
