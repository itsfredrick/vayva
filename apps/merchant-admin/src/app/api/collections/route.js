import { NextResponse } from "next/server";
import { prisma } from "@vayva/db";
import { withVayvaAPI } from "@/lib/api-handler";
import { PERMISSIONS } from "@/lib/team/permissions";
export const GET = withVayvaAPI(PERMISSIONS.PRODUCTS_VIEW, async (req, { storeId }) => {
    try {
        const collections = await prisma.collection.findMany({
            where: { storeId },
            include: {
                _count: {
                    select: { collectionProducts: true },
                },
            },
            orderBy: { updatedAt: "desc" },
        });
        const formatted = collections.map((col) => ({
            id: col.id,
            name: col.title,
            handle: col.handle,
            count: col._count.collectionProducts,
            visibility: "Public", // Default for now
            updated: col.updatedAt.toISOString(),
        }));
        return NextResponse.json({
            success: true,
            data: formatted,
        });
    }
    catch (error) {
        console.error("Collections API Error:", error);
        return NextResponse.json({ error: "Failed to fetch collections" }, { status: 500 });
    }
});
export const POST = withVayvaAPI(PERMISSIONS.PRODUCTS_EDIT, async (req, { storeId }) => {
    try {
        const body = await req.json();
        const { title, handle, description } = body;
        if (!title || !handle) {
            return NextResponse.json({ error: "Title and handle are required" }, { status: 400 });
        }
        // 1. Check for handle collision within store
        const existing = await prisma.collection.findUnique({
            where: { storeId_handle: { storeId, handle } },
        });
        if (existing) {
            return NextResponse.json({ error: "A collection with this handle already exists in your store." }, { status: 409 });
        }
        // 2. Create Collection
        const collection = await prisma.collection.create({
            data: {
                storeId,
                title,
                handle: handle.toLowerCase().replace(/\s+/g, "-"),
                description,
            },
        });
        return NextResponse.json({
            success: true,
            data: collection,
        });
    }
    catch (error) {
        console.error("Collection Create Error:", error);
        return NextResponse.json({ error: error.message || "Failed to create collection" }, { status: 500 });
    }
});
