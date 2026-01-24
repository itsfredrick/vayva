
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@vayva/db";

// GET /api/vehicles
// ?type=years
// ?type=makes&year=2024
// ?type=models&year=2024&make=Toyota
export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get("type");

    // In a real multi-tenant app, we should filter by storeId (from hostname/header), 
    // but for now we assume global vehicle data or use a specific store if passed.
    // Ideally, we get storeId via domain middleware injections headers.
    const storeId = request.headers.get("x-store-id");

    try {
        if (type === "years") {
            // Get distinct years
            const years = await prisma.vehicleProduct.groupBy({
                by: ['year'],
                where: storeId ? { product: { storeId } } : {},
                orderBy: { year: 'desc' }
            });
            return NextResponse.json({ years: years.map(y => y.year) });
        }

        if (type === "makes") {
            const year = parseInt(searchParams.get("year") || "0");
            const makes = await prisma.vehicleProduct.groupBy({
                by: ['make'],
                where: {
                    year: year || undefined,
                    ...(storeId ? { product: { storeId } } : {})
                },
                orderBy: { make: 'asc' }
            });
            return NextResponse.json({ makes: makes.map(m => m.make) });
        }

        if (type === "models") {
            const year = parseInt(searchParams.get("year") || "0");
            const make = searchParams.get("make");

            if (!make) return NextResponse.json({ models: [] });

            const models = await prisma.vehicleProduct.groupBy({
                by: ['model'],
                where: {
                    year: year || undefined,
                    make: make,
                    ...(storeId ? { product: { storeId } } : {})
                },
                orderBy: { model: 'asc' }
            });
            return NextResponse.json({ models: models.map(m => m.model) });
        }

        return NextResponse.json({ error: "Invalid type" }, { status: 400 });

    } catch (e: any) {
        console.error("Vehicle API Error:", e);
        return NextResponse.json({ error: "Internal Error" }, { status: 500 });
    }
}
