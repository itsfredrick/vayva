import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

/**
 * GET /api/courses
 * List all courses for the store
 */
export async function GET(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.storeId) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { searchParams } = new URL(req.url);
        const status = searchParams.get("status");

        const courses = await prisma.product.findMany({
            where: {
                storeId: session.user.storeId,
                productType: "COURSE",
                ...(status && { status }),
            },
            include: {
                productImages: { take: 1, orderBy: { position: "asc" } },
            },
            orderBy: { createdAt: "desc" },
        });

        return NextResponse.json({
            courses: courses.map((c: any) => ({
                id: c.id,
                title: c.title,
                description: c.description,
                price: Number(c.price),
                status: c.status,
                image: c.productImages[0]?.url || null,
                metadata: c.metadata,
                createdAt: c.createdAt,
            })),
            total: courses.length,
        });
    } catch (error: any) {
        console.error("GET /api/courses error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

/**
 * POST /api/courses
 * Create a new course
 */
export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.storeId) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const body = await req.json();
        const {
            title,
            description,
            price,
            curriculum,
            instructor,
            duration,
            level,
            images,
        } = body;

        if (!title || price === undefined) {
            return NextResponse.json(
                { error: "Title and price are required" },
                { status: 400 }
            );
        }

        const handle = `${title}-${Date.now()}`
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, "-");

        const course = await prisma.product.create({
            data: {
                storeId: session.user.storeId,
                title,
                description: description || "",
                price,
                handle,
                status: "ACTIVE",
                productType: "COURSE",
                metadata: {
                    curriculum: curriculum || [],
                    instructor: instructor || null,
                    duration: duration || null,
                    level: level || "beginner",
                },
                productImages: images?.length
                    ? {
                          create: images.map((url: string, i: number) => ({
                              url,
                              position: i,
                          })),
                      }
                    : undefined,
            },
            include: {
                productImages: true,
            },
        });

        return NextResponse.json({ course }, { status: 201 });
    } catch (error: any) {
        console.error("POST /api/courses error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
