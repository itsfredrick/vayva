import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

/**
 * GET /api/quotes/[id]
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

        const quote = await prisma.booking.findFirst({
            where: {
                id,
                storeId: session.user.storeId,
                metadata: {
                    path: ["type"],
                    equals: "quote_request",
                },
            },
        });

        if (!quote) {
            return NextResponse.json({ error: "Quote not found" }, { status: 404 });
        }

        const meta = quote.metadata as any;
        return NextResponse.json({
            quote: {
                id: quote.id,
                quoteNumber: meta?.quoteNumber,
                companyName: meta?.companyName,
                contactName: meta?.contactName,
                contactEmail: meta?.contactEmail,
                contactPhone: meta?.contactPhone,
                items: meta?.items || [],
                total: meta?.total || 0,
                status: quote.status,
                notes: quote.notes,
                validUntil: quote.endsAt,
                createdAt: quote.createdAt,
            },
        });
    } catch (error: any) {
        console.error("GET /api/quotes/[id] error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

/**
 * PATCH /api/quotes/[id]
 * Update quote status or details
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
        const { status, notes } = body;

        const existing = await prisma.booking.findFirst({
            where: {
                id,
                storeId: session.user.storeId,
                metadata: {
                    path: ["type"],
                    equals: "quote_request",
                },
            },
        });

        if (!existing) {
            return NextResponse.json({ error: "Quote not found" }, { status: 404 });
        }

        const quote = await prisma.booking.update({
            where: { id },
            data: {
                ...(status && { status }),
                ...(notes !== undefined && { notes }),
            },
        });

        return NextResponse.json({ quote });
    } catch (error: any) {
        console.error("PATCH /api/quotes/[id] error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

/**
 * DELETE /api/quotes/[id]
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

        const existing = await prisma.booking.findFirst({
            where: {
                id,
                storeId: session.user.storeId,
                metadata: {
                    path: ["type"],
                    equals: "quote_request",
                },
            },
        });

        if (!existing) {
            return NextResponse.json({ error: "Quote not found" }, { status: 404 });
        }

        await prisma.booking.delete({
            where: { id },
        });

        return NextResponse.json({ success: true });
    } catch (error: any) {
        console.error("DELETE /api/quotes/[id] error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
