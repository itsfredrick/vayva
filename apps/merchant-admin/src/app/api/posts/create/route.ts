import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/session";
import { prisma } from "@/lib/prisma";
export async function POST(request: any) {
    try {
        const user = await getSessionUser();
        if (!user)
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        const body = await request.json();
        const { title, slug, content, excerpt, status } = body;
        // Auto-generate slug if missing
        const finalSlug = slug || title.toLowerCase().replace(/ /g, "-").replace(/[^\w-]+/g, "");
        const post = await prisma.blogPost.create({
            data: {
                storeId: user.storeId,
                title,
                slug: finalSlug,
                content,
                excerpt,
                status: status || "DRAFT",
            }
        });
        return NextResponse.json(post);
    }
    catch (e) {
        console.error("Create Post Error:", e);
        return NextResponse.json({ error: "Internal Error" }, { status: 500 });
    }
}
