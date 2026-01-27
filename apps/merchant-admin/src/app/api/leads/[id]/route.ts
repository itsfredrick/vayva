import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

/**
 * GET /api/leads/[id]
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

        const lead = await prisma.customer.findFirst({
            where: {
                id,
                storeId: session.user.storeId,
            },
        });

        if (!lead) {
            return NextResponse.json({ error: "Lead not found" }, { status: 404 });
        }

        return NextResponse.json({ lead });
    } catch (error: any) {
        console.error("GET /api/leads/[id] error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

/**
 * PATCH /api/leads/[id]
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
        const { firstName, lastName, email, phone, notes, status, tags } = body;

        const existing = await prisma.customer.findFirst({
            where: {
                id,
                storeId: session.user.storeId,
            },
        });

        if (!existing) {
            return NextResponse.json({ error: "Lead not found" }, { status: 404 });
        }

        // Update status in tags
        let updatedTags = existing.tags || [];
        if (status) {
            updatedTags = updatedTags.filter((t: string) => !t.startsWith("status:"));
            updatedTags.push(`status:${status}`);
        }
        if (tags) {
            updatedTags = [...new Set([...updatedTags, ...tags])];
        }

        const lead = await prisma.customer.update({
            where: { id },
            data: {
                ...(firstName !== undefined && { firstName }),
                ...(lastName !== undefined && { lastName }),
                ...(email !== undefined && { email }),
                ...(phone !== undefined && { phone }),
                ...(notes !== undefined && { notes }),
                tags: updatedTags,
            },
        });

        return NextResponse.json({ lead });
    } catch (error: any) {
        console.error("PATCH /api/leads/[id] error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

/**
 * DELETE /api/leads/[id]
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

        const existing = await prisma.customer.findFirst({
            where: {
                id,
                storeId: session.user.storeId,
            },
        });

        if (!existing) {
            return NextResponse.json({ error: "Lead not found" }, { status: 404 });
        }

        await prisma.customer.delete({
            where: { id },
        });

        return NextResponse.json({ success: true });
    } catch (error: any) {
        console.error("DELETE /api/leads/[id] error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
