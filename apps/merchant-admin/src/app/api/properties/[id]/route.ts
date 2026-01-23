import { NextResponse } from "next/server";
import { withVayvaAPI } from "@/lib/api-handler";
import { PERMISSIONS } from "@/lib/team/permissions";
import { prisma } from "@/lib/prisma";
// GET Property by ID
export const GET = withVayvaAPI(PERMISSIONS.PRODUCTS_VIEW, async (request, { storeId, params }) => {
    const { id } = await params;
    try {
        const accommodation = await prisma.accommodationProduct.findUnique({
            where: { id: id },
            include: { product: true }
        });
        if (!accommodation || accommodation.product.storeId !== storeId) {
            return NextResponse.json({ error: "Property not found" }, { status: 404 });
        }
        return NextResponse.json(accommodation);
    }
    catch (error) {
        console.error("Property Fetch Error:", error);
        return NextResponse.json({ error: error.message }, { status: 400 });
    }
});
// PUT Update Property
export const PUT = withVayvaAPI(PERMISSIONS.PRODUCTS_MANAGE, async (request, { storeId, params }) => {
    try {
        const data = await request.json();
        const { id: accommodationId } = await params;
        // Resolve IDs. The ID passed is likely the AccommodationProduct ID, but we need to update generic Product too.
        // Or is it Product ID? UI lists Properties. Let's assume ID passed is the ID of the resource listed in the table.
        // In PropertiesPage, key={prop.id}. `prop` is `AccommodationProduct`. So ID is `AccommodationProduct.id`.
        const accommodation = await prisma.accommodationProduct.findUnique({
            where: { id: accommodationId },
            include: { product: true }
        });
        if (!accommodation || accommodation.product.storeId !== storeId) {
            return NextResponse.json({ error: "Property not found" }, { status: 404 });
        }
        // Transaction update
        const result = await prisma.$transaction(async (tx: unknown) => {
            // 1. Update Base Product
            // 1. Update Base Product & Images
            await tx.product.update({
                where: { id: accommodation.productId },
                data: {
                    title: data.title,
                    description: data.description,
                    price: data.price,
                    productImages: {
                        deleteMany: {},
                        createMany: {
                            data: (data.images || []).map((url: unknown, index: unknown) => ({
                                url,
                                position: index
                            }))
                        }
                    }
                }
            });
            // 2. Update Accommodation Detail
            return await tx.accommodationProduct.update({
                where: { id: accommodationId },
                data: {
                    type: (data.type || "ROOM"),
                    maxGuests: Number(data.maxGuests) || 1,
                    bedCount: Number(data.bedCount) || 1,
                    bathrooms: Number(data.bathrooms) || 1,
                    totalUnits: Number(data.totalUnits) || 1,
                    amenities: data.amenities || [],
                },
                include: { product: true }
            });
        });
        return NextResponse.json(result);
    }
    catch (error) {
        console.error("Property Update Error:", error);
        return NextResponse.json({ error: error.message }, { status: 400 });
    }
});
// DELETE Property
export const DELETE = withVayvaAPI(PERMISSIONS.PRODUCTS_MANAGE, async (request, { storeId, params }) => {
    const { id } = await params;
    try {
        // Verify ownership
        const accommodation = await prisma.accommodationProduct.findUnique({
            where: { id: id },
            include: { product: true }
        });
        if (!accommodation || accommodation.product.storeId !== storeId) {
            return NextResponse.json({ error: "Property not found" }, { status: 404 });
        }
        // Delete Base Product (Cascade will delete AccommodationProduct)
        await prisma.product.delete({
            where: { id: accommodation.productId }
        });
        return NextResponse.json({ success: true });
    }
    catch (error) {
        console.error("Property Delete Error:", error);
        return NextResponse.json({ error: error.message }, { status: 400 });
    }
});
