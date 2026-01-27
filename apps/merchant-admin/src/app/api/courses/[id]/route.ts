import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

/**
 * GET /api/courses/[id]
 */
export async function GET(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const session = await getServerSession(authOptions);
        if (!session?.user?.storeId) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const course = await prisma.product.findFirst({
            where: {
                id,
                storeId: session.user.storeId,
                productType: "COURSE",
            },
            include: {
                productImages: { orderBy: { position: "asc" } },
            },
        });

        if (!course) {
            return NextResponse.json({ error: "Course not found" }, { status: 404 });
        }

        return NextResponse.json({ course });
    } catch (error: any) {
        console.error("GET /api/courses/[id] error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

/**
 * PATCH /api/courses/[id]
 */
export async function PATCH(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const session = await getServerSession(authOptions);
        if (!session?.user?.storeId) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const body = await req.json();
        const {
            title,
            description,
            price,
            status,
            curriculum,
            instructor,
            duration,
            level,
        } = body;

        const existing = await prisma.product.findFirst({
            where: {
                id,
                storeId: session.user.storeId,
                productType: "COURSE",
            },
        });

        if (!existing) {
            return NextResponse.json({ error: "Course not found" }, { status: 404 });
        }

        const existingMeta = (existing.metadata as any) || {};

        const course = await prisma.product.update({
            where: { id },
            data: {
                ...(title && { title }),
                ...(description !== undefined && { description }),
                ...(price !== undefined && { price }),
                ...(status && { status }),
                metadata: {
                    ...existingMeta,
                    ...(curriculum !== undefined && { curriculum }),
                    ...(instructor !== undefined && { instructor }),
                    ...(duration !== undefined && { duration }),
                    ...(level !== undefined && { level }),
                },
            },
            include: {
                productImages: true,
            },
        });

        return NextResponse.json({ course });
    } catch (error: any) {
        console.error("PATCH /api/courses/[id] error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

/**
 * DELETE /api/courses/[id]
 */
export async function DELETE(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const session = await getServerSession(authOptions);
        if (!session?.user?.storeId) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const existing = await prisma.product.findFirst({
            where: {
                id,
                storeId: session.user.storeId,
                productType: "COURSE",
            },
        });

        if (!existing) {
            return NextResponse.json({ error: "Course not found" }, { status: 404 });
        }

        await prisma.product.delete({
            where: { id },
        });

        return NextResponse.json({ success: true });
    } catch (error: any) {
        console.error("DELETE /api/courses/[id] error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
