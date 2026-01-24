import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
export async function GET() {
    try {
        const incidents = await prisma.rescueIncident.findMany({
            where: {
                status: {
                    not: "resolved",
                },
            },
            orderBy: { createdAt: "desc" },
        });
        return NextResponse.json({ incidents });
    }
    catch (error: any) {
        console.error("Fetch Incidents Error:", error);
        return NextResponse.json({ error: "Failed to fetch incidents" }, { status: 500 });
    }
}
