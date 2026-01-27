import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

/**
 * GET /api/campaigns/[id]
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

        const campaign = await prisma.product.findFirst({
            where: {
                id,
                storeId: session.user.storeId,
                productType: "CAMPAIGN",
            },
            include: {
                productImages: { orderBy: { position: "asc" } },
            },
        });

        if (!campaign) {
            return NextResponse.json({ error: "Campaign not found" }, { status: 404 });
        }

        return NextResponse.json({ campaign });
    } catch (error: any) {
        console.error("GET /api/campaigns/[id] error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

/**
 * PATCH /api/campaigns/[id]
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
            goalAmount,
            status,
            cause,
            endDate,
            tiers,
        } = body;

        const existing = await prisma.product.findFirst({
            where: {
                id,
                storeId: session.user.storeId,
                productType: "CAMPAIGN",
            },
        });

        if (!existing) {
            return NextResponse.json({ error: "Campaign not found" }, { status: 404 });
        }

        const existingMeta = (existing.metadata as any) || {};

        const campaign = await prisma.product.update({
            where: { id },
            data: {
                ...(title && { title }),
                ...(description !== undefined && { description }),
                ...(goalAmount !== undefined && { price: goalAmount }),
                ...(status && { status }),
                metadata: {
                    ...existingMeta,
                    ...(cause !== undefined && { cause }),
                    ...(endDate !== undefined && { endDate }),
                    ...(tiers !== undefined && { tiers }),
                },
            },
            include: {
                productImages: true,
            },
        });

        return NextResponse.json({ campaign });
    } catch (error: any) {
        console.error("PATCH /api/campaigns/[id] error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

/**
 * DELETE /api/campaigns/[id]
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
                productType: "CAMPAIGN",
            },
        });

        if (!existing) {
            return NextResponse.json({ error: "Campaign not found" }, { status: 404 });
        }

        await prisma.product.delete({
            where: { id },
        });

        return NextResponse.json({ success: true });
    } catch (error: any) {
        console.error("DELETE /api/campaigns/[id] error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
