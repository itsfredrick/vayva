import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const slug = searchParams.get("slug");

        if (!slug) {
            return NextResponse.json({ error: "Slug is required" }, { status: 400 });
        }

        // Check if slug is already taken
        const existing = await prisma.store.findUnique({
            where: { slug },
            select: { id: true }
        });

        return NextResponse.json({
            available: !existing,
            slug
        });
    } catch (error: any) {
        console.error("Check Slug Error:", error);
        return NextResponse.json(
            { error: "Failed to check slug availability" },
            { status: 500 }
        );
    }
}
