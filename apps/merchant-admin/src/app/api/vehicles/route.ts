import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

/**
 * GET /api/vehicles
 * List all vehicles for the store
 */
export async function GET(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.storeId) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { searchParams } = new URL(req.url);
        const status = searchParams.get("status");
        const make = searchParams.get("make");
        const type = searchParams.get("type"); // car, motorcycle, truck, etc.

        const vehicles = await prisma.product.findMany({
            where: {
                storeId: session.user.storeId,
                productType: "VEHICLE",
                ...(status && { status }),
            },
            include: {
                productImages: { take: 1, orderBy: { position: "asc" } },
                vehicleProduct: true,
            },
            orderBy: { createdAt: "desc" },
        });

        // Filter by make/type if provided (from vehicleProduct metadata)
        let filtered = vehicles;
        if (make) {
            filtered = filtered.filter((v: any) => 
                v.vehicleProduct?.make?.toLowerCase() === make.toLowerCase()
            );
        }
        if (type) {
            filtered = filtered.filter((v: any) => 
                v.vehicleProduct?.vehicleType?.toLowerCase() === type.toLowerCase()
            );
        }

        return NextResponse.json({
            vehicles: filtered.map((v: any) => ({
                id: v.id,
                title: v.title,
                description: v.description,
                price: Number(v.price),
                status: v.status,
                image: v.productImages[0]?.url || null,
                make: v.vehicleProduct?.make,
                model: v.vehicleProduct?.model,
                year: v.vehicleProduct?.year,
                mileage: v.vehicleProduct?.mileage,
                vin: v.vehicleProduct?.vin,
                fuelType: v.vehicleProduct?.fuelType,
                transmission: v.vehicleProduct?.transmission,
                color: v.vehicleProduct?.color,
                vehicleType: v.vehicleProduct?.vehicleType,
                createdAt: v.createdAt,
            })),
            total: filtered.length,
        });
    } catch (error: any) {
        console.error("GET /api/vehicles error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

/**
 * POST /api/vehicles
 * Create a new vehicle listing
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
            make,
            model,
            year,
            mileage,
            vin,
            fuelType,
            transmission,
            color,
            vehicleType,
            images,
        } = body;

        if (!title || !price || !make || !model || !year) {
            return NextResponse.json(
                { error: "Title, price, make, model, and year are required" },
                { status: 400 }
            );
        }

        // Generate handle
        const handle = `${make}-${model}-${year}-${Date.now()}`
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, "-");

        const vehicle = await prisma.product.create({
            data: {
                storeId: session.user.storeId,
                title,
                description: description || "",
                price,
                handle,
                status: "ACTIVE",
                productType: "VEHICLE",
                vehicleProduct: {
                    create: {
                        make,
                        model,
                        year: parseInt(year),
                        mileage: mileage ? parseInt(mileage) : 0,
                        vin: vin || undefined,
                        fuelType: fuelType || "PETROL",
                        transmission: transmission || "AUTOMATIC",
                        color: color || undefined,
                        bodyType: vehicleType || "Sedan",
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
                vehicleProduct: true,
                productImages: true,
            },
        });

        return NextResponse.json({ vehicle }, { status: 201 });
    } catch (error: any) {
        console.error("POST /api/vehicles error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
