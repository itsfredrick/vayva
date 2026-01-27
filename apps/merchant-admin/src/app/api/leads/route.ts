import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

/**
 * GET /api/leads
 * List all leads for automotive/real estate
 */
export async function GET(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.storeId) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { searchParams } = new URL(req.url);
        const status = searchParams.get("status");
        const source = searchParams.get("source");

        const leads = await prisma.customer.findMany({
            where: {
                storeId: session.user.storeId,
                ...(status && { tags: { has: `status:${status}` } }),
                ...(source && { tags: { has: `source:${source}` } }),
            },
            orderBy: { createdAt: "desc" },
        });

        return NextResponse.json({
            leads: leads.map((l: any) => ({
                id: l.id,
                name: `${l.firstName} ${l.lastName}`.trim(),
                email: l.email,
                phone: l.phone,
                notes: l.notes,
                tags: l.tags,
                status: l.tags?.find((t: string) => t.startsWith("status:"))?.replace("status:", "") || "new",
                source: l.tags?.find((t: string) => t.startsWith("source:"))?.replace("source:", "") || "direct",
                createdAt: l.createdAt,
            })),
            total: leads.length,
        });
    } catch (error: any) {
        console.error("GET /api/leads error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

/**
 * POST /api/leads
 * Create a new lead
 */
export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.storeId) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const body = await req.json();
        const {
            firstName,
            lastName,
            email,
            phone,
            notes,
            source,
            interestedIn,
        } = body;

        if (!firstName && !email && !phone) {
            return NextResponse.json(
                { error: "At least name, email, or phone is required" },
                { status: 400 }
            );
        }

        const tags = ["status:new"];
        if (source) tags.push(`source:${source}`);
        if (interestedIn) tags.push(`interest:${interestedIn}`);

        const lead = await prisma.customer.create({
            data: {
                storeId: session.user.storeId,
                firstName: firstName || "",
                lastName: lastName || "",
                email: email || null,
                phone: phone || null,
                notes: notes || null,
                tags,
            },
        });

        return NextResponse.json({ lead }, { status: 201 });
    } catch (error: any) {
        console.error("POST /api/leads error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
