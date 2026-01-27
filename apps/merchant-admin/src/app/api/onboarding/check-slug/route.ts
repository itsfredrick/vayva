import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

const RESERVED_STORE_SLUGS = new Set([
    "admin",
    "merchant",
    "ops",
    "www",
    "api",
    "support",
    "app",
    "dashboard",
    "help",
    "docs",
    "blog",
    "status",
]);

export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const slug = searchParams.get("slug");

        if (!slug) {
            return NextResponse.json({ error: "Slug is required" }, { status: 400 });
        }

        const normalized = slug.trim().toLowerCase();
        if (RESERVED_STORE_SLUGS.has(normalized)) {
            return NextResponse.json({
                available: false,
                slug: normalized,
                reason: "reserved",
                message: "This URL is reserved by Vayva. Please choose another.",
            });
        }

        // Check if slug is already taken
        const existing = await prisma.store.findUnique({
            where: { slug: normalized },
            select: { id: true }
        });

        return NextResponse.json({
            available: !existing,
            slug: normalized
        });
    } catch (error: any) {
        console.error("Check Slug Error:", error);
        return NextResponse.json(
            { error: "Failed to check slug availability" },
            { status: 500 }
        );
    }
}
