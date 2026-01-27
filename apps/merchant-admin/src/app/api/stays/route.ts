import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

/**
 * GET /api/stays
 * List all accommodation stays for the store
 */
export async function GET(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.storeId) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { searchParams } = new URL(req.url);
        const status = searchParams.get("status");
        const type = searchParams.get("type");

        const stays = await prisma.product.findMany({
            where: {
                storeId: session.user.storeId,
                productType: "ACCOMMODATION",
                ...(status && { status }),
            },
            include: {
                productImages: { take: 1, orderBy: { position: "asc" } },
                accommodationProduct: true,
            },
            orderBy: { createdAt: "desc" },
        });

        let filtered = stays;
        if (type) {
            filtered = filtered.filter((s: any) =>
                s.accommodationProduct?.type?.toLowerCase() === type.toLowerCase()
            );
        }

        return NextResponse.json({
            stays: filtered.map((s: any) => ({
                id: s.id,
                title: s.title,
                description: s.description,
                price: Number(s.price),
                status: s.status,
                image: s.productImages[0]?.url || null,
                type: s.accommodationProduct?.type,
                maxGuests: s.accommodationProduct?.maxGuests,
                bedCount: s.accommodationProduct?.bedCount,
                bathrooms: s.accommodationProduct?.bathrooms,
                totalUnits: s.accommodationProduct?.totalUnits,
                amenities: s.accommodationProduct?.amenities,
                createdAt: s.createdAt,
            })),
            total: filtered.length,
        });
    } catch (error: any) {
        console.error("GET /api/stays error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

/**
 * POST /api/stays
 * Create a new accommodation listing
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
            type,
            maxGuests,
            bedCount,
            bathrooms,
            totalUnits,
            amenities,
            images,
        } = body;

        if (!title || !price) {
            return NextResponse.json(
                { error: "Title and price are required" },
                { status: 400 }
            );
        }

        const handle = `${title}-${Date.now()}`
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, "-");

        const stay = await prisma.product.create({
            data: {
                storeId: session.user.storeId,
                title,
                description: description || "",
                price,
                handle,
                status: "ACTIVE",
                productType: "ACCOMMODATION",
                accommodationProduct: {
                    create: {
                        type: type || "ROOM",
                        maxGuests: maxGuests || 2,
                        bedCount: bedCount || 1,
                        bathrooms: bathrooms || 1,
                        totalUnits: totalUnits || 1,
                        amenities: amenities || [],
                    },
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
                accommodationProduct: true,
                productImages: true,
            },
        });

        return NextResponse.json({ stay }, { status: 201 });
    } catch (error: any) {
        console.error("POST /api/stays error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
