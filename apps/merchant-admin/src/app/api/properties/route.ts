import { NextRequest, NextResponse } from "next/server";
import { withVayvaAPI, HandlerContext } from "@/lib/api-handler";
import { PERMISSIONS } from "@/lib/team/permissions";
import { prisma } from "@/lib/prisma";

// POST Create Property (Product + AccommodationProduct)
export const POST = withVayvaAPI(
    PERMISSIONS.PRODUCTS_MANAGE,
    async (request: NextRequest, { storeId }: HandlerContext) => {
        try {
            const data = await request.json();

            // Transaction approach: Create Product, then AccommodationProduct
            const result = await prisma.$transaction(async (tx) => {
                // 1. Create Base Product
                const product = await tx.product.create({
                    data: {
                        storeId,
                        name: data.title,
                        description: data.description,
                        price: data.price,
                        type: "ACCOMMODATION" as unknown, // Or SERVICES depending on enum
                        status: "ACTIVE",
                        currency: "NGN", // Defaulting
                        images: data.images || [],
                    } as unknown
                });

                // 2. Create Accommodation Detail
                await tx.accommodationProduct.create({
                    data: {
                        productId: product.id,
                        type: (data.type || "ROOM") as unknown,
                        maxGuests: Number(data.maxGuests) || 1,
                        bedCount: Number(data.bedCount) || 1,
                        bathrooms: Number(data.bathrooms) || 1,
                        totalUnits: Number(data.totalUnits) || 1,
                        amenities: data.amenities || [],
                    }
                });

                return product;
            });

            return NextResponse.json(result);
        } catch (error: unknown) {
            console.error("Property Create Error:", error);
            return NextResponse.json({ error: error.message }, { status: 400 });
        }
    }
);
