
import { NextRequest, NextResponse } from "next/server";
import { getSessionUser } from "@/lib/session";
import { prisma } from "@/lib/prisma";

// GET /api/portfolio
export async function GET(request: NextRequest) {
    try {
        const sessionUser = await getSessionUser();
        if (!sessionUser) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        const projects = await prisma.portfolioProject.findMany({
            where: { storeId: sessionUser.storeId },
            orderBy: { createdAt: 'desc' }
        });

        return NextResponse.json({ projects });
    } catch (e) {
        console.error("Fetch portfolio error:", e);
        return NextResponse.json({ error: "Internal Error" }, { status: 500 });
    }
}

// POST /api/portfolio
export async function POST(request: NextRequest) {
    try {
        const sessionUser = await getSessionUser();
        if (!sessionUser) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        const body = await request.json();
        const { title, description } = body;

        if (!title) return NextResponse.json({ error: "Title is required" }, { status: 400 });

        const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') + '-' + Date.now();

        const project = await prisma.portfolioProject.create({
            data: {
                storeId: sessionUser.storeId,
                title,
                description,
                slug,
                images: [] // Start empty
            }
        });

        return NextResponse.json({ project });
    } catch (e) {
        console.error("Create project error:", e);
        return NextResponse.json({ error: "Internal Error" }, { status: 500 });
    }
}
