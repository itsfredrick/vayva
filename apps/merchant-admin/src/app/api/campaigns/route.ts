import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

/**
 * GET /api/campaigns
 * List all fundraising campaigns for nonprofit
 */
export async function GET(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.storeId) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { searchParams } = new URL(req.url);
        const status = searchParams.get("status");

        const campaigns = await prisma.product.findMany({
            where: {
                storeId: session.user.storeId,
                productType: "CAMPAIGN",
                ...(status && { status }),
            },
            include: {
                productImages: { take: 1, orderBy: { position: "asc" } },
            },
            orderBy: { createdAt: "desc" },
        });

        return NextResponse.json({
            campaigns: campaigns.map((c: any) => ({
                id: c.id,
                title: c.title,
                description: c.description,
                goalAmount: Number(c.price),
                status: c.status,
                image: c.productImages[0]?.url || null,
                metadata: c.metadata,
                createdAt: c.createdAt,
            })),
            total: campaigns.length,
        });
    } catch (error: any) {
        console.error("GET /api/campaigns error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

/**
 * POST /api/campaigns
 * Create a new fundraising campaign
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
            goalAmount,
            cause,
            endDate,
            tiers,
            images,
        } = body;

        if (!title || !goalAmount) {
            return NextResponse.json(
                { error: "Title and goal amount are required" },
                { status: 400 }
            );
        }

        const handle = `${title}-${Date.now()}`
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, "-");

        const campaign = await prisma.product.create({
            data: {
                storeId: session.user.storeId,
                title,
                description: description || "",
                price: goalAmount,
                handle,
                status: "ACTIVE",
                productType: "CAMPAIGN",
                metadata: {
                    cause: cause || null,
                    endDate: endDate || null,
                    tiers: tiers || [],
                    raisedAmount: 0,
                    donorCount: 0,
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

        return NextResponse.json({ campaign }, { status: 201 });
    } catch (error: any) {
        console.error("POST /api/campaigns error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
