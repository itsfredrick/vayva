import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

/**
 * GET /api/vehicles/[id]
 * Get a single vehicle
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

        const vehicle = await prisma.product.findFirst({
            where: {
                id,
                storeId: session.user.storeId,
                productType: "VEHICLE",
            },
            include: {
                productImages: { orderBy: { position: "asc" } },
                vehicleProduct: true,
            },
        });

        if (!vehicle) {
            return NextResponse.json({ error: "Vehicle not found" }, { status: 404 });
        }

        return NextResponse.json({ vehicle });
    } catch (error: any) {
        console.error("GET /api/vehicles/[id] error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

/**
 * PATCH /api/vehicles/[id]
 * Update a vehicle
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
            make,
            model,
            year,
            mileage,
            vin,
            fuelType,
            transmission,
            color,
            bodyType,
            condition,
        } = body;

        // Verify ownership
        const existing = await prisma.product.findFirst({
            where: {
                id,
                storeId: session.user.storeId,
                productType: "VEHICLE",
            },
        });

        if (!existing) {
            return NextResponse.json({ error: "Vehicle not found" }, { status: 404 });
        }

        const vehicle = await prisma.product.update({
            where: { id },
            data: {
                ...(title && { title }),
                ...(description !== undefined && { description }),
                ...(price !== undefined && { price }),
                ...(status && { status }),
                vehicleProduct: {
                    update: {
                        ...(make && { make }),
                        ...(model && { model }),
                        ...(year && { year: parseInt(year) }),
                        ...(mileage !== undefined && { mileage: parseInt(mileage) }),
                        ...(vin !== undefined && { vin }),
                        ...(fuelType && { fuelType }),
                        ...(transmission && { transmission }),
                        ...(color !== undefined && { color }),
                        ...(bodyType && { bodyType }),
                        ...(condition !== undefined && { condition }),
                    },
                },
            },
            include: {
                vehicleProduct: true,
                productImages: true,
            },
        });

        return NextResponse.json({ vehicle });
    } catch (error: any) {
        console.error("PATCH /api/vehicles/[id] error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

/**
 * DELETE /api/vehicles/[id]
 * Delete a vehicle
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

        // Verify ownership
        const existing = await prisma.product.findFirst({
            where: {
                id,
                storeId: session.user.storeId,
                productType: "VEHICLE",
            },
        });

        if (!existing) {
            return NextResponse.json({ error: "Vehicle not found" }, { status: 404 });
        }

        await prisma.product.delete({
            where: { id },
        });

        return NextResponse.json({ success: true });
    } catch (error: any) {
        console.error("DELETE /api/vehicles/[id] error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
