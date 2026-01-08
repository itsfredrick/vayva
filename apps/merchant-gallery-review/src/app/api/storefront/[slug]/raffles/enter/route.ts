import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@vayva/db";

export async function POST(
    req: NextRequest,
    { params }: { params: Promise<{ slug: string }> },
) {
    try {
        const { slug } = await params;
        const body = await req.json();
        const { raffleId, email, userId } = body;

        if (!raffleId || !email) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        const store = await prisma.store.findUnique({
            where: { slug },
            select: { id: true },
        });

        if (!store) {
            return NextResponse.json({ error: "Store not found" }, { status: 404 });
        }

        const raffleDelegate = (prisma as any).raffleEntry;
        if (!raffleDelegate) {
            return NextResponse.json({ error: "Raffle system not initialized" }, { status: 503 });
        }

        // Check existing entry
        const existing = await raffleDelegate.findUnique({
            where: {
                raffleId_customerEmail: {
                    raffleId,
                    customerEmail: email
                }
            }
        });

        if (existing) {
            return NextResponse.json({ error: "Already entered" }, { status: 409 });
        }

        const entry = await raffleDelegate.create({
            data: {
                storeId: store.id,
                raffleId,
                customerEmail: email,
                userId: userId || null,
                status: "PENDING"
            }
        });

        return NextResponse.json({ success: true, entryId: entry.id });

    } catch (error) {
        console.error("Raffle entry error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
