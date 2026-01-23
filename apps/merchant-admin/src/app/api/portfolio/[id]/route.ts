import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/session";
import { prisma } from "@/lib/prisma";
// GET /api/portfolio/[id]
export async function GET(request: any, { params }: any) {
    try {
        const sessionUser = await getSessionUser();
        if (!sessionUser)
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        const { id } = await params;
        const project = await prisma.portfolioProject.findUnique({
            where: { id, storeId: sessionUser.storeId },
            include: { comments: true }
        });
        if (!project)
            return NextResponse.json({ error: "Not found" }, { status: 404 });
        return NextResponse.json({ project });
    }
    catch (e) {
        console.error("Fetch project error:", e);
        return NextResponse.json({ error: "Internal Error" }, { status: 500 });
    }
}
// PATCH /api/portfolio/[id]
export async function PATCH(request: any, { params }: any) {
    try {
        const sessionUser = await getSessionUser();
        if (!sessionUser)
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        const { id } = await params;
        const body = await request.json();
        // Destructure allowed fields
        const { title, description, images, clientMode, password } = body;
        const project = await prisma.portfolioProject.update({
            where: { id, storeId: sessionUser.storeId },
            data: {
                title,
                description,
                images,
                clientMode,
                password
            }
        });
        return NextResponse.json({ project });
    }
    catch (e) {
        console.error("Update project error:", e);
        return NextResponse.json({ error: "Internal Error" }, { status: 500 });
    }
}
