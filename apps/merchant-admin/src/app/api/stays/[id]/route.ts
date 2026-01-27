import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

/**
 * GET /api/stays/[id]
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

        const stay = await prisma.product.findFirst({
            where: {
                id,
                storeId: session.user.storeId,
                productType: "ACCOMMODATION",
            },
            include: {
                productImages: { orderBy: { position: "asc" } },
                accommodationProduct: true,
            },
        });

        if (!stay) {
            return NextResponse.json({ error: "Stay not found" }, { status: 404 });
        }

        return NextResponse.json({ stay });
    } catch (error: any) {
        console.error("GET /api/stays/[id] error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

/**
 * PATCH /api/stays/[id]
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
            type,
            maxGuests,
            bedCount,
            bathrooms,
            totalUnits,
            amenities,
        } = body;

        const existing = await prisma.product.findFirst({
            where: {
                id,
                storeId: session.user.storeId,
                productType: "ACCOMMODATION",
            },
        });

        if (!existing) {
            return NextResponse.json({ error: "Stay not found" }, { status: 404 });
        }

        const stay = await prisma.product.update({
            where: { id },
            data: {
                ...(title && { title }),
                ...(description !== undefined && { description }),
                ...(price !== undefined && { price }),
                ...(status && { status }),
                accommodationProduct: {
                    update: {
                        ...(type && { type }),
                        ...(maxGuests !== undefined && { maxGuests }),
                        ...(bedCount !== undefined && { bedCount }),
                        ...(bathrooms !== undefined && { bathrooms }),
                        ...(totalUnits !== undefined && { totalUnits }),
                        ...(amenities !== undefined && { amenities }),
                    },
                },
            },
            include: {
                accommodationProduct: true,
                productImages: true,
            },
        });

        return NextResponse.json({ stay });
    } catch (error: any) {
        console.error("PATCH /api/stays/[id] error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

/**
 * DELETE /api/stays/[id]
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
                productType: "ACCOMMODATION",
            },
        });

        if (!existing) {
            return NextResponse.json({ error: "Stay not found" }, { status: 404 });
        }

        await prisma.product.delete({
            where: { id },
        });

        return NextResponse.json({ success: true });
    } catch (error: any) {
        console.error("DELETE /api/stays/[id] error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
