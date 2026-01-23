import { NextResponse } from "next/server";
import { withVayvaAPI } from "@/lib/api-handler";
import { PERMISSIONS } from "@/lib/team/permissions";
import { prisma } from "@/lib/prisma";
// POST Create Property (Product + AccommodationProduct)
export const POST = withVayvaAPI(PERMISSIONS.PRODUCTS_MANAGE, async (request, { storeId }) => {
    try {
        const data = await request.json();
        // Transaction approach: Create Product, then AccommodationProduct
        const result = await prisma.$transaction(async (tx: any) => {
            // 1. Create Base Product
            const product = await tx.product.create({
                data: {
                    storeId,
                    name: data.title,
                    description: data.description,
                    price: data.price,
                    type: "ACCOMMODATION", // Or SERVICES depending on enum
                    status: "ACTIVE",
                    currency: "NGN", // Defaulting
                    images: data.images || [],
                }
            });
            // 2. Create Accommodation Detail
            await tx.accommodationProduct.create({
                data: {
                    productId: product.id,
                    type: (data.type || "ROOM"),
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
    }
    catch (error) {
        console.error("Property Create Error:", error);
        return NextResponse.json({ error: error.message }, { status: 400 });
    }
});
