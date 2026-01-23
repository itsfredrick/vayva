import { NextResponse } from "next/server";
import { prisma } from "@vayva/db";
import { withVayvaAPI } from "@/lib/api-handler";
import { PERMISSIONS } from "@/lib/team/permissions";
export const GET = withVayvaAPI(PERMISSIONS.PRODUCTS_VIEW, async (req, { storeId, params }) => {
    try {
        const { id: collectionId } = await params;
        const collection = await prisma.collection.findUnique({
            where: { id: collectionId },
            include: { _count: { select: { collectionProducts: true } } }
        });
        if (!collection || collection.storeId !== storeId) {
            return NextResponse.json({ error: "Collection not found" }, { status: 404 });
        }
        return NextResponse.json({ success: true, data: collection });
    }
    catch (error) {
        return NextResponse.json({ error: "Internal Error" }, { status: 500 });
    }
});
export const DELETE = withVayvaAPI(PERMISSIONS.PRODUCTS_MANAGE, async (req, { storeId, params }) => {
    try {
        const { id: collectionId } = await params;
        const collection = await prisma.collection.findUnique({ where: { id: collectionId } });
        if (!collection || collection.storeId !== storeId) {
            return NextResponse.json({ error: "Not found" }, { status: 404 });
        }
        await prisma.collection.delete({ where: { id: collectionId } });
        return NextResponse.json({ success: true });
    }
    catch (error) {
        return NextResponse.json({ error: "Failed to delete" }, { status: 500 });
    }
});
export const PUT = withVayvaAPI(PERMISSIONS.PRODUCTS_EDIT, async (req, { storeId, params }) => {
    try {
        const { id: collectionId } = await params;
        const body = await req.json();
        const collection = await prisma.collection.findUnique({ where: { id: collectionId } });
        if (!collection || collection.storeId !== storeId) {
            return NextResponse.json({ error: "Not found" }, { status: 404 });
        }
        const updated = await prisma.collection.update({
            where: { id: collectionId },
            data: {
                title: body.title,
                description: body.description,
                handle: body.handle ? body.handle.toLowerCase().replace(/\s+/g, "-") : undefined,
                updatedAt: new Date()
            }
        });
        return NextResponse.json({ success: true, data: updated });
    }
    catch (error) {
        return NextResponse.json({ error: "Failed to update" }, { status: 500 });
    }
});
