import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

/**
 * GET /api/projects
 * List all portfolio projects for creative businesses
 */
export async function GET(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.storeId) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { searchParams } = new URL(req.url);
        const status = searchParams.get("status");

        const projects = await prisma.product.findMany({
            where: {
                storeId: session.user.storeId,
                productType: "PROJECT",
                ...(status && { status }),
            },
            include: {
                productImages: { orderBy: { position: "asc" } },
            },
            orderBy: { createdAt: "desc" },
        });

        return NextResponse.json({
            projects: projects.map((p: any) => {
                const meta = p.metadata as any;
                return {
                    id: p.id,
                    title: p.title,
                    description: p.description,
                    status: p.status,
                    images: p.productImages.map((img: any) => img.url),
                    client: meta?.client || null,
                    year: meta?.year || null,
                    category: meta?.category || null,
                    tags: p.tags,
                    createdAt: p.createdAt,
                };
            }),
            total: projects.length,
        });
    } catch (error: any) {
        console.error("GET /api/projects error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

/**
 * POST /api/projects
 * Create a new portfolio project
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
            client,
            year,
            category,
            tags,
            images,
        } = body;

        if (!title) {
            return NextResponse.json(
                { error: "Title is required" },
                { status: 400 }
            );
        }

        const handle = `${title}-${Date.now()}`
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, "-");

        const project = await prisma.product.create({
            data: {
                storeId: session.user.storeId,
                title,
                description: description || "",
                price: 0,
                handle,
                status: "ACTIVE",
                productType: "PROJECT",
                tags: tags || [],
                metadata: {
                    client: client || null,
                    year: year || new Date().getFullYear(),
                    category: category || null,
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

        return NextResponse.json({ project }, { status: 201 });
    } catch (error: any) {
        console.error("POST /api/projects error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
